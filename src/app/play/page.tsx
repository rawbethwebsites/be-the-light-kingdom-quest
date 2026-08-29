'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Zap, Shield, Trophy, Wifi, WifiOff, 
  Check, AlertCircle, Loader2, ArrowRight, Sparkles
} from 'lucide-react';
import { supabase, type Database, setPlayerContext, getPlayerContext, clearPlayerContext } from '@/lib/supabase';
import { cn, validateNickname, TEAM_COLORS, TEAM_ICONS } from '@/lib/utils';
import { NavBar } from '@/components/NavBar';

type Room = Database['public']['Tables']['rooms']['Row'];
type Team = Database['public']['Tables']['teams']['Row'];
type Player = Database['public']['Tables']['players']['Row'];
type GameQuestion = Database['public']['Tables']['game_questions']['Row'];

type GameState = 'welcome' | 'join' | 'lobby' | 'playing' | 'revealed' | 'ended';

const SAFE_QUESTION_SELECT = 'id,game_key,sequence,question_text,question_type,options,explanation,bible_reference,source_label,time_limit_seconds,difficulty,is_active,created_at';

function getRemainingSeconds(endsAt?: string | null) {
  if (!endsAt) return 0;
  return Math.max(0, Math.ceil((new Date(endsAt).getTime() - Date.now()) / 1000));
}

export default function PlayPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-tbn-gold" /></div>}>
      <PlayContent />
    </Suspense>
  );
}

function PlayContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roomCodeFromUrl = searchParams.get('room')?.toUpperCase();

  const [gameState, setGameState] = useState<GameState>('welcome');
  const [roomCode, setRoomCode] = useState('');
  const [room, setRoom] = useState<Room | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [player, setPlayer] = useState<Player | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [nickname, setNickname] = useState('');
  const [nicknameError, setNicknameError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState<GameQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [teamScore, setTeamScore] = useState(0);
  const [teamRank, setTeamRank] = useState(0);
  const [revealedAnswer, setRevealedAnswer] = useState<number | null>(null);

  // Check online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Restore session on mount
  useEffect(() => {
    const context = getPlayerContext();

    // QR/deep-link join should show the nickname form with room code prefilled.
    // Do not move to the spinner-only 'join' state — that state has no form/actions.
    if (roomCodeFromUrl) {
      setRoomCode(roomCodeFromUrl);
      if (context.roomCode && context.roomCode !== roomCodeFromUrl) {
        clearPlayerContext();
        setPlayer(null);
        setRoom(null);
        setGameState('welcome');
        return;
      }
      if (!context.sessionToken || !context.playerId) {
        setGameState('welcome');
        return;
      }
    }

    if (context.sessionToken && context.playerId) {
      restoreSession(context.sessionToken, context.playerId);
    }
  }, [roomCodeFromUrl]);

  // Subscribe to room updates
  useEffect(() => {
    if (!room) return;

    const roomChannel = supabase
      .channel(`room:${room.id}`)
      .on('postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'rooms', filter: `id=eq.${room.id}` },
        async (payload) => {
          const updatedRoom = payload.new as Room;
          setRoom(updatedRoom);
          
          if (updatedRoom.status === 'ended') {
            setGameState('ended');
            return;
          }

          // If active_question_id changed, load the new question and fully reset
          // the player's reveal/answer state. Without this, phones stay on the
          // previous reveal screen and show the next question's option at the old
          // revealed index, which looks like the next answer leaked.
          if (updatedRoom.status === 'active' && updatedRoom.active_question_id) {
            const isNewQuestion = updatedRoom.active_question_id !== currentQuestion?.id;
            const { data: qData } = await supabase
              .from('game_questions')
              .select(SAFE_QUESTION_SELECT)
              .eq('id', updatedRoom.active_question_id)
              .single();
            
            if (qData) {
              setCurrentQuestion(qData as GameQuestion);
              const remaining = getRemainingSeconds(updatedRoom.timer_ends_at);
              setTimerSeconds(remaining || 30);

              if (isNewQuestion || gameState === 'lobby' || gameState === 'revealed') {
                setHasSubmitted(false);
                setSelectedAnswer(null);
                setRevealedAnswer(null);
                setGameState('playing');
              }
            }
          }
        }
      )
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'game_events', filter: `room_id=eq.${room.id}` },
        (payload) => {
          const event = payload.new as any;
          if (event.event_type === 'answer_revealed' && event.payload) {
            if (event.payload.question_id && room.active_question_id && event.payload.question_id !== room.active_question_id) {
              return;
            }
            setRevealedAnswer(event.payload.correct_option);
            setGameState('revealed');
          }
        }
      )
      .subscribe();

    const teamsChannel = supabase
      .channel('teams')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'teams', filter: `room_id=eq.${room.id}` },
        (payload) => {
          if (payload.eventType === 'UPDATE') {
            const updatedTeam = payload.new as Team;
            setTeams(prev => prev.map(t => t.id === updatedTeam.id ? updatedTeam : t));
            
            // Update local score if it's our team
            if (player?.team_id === updatedTeam.id) {
              setTeamScore(updatedTeam.score);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(roomChannel);
      supabase.removeChannel(teamsChannel);
    };
  }, [room, player?.team_id, gameState]);

  // Timer countdown follows the room deadline, not local answer state.
  useEffect(() => {
    if (gameState !== 'playing' || !room?.timer_ends_at) return;

    const tick = () => setTimerSeconds(getRemainingSeconds(room.timer_ends_at));
    tick();
    const interval = setInterval(tick, 250);
    return () => clearInterval(interval);
  }, [gameState, room?.timer_ends_at]);

  const restoreSession = async (sessionToken: string, playerId: string) => {
    try {
      const { data, error } = await supabase
        .from('players')
        .select('*, teams(*)')
        .eq('id', playerId)
        .eq('session_token', sessionToken)
        .single();

      if (error || !data) {
        clearPlayerContext();
        setGameState('welcome');
        return;
      }

      setPlayer(data);
      setRoomCode(data.room_id); // Will need to fetch room separately
      loadRoom(data.room_id);
      setGameState('lobby');
    } catch (err) {
      clearPlayerContext();
      setGameState('welcome');
    }
  };

  const loadRoom = async (roomId: string) => {
    const { data } = await supabase
      .from('rooms')
      .select('*')
      .eq('id', roomId)
      .single();
    
    if (data) {
      setRoom(data);
      setRoomCode(data.code);
      await loadTeams(roomId);

      if (data.status === 'active' && data.active_question_id) {
        const { data: qData } = await supabase
          .from('game_questions')
          .select(SAFE_QUESTION_SELECT)
          .eq('id', data.active_question_id)
          .single();

        if (qData) {
          setCurrentQuestion(qData as GameQuestion);
          setTimerSeconds(getRemainingSeconds(data.timer_ends_at) || 30);
          setHasSubmitted(false);
          setSelectedAnswer(null);
          setRevealedAnswer(null);
          setGameState('playing');
        }
      }
    }
  };

  const loadTeams = async (roomId: string) => {
    const { data } = await supabase
      .from('teams')
      .select('*')
      .eq('room_id', roomId)
      .order('created_at');
    
    if (data) setTeams(data);
  };

  const validateAndJoin = async () => {
    const validation = validateNickname(nickname);
    if (!validation.valid) {
      setNicknameError(validation.error || 'Invalid nickname');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // First, get or create room
      let roomId: string;
      const { data: roomData } = await supabase
        .from('rooms')
        .select('id, joins_locked, status')
        .eq('code', roomCode.toUpperCase())
        .single();

      if (!roomData) {
        setError('Room not found. Please check the room code.');
        setIsLoading(false);
        return;
      }

      if (roomData.joins_locked || roomData.status === 'ended') {
        setError('This room is no longer accepting new players.');
        setIsLoading(false);
        return;
      }

      roomId = roomData.id;

      // Create or get a team (for now, create a new team for the player)
      const teamColor = TEAM_COLORS[Math.floor(Math.random() * TEAM_COLORS.length)];
      const teamIcon = TEAM_ICONS[Math.floor(Math.random() * TEAM_ICONS.length)];
      
      const { data: teamData, error: teamError } = await supabase
        .from('teams')
        .insert([{
          room_id: roomId,
          name: `${nickname}'s Team`,
          color: teamColor.value,
          icon: teamIcon.name,
        }])
        .select()
        .single();

      if (teamError) throw teamError;

      // Create player — let DB auto-generate session_token UUID
      const { data: playerData, error: playerError } = await supabase
        .from('players')
        .insert([{
          room_id: roomId,
          team_id: teamData.id,
          nickname: nickname.trim(),
        }])
        .select()
        .single();

      if (playerError) throw playerError;

      // Save session
      setPlayerContext(playerData.session_token, playerData.id, teamData.id, roomCode.toUpperCase());
      setPlayer(playerData);
      setSelectedTeam(teamData.id);
      
      // Load room and teams
      await loadRoom(roomId);
      
      setGameState('lobby');
    } catch (err: any) {
      setError(err.message || 'Failed to join room');
    } finally {
      setIsLoading(false);
    }
  };

  const submitAnswer = async (optionIndex: number) => {
    if (!player || !currentQuestion || !room || hasSubmitted) return;

    setIsLoading(true);
    setSelectedAnswer(optionIndex);

    const submitTime = Date.now();

    try {
      const { error } = await supabase
        .from('answers')
        .insert([{
          room_id: room.id,
          player_id: player.id,
          team_id: player.team_id!,
          question_id: currentQuestion.id,
          selected_option: optionIndex,
          response_time_ms: submitTime - (room.timer_started_at ? new Date(room.timer_started_at).getTime() : Date.now()),
        }]);

      if (error) throw error;

      setHasSubmitted(true);
      // Stay on the question screen and show "Waiting for reveal".
      // The host's revealAnswer() inserts a game_event that moves players to 'revealed'.
      setGameState('playing');
    } catch (err: any) {
      setError(err.message || 'Failed to submit answer');
    } finally {
      setIsLoading(false);
    }
  };

  const reconnect = () => {
    const context = getPlayerContext();
    if (context.sessionToken && context.playerId) {
      restoreSession(context.sessionToken, context.playerId);
    }
  };

  const leaveGame = () => {
    clearPlayerContext();
    setPlayer(null);
    setRoom(null);
    setGameState('welcome');
  };

  // Render based on game state
  const renderContent = () => {
    switch (gameState) {
      case 'welcome':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <Sparkles className="w-16 h-16 text-tbn-gold mx-auto mb-6 animate-pulse" />
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Welcome, Light Bearer
            </h1>
            <p className="text-tbn-cream/70 mb-8 max-w-md mx-auto">
              Join your team and get ready to shine. Enter the room code from the host screen or scan the QR code.
            </p>
            
            <div className="max-w-sm mx-auto space-y-4">
              <input
                type="text"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                placeholder="ROOM CODE"
                className="w-full p-4 bg-tbn-navy/50 border border-tbn-gold/20 rounded-lg text-tbn-cream text-center text-2xl tracking-widest font-display font-bold focus:outline-none focus:border-tbn-gold"
                maxLength={6}
                autoFocus
              />
              
              <input
                type="text"
                value={nickname}
                onChange={(e) => {
                  setNickname(e.target.value);
                  setNicknameError(null);
                }}
                placeholder="Your Nickname"
                className="w-full p-4 bg-tbn-navy/50 border border-tbn-gold/20 rounded-lg text-tbn-cream text-center focus:outline-none focus:border-tbn-gold"
                maxLength={30}
              />
              
              {nicknameError && (
                <p className="text-tbn-orange text-sm">{nicknameError}</p>
              )}
              
              <button
                onClick={validateAndJoin}
                disabled={isLoading || !roomCode || !nickname}
                className="btn-primary w-full disabled:btn-disabled"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 mx-auto animate-spin" />
                ) : (
                  <>
                    Join Game
                    <ArrowRight className="inline-block w-5 h-5 ml-2" />
                  </>
                )}
              </button>
            </div>
            
            {error && (
              <div className="mt-6 p-4 bg-tbn-orange/20 border border-tbn-orange/50 rounded-lg flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-tbn-orange" />
                <span className="text-tbn-orange">{error}</span>
              </div>
            )}
          </motion.div>
        );

      case 'join':
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <Loader2 className="w-12 h-12 text-tbn-gold mx-auto mb-4 animate-spin" />
            <p className="text-tbn-cream/70">Joining room {roomCode}...</p>
          </motion.div>
        );

      case 'lobby':
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-center mb-8">
              <h1 className="text-2xl md:text-3xl font-display font-bold mb-2">
                Waiting to Start
              </h1>
              <p className="text-tbn-cream/60">
                Room: <span className="text-tbn-gold font-bold">{roomCode}</span>
              </p>
            </div>

            {player && player.team_id && (
              <div className="card-glow mb-6">
                <p className="text-tbn-cream/60 text-sm mb-2">Your Team</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Users className="w-8 h-8 text-tbn-gold" />
                    <span className="text-lg font-bold">
                      {teams.find(t => t.id === player.team_id)?.name || 'Your Team'}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-display font-bold text-tbn-gold">
                      {teamScore}
                    </p>
                    <p className="text-xs text-tbn-cream/60">points</p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <p className="text-tbn-cream/60 text-sm">Other Teams</p>
              {teams.filter(t => t.id !== player?.team_id).map(team => (
                <div
                  key={team.id}
                  className="p-4 bg-tbn-navy/30 rounded-lg flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn('w-3 h-3 rounded-full', `bg-${team.color}`)} />
                    <span>{team.name}</span>
                  </div>
                  <span className="text-tbn-gold font-bold">{team.score}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <p className="text-tbn-cream/50 text-sm mb-4">
                The host will start the game soon...
              </p>
              <button
                onClick={leaveGame}
                className="text-tbn-cream/60 hover:text-tbn-cream text-sm"
              >
                Leave Game
              </button>
            </div>
          </motion.div>
        );

      case 'playing':
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {/* Timer */}
            <div className="text-center mb-6">
              <div className={cn(
                'text-6xl md:text-7xl font-display font-bold',
                timerSeconds <= 5 ? 'text-tbn-orange' : 'text-tbn-gold'
              )}>
                {timerSeconds}
              </div>
              <p className="text-tbn-cream/60 text-sm">seconds remaining</p>
            </div>

            {/* Question */}
            {currentQuestion && (
              <div className="card-glow mb-6">
                <p className="text-lg md:text-xl font-medium mb-6">
                  {currentQuestion.question_text}
                </p>
                
                <div className="space-y-3">
                  {(currentQuestion.options as string[]).map((option, i) => (
                    <button
                      key={i}
                      onClick={() => submitAnswer(i)}
                      disabled={hasSubmitted || isLoading}
                      className={cn(
                        'w-full p-4 rounded-lg border-2 text-left font-medium transition-all',
                        hasSubmitted && selectedAnswer === i
                          ? 'border-tbn-gold bg-tbn-gold/20'
                          : 'border-tbn-gold/30 hover:border-tbn-gold hover:bg-tbn-gold/10',
                        isLoading && 'opacity-50 cursor-not-allowed'
                      )}
                    >
                      <span className="text-tbn-gold font-bold mr-3">
                        {String.fromCharCode(65 + i)}.
                      </span>
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {hasSubmitted && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-tbn-mint/20 border border-tbn-mint/50 rounded-lg text-center"
              >
                <Check className="w-8 h-8 text-tbn-mint mx-auto mb-2" />
                <p className="font-bold text-tbn-mint">Answer Submitted!</p>
                <p className="text-tbn-mint/70 text-sm">Waiting for reveal...</p>
              </motion.div>
            )}

            {!isOnline && (
              <div className="mt-4 p-4 bg-tbn-orange/20 border border-tbn-orange/50 rounded-lg flex items-center gap-3">
                <WifiOff className="w-5 h-5 text-tbn-orange" />
                <div>
                  <p className="font-bold text-tbn-orange">Connection Lost</p>
                  <button onClick={reconnect} className="text-tbn-orange/80 text-sm underline">
                    Reconnect
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        );

      case 'revealed':
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {currentQuestion && revealedAnswer !== null && (
              <>
                <div className="text-center mb-6">
                  <p className="text-tbn-cream/60 mb-2">The correct answer was:</p>
                  <p className="text-2xl font-display font-bold text-tbn-gold">
                    {String.fromCharCode(65 + revealedAnswer)}.{' '}
                    {(currentQuestion.options as string[])[revealedAnswer]}
                  </p>
                </div>

                {currentQuestion.bible_reference && (
                  <div className="card-glow mb-6">
                    <p className="text-tbn-amber font-bold mb-2">
                      📖 {currentQuestion.bible_reference}
                    </p>
                    {currentQuestion.explanation && (
                      <p className="text-tbn-cream/70">{currentQuestion.explanation}</p>
                    )}
                  </div>
                )}

                <div className="text-center">
                  <p className="text-tbn-cream/60">
                    {selectedAnswer === revealedAnswer ? (
                      <span className="text-tbn-mint font-bold">✓ Correct! Well done!</span>
                    ) : (
                      <span className="text-tbn-cream/60">Your team&apos;s score will update soon</span>
                    )}
                  </p>
                </div>
              </>
            )}
          </motion.div>
        );

      case 'ended':
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <Trophy className="w-20 h-20 text-tbn-gold mx-auto mb-6" />
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Game Over!
            </h1>
            <p className="text-tbn-cream/70 mb-8">
              Thanks for playing Be The Light: Kingdom Quest
            </p>
            
            {player && player.team_id && (
              <div className="card-glow mb-8">
                <p className="text-tbn-cream/60 mb-2">Your Team</p>
                <p className="text-2xl font-bold mb-4">
                  {teams.find(t => t.id === player.team_id)?.name}
                </p>
                <div className="text-4xl font-display font-bold text-tbn-gold">
                  {teamScore} points
                </div>
              </div>
            )}

            <button
              onClick={() => {
                clearPlayerContext();
                router.push('/');
              }}
              className="btn-primary"
            >
              Back to Home
            </button>
          </motion.div>
        );
    }
  };

  return (
    <main className="min-h-screen bg-tbn-black text-tbn-cream">
      <NavBar current="play" />
      <div className="max-w-2xl mx-auto p-6 md:p-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-xl font-display font-bold text-gradient">
            BE THE LIGHT
          </h1>
          <div className="flex items-center gap-2">
            {isOnline ? (
              <Wifi className="w-5 h-5 text-tbn-mint" />
            ) : (
              <WifiOff className="w-5 h-5 text-tbn-orange" />
            )}
            {player && (
              <button
                onClick={leaveGame}
                className="text-tbn-cream/60 hover:text-tbn-cream text-sm"
              >
                Leave
              </button>
            )}
          </div>
        </header>

        {/* Content */}
        {renderContent()}
      </div>
    </main>
  );
}
