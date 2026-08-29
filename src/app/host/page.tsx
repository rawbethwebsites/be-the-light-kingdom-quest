'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, Users, Shield, Trophy, Play, Pause, RotateCcw, 
  ChevronRight, Eye, EyeOff, Lock, Unlock, Download,
  Settings, LogOut, Monitor, Volume2, VolumeX, Wifi, WifiOff,
  QrCode, Plus, Minus, X, Check, AlertCircle
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { supabase, type Database } from '@/lib/supabase';
import { cn, validateNickname, TEAM_COLORS, TEAM_ICONS } from '@/lib/utils';
import { NavBar } from '@/components/NavBar';
import { MISSION_TEMPLATES } from '@/lib/missions';

type Room = Database['public']['Tables']['rooms']['Row'];
type RoomInsert = Database['public']['Tables']['rooms']['Insert'];
type Team = Database['public']['Tables']['teams']['Row'];
type Player = Database['public']['Tables']['players']['Row'];
type GameQuestion = Database['public']['Tables']['game_questions']['Row'];

const GAMES = [
  { key: 'light_rush', name: 'Light Rush', icon: Zap, description: 'Bible Quiz', color: 'tbn-gold' },
  { key: 'truth_detector', name: 'Truth Detector', icon: Shield, description: 'Discernment Game', color: 'tbn-amber' },
  { key: 'kingdom_builders', name: 'Kingdom Builders', icon: Users, description: 'Mission Challenges', color: 'tbn-orange' },
];

export default function HostDashboard() {
  const router = useRouter();
  const [room, setRoom] = useState<Room | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [questions, setQuestions] = useState<GameQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hostToken, setHostToken] = useState<string | null>(null);
  
  // Game state
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [showQR, setShowQR] = useState(true);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  
  // Modal states
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [showRoomCode, setShowRoomCode] = useState(false);
  const [showPasscodeModal, setShowPasscodeModal] = useState(false);
  const [passcodeInput, setPasscodeInput] = useState('');
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showMissionModal, setShowMissionModal] = useState(false);
  const [selectedMission, setSelectedMission] = useState(MISSION_TEMPLATES[0]);

  // Load host session
  useEffect(() => {
    const token = localStorage.getItem('host_session_token');
    if (token) {
      setHostToken(token);
      loadRoom(token);
    } else {
      setShowPasscodeModal(true);
      setIsLoading(false);
    }
  }, []);

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

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && timerRunning) {
      setTimerRunning(false);
      // Auto-reveal or move on
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerSeconds]);

  // Subscribe to realtime updates
  useEffect(() => {
    if (!room) return;

    const teamsChannel = supabase
      .channel('teams')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'teams', filter: `room_id=eq.${room.id}` },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setTeams(prev => [...prev, payload.new as Team]);
          } else if (payload.eventType === 'UPDATE') {
            setTeams(prev => prev.map(t => t.id === payload.new.id ? payload.new as Team : t));
          } else if (payload.eventType === 'DELETE') {
            setTeams(prev => prev.filter(t => t.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    const playersChannel = supabase
      .channel('players')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'players', filter: `room_id=eq.${room.id}` },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setPlayers(prev => [...prev, payload.new as Player]);
          } else if (payload.eventType === 'UPDATE') {
            setPlayers(prev => prev.map(p => p.id === payload.new.id ? payload.new as Player : p));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(teamsChannel);
      supabase.removeChannel(playersChannel);
    };
  }, [room]);

  const loadRoom = async (token: string) => {
    try {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('host_session_token', token)
        .single() as { data: Room | null; error: any };

      if (error || !data) {
        localStorage.removeItem('host_session_token');
        setHostToken(null);
        setShowPasscodeModal(true);
        return;
      }

      setRoom(data);
      loadTeams(data.id);
      loadQuestions(data.active_game_key);
    } catch (err) {
      setError('Failed to load room');
    } finally {
      setIsLoading(false);
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

  const loadQuestions = async (gameKey: string | null) => {
    if (!gameKey) {
      setQuestions([]);
      return;
    }

    const { data } = await supabase
      .from('game_questions')
      .select('*')
      .eq('game_key', gameKey)
      .eq('is_active', true)
      .order('sequence');
    
    if (data) setQuestions(data);
  };

  const verifyPasscode = async () => {
    // In production, verify against environment variable via API
    if (passcodeInput.length >= 4) {
      const token = `host_${passcodeInput}_${Date.now()}`;
      localStorage.setItem('host_session_token', token);
      setHostToken(token);
      setShowPasscodeModal(false);
      setShowCreateRoom(true);
    }
  };

  const createRoom = async () => {
    try {
      const token = hostToken || `host_${Date.now()}`;
      const { data: insertData, error: insertError } = await supabase
        .from('rooms')
        .insert([{
          title: 'Kingdom Quest',
          status: 'lobby',
          host_session_token: token,
        }])
        .select()
        .single();
      
      if (insertError) throw insertError;
      if (!insertData) throw new Error('No data returned from insert');
      
      setRoom(insertData as Room);
      setShowCreateRoom(false);
      setShowRoomCode(true);
      loadTeams(insertData.id);
    } catch (err: any) {
      console.error('Create room error:', err);
      setError(`Failed to create room: ${err.message || err}`);
    }
  };

  const startGame = async (gameKey: string) => {
    if (!room) return;

    try {
      await supabase
        .from('rooms')
        .update({
          status: 'active',
          active_game_key: gameKey,
          active_question_index: 0,
          joins_locked: true,
        })
        .eq('id', room.id);

      setActiveGame(gameKey);
      setActiveQuestionIndex(0);
      loadQuestions(gameKey);
    } catch (err) {
      setError('Failed to start game');
    }
  };

  const nextQuestion = async () => {
    if (!room || activeQuestionIndex >= questions.length - 1) return;

    const newIndex = activeQuestionIndex + 1;
    setActiveQuestionIndex(newIndex);

    await supabase
      .from('rooms')
      .update({
        active_question_index: newIndex,
        active_question_id: questions[newIndex].id,
      })
      .eq('id', room.id);
  };

  const revealAnswer = async () => {
    // Show answer to players
    // In production, update room state to trigger reveal
  };

  const toggleTimer = () => {
    setTimerRunning(!timerRunning);
  };

  const resetTimer = (seconds: number) => {
    setTimerSeconds(seconds);
    setTimerRunning(false);
  };

  const adjustScore = async (teamId: string, delta: number) => {
    if (!room) return;

    const team = teams.find(t => t.id === teamId);
    if (!team) return;

    await supabase
      .from('teams')
      .update({ score: team.score + delta })
      .eq('id', teamId);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const endGame = async () => {
    if (!room) return;

    if (!confirm('End the current game?')) return;

    await supabase
      .from('rooms')
      .update({ status: 'ended' })
      .eq('id', room.id);

    setRoom({ ...room, status: 'ended' });
  };

  const exportResults = async () => {
    if (!room) return;

    // Fetch all data and export as CSV
    const csvContent = 'Team,Score,Streak\n' + 
      teams.map(t => `${t.name},${t.score},${t.streak}`).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kingdom-quest-${room.code}-${Date.now()}.csv`;
    a.click();
  };

  const sortedTeams = [...teams].sort((a, b) => b.score - a.score);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-tbn-gold text-2xl">Loading...</div>
      </div>
    );
  }

  if (!room && !showCreateRoom && !showPasscodeModal) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <button onClick={() => setShowPasscodeModal(true)} className="btn-primary">
          Start New Session
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-tbn-black text-tbn-cream">
      <NavBar current="host" />
      {/* Header */}
      <header className="sticky top-0 z-50 bg-tbn-navy/90 backdrop-blur-sm border-b border-tbn-gold/20">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl md:text-2xl font-display font-bold text-gradient">
              BE THE LIGHT
            </h1>
            {room && (
              <div className="flex items-center gap-2 text-tbn-gold">
                <span className="text-lg font-bold">{room.code}</span>
                <span className="text-tbn-cream/60 text-sm">Room Code</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <button
              onClick={() => setIsOnline(!isOnline)}
              className={cn(
                'p-2 rounded-lg transition-colors',
                isOnline ? 'text-tbn-mint' : 'text-tbn-orange'
              )}
              title={isOnline ? 'Online' : 'Offline Mode'}
            >
              {isOnline ? <Wifi className="w-5 h-5" /> : <WifiOff className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setAudioEnabled(!audioEnabled)}
              className="p-2 rounded-lg text-tbn-cream/70 hover:text-tbn-cream transition-colors"
              title={audioEnabled ? 'Mute Audio' : 'Enable Audio'}
            >
              {audioEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>

            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-lg text-tbn-cream/70 hover:text-tbn-cream transition-colors"
              title="Fullscreen"
            >
              <Monitor className="w-5 h-5" />
            </button>

            {room && (
              <>
                <button
                  onClick={() => setShowLeaderboard(!showLeaderboard)}
                  className={cn(
                    'p-2 rounded-lg transition-colors',
                    showLeaderboard ? 'bg-tbn-gold/20 text-tbn-gold' : 'text-tbn-cream/70'
                  )}
                  title="Leaderboard"
                >
                  <Trophy className="w-5 h-5" />
                </button>

                <button
                  onClick={exportResults}
                  className="p-2 rounded-lg text-tbn-cream/70 hover:text-tbn-cream transition-colors"
                  title="Export Results"
                >
                  <Download className="w-5 h-5" />
                </button>

                <button
                  onClick={endGame}
                  className="p-2 rounded-lg text-tbn-orange hover:text-tbn-orange/80 transition-colors"
                  title="End Game"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        {!room ? (
          // No room yet - show create room
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Start a New Game Session
            </h2>
            <p className="text-tbn-cream/60 mb-8">
              Create a room and share the code or QR code with players
            </p>
            <button onClick={() => setShowPasscodeModal(true)} className="btn-primary">
              <Plus className="inline-block w-5 h-5 mr-2" />
              Create New Room
            </button>
          </div>
        ) : room.status === 'lobby' ? (
          // Lobby state
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left: Room info and QR */}
            <div className="card-glow">
              <h2 className="text-2xl font-display font-bold mb-4">Join the Game</h2>
              
              <div className="text-center mb-6">
                <p className="text-tbn-cream/60 mb-2">Room Code</p>
                <p className="text-6xl font-display font-bold text-tbn-gold tracking-wider">
                  {room.code}
                </p>
              </div>

              {showQR && (
                <div className="bg-tbn-cream p-6 rounded-xl mb-6 flex justify-center">
                  <QRCodeSVG
                    value={`${window.location.origin}/play?room=${room.code}`}
                    size={256}
                    level="H"
                    includeMargin={true}
                  />
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={() => setShowQR(!showQR)}
                  className="btn-secondary flex-1"
                >
                  {showQR ? <EyeOff className="inline-block w-4 h-4 mr-2" /> : <Eye className="inline-block w-4 h-4 mr-2" />}
                  {showQR ? 'Hide' : 'Show'} QR Code
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(room.code);
                  }}
                  className="btn-secondary flex-1"
                >
                  Copy Code
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-tbn-gold/20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">Teams ({teams.length})</h3>
                  <button
                    onClick={() => setShowTeamModal(true)}
                    className="text-tbn-gold hover:text-tbn-gold/80 text-sm font-medium"
                  >
                    + Add Team
                  </button>
                </div>

                <div className="space-y-2">
                  {teams.length === 0 ? (
                    <p className="text-tbn-cream/40 text-sm">No teams yet. Players will create teams when they join.</p>
                  ) : (
                    teams.map(team => (
                      <div key={team.id} className="flex items-center justify-between p-3 bg-tbn-black/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={cn('w-3 h-3 rounded-full', `bg-${team.color}`)} />
                          <span className="font-medium">{team.name}</span>
                        </div>
                        <span className="text-tbn-cream/60 text-sm">
                          {players.filter(p => p.team_id === team.id).length} players
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Right: Game selection */}
            <div className="card-glow">
              <h2 className="text-2xl font-display font-bold mb-4">Choose a Game</h2>
              
              <div className="space-y-4">
                {GAMES.map(game => {
                  const Icon = game.icon;
                  return (
                    <button
                      key={game.key}
                      onClick={() => startGame(game.key)}
                      className={cn(
                        'w-full p-6 rounded-xl border-2 transition-all duration-300 text-left',
                        `border-${game.color}/30 hover:border-${game.color} hover:bg-${game.color}/10`
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <Icon className={cn('w-12 h-12', `text-${game.color}`)} />
                        <div>
                          <h3 className={cn('text-xl font-display font-bold', `text-${game.color}`)}>
                            {game.name}
                          </h3>
                          <p className="text-tbn-cream/60">{game.description}</p>
                        </div>
                        <ChevronRight className={cn('w-6 h-6 ml-auto', `text-${game.color}`)} />
                      </div>
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => {
                  localStorage.removeItem('host_session_token');
                  router.push('/');
                }}
                className="mt-6 text-tbn-cream/60 hover:text-tbn-cream text-sm"
              >
                Cancel Session
              </button>
            </div>
          </div>
        ) : (
          // Active game state
          <div className="space-y-8">
            {/* Game controls */}
            <div className="card-glow">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-display font-bold">
                  {GAMES.find(g => g.key === activeGame)?.name || 'Active Game'}
                </h2>
                <div className="flex items-center gap-4">
                  <button
                    onClick={toggleTimer}
                    className={cn(
                      'px-6 py-3 rounded-lg font-bold transition-colors',
                      timerRunning 
                        ? 'bg-tbn-orange text-white' 
                        : 'bg-tbn-gold text-tbn-black'
                    )}
                  >
                    {timerRunning ? <Pause className="inline-block w-5 h-5 mr-2" /> : <Play className="inline-block w-5 h-5 mr-2" />}
                    {timerRunning ? 'Pause' : 'Start'} Timer
                  </button>
                  <button
                    onClick={() => resetTimer(15)}
                    className="px-6 py-3 bg-tbn-navy rounded-lg font-bold hover:bg-tbn-navy/80 transition-colors"
                  >
                    <RotateCcw className="inline-block w-5 h-5" />
                  </button>
                  <div className="text-4xl font-display font-bold text-tbn-gold">
                    {timerSeconds || '--'}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={nextQuestion}
                  disabled={activeQuestionIndex >= questions.length - 1}
                  className="btn-primary disabled:btn-disabled"
                >
                  Next Question
                  <ChevronRight className="inline-block w-5 h-5 ml-2" />
                </button>
                <button
                  onClick={revealAnswer}
                  className="btn-secondary"
                >
                  Reveal Answer
                </button>
                <button
                  onClick={() => setShowLeaderboard(!showLeaderboard)}
                  className="btn-secondary"
                >
                  <Trophy className="inline-block w-5 h-5 mr-2" />
                  Leaderboard
                </button>
                <button
                  onClick={() => setShowMissionModal(true)}
                  className="btn-secondary"
                >
                  Assign Mission
                </button>
              </div>
            </div>

            {/* Current question */}
            {questions.length > 0 && activeQuestionIndex < questions.length && (
              <div className="card-glow">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-tbn-gold font-medium">
                    Question {activeQuestionIndex + 1} of {questions.length}
                  </span>
                  <span className="text-tbn-cream/60 text-sm">
                    {questions[activeQuestionIndex].time_limit_seconds}s • {questions[activeQuestionIndex].difficulty}
                  </span>
                </div>
                <p className="text-xl md:text-2xl font-medium mb-6">
                  {questions[activeQuestionIndex].question_text}
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  {(questions[activeQuestionIndex].options as string[]).map((option, i) => (
                    <div
                      key={i}
                      className="p-4 bg-tbn-black/50 rounded-lg border border-tbn-gold/20"
                    >
                      <span className="text-tbn-gold font-bold mr-2">{String.fromCharCode(65 + i)}.</span>
                      {option}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Leaderboard */}
            {showLeaderboard && (
              <div className="card-glow">
                <h3 className="text-xl font-display font-bold mb-4 flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-tbn-gold" />
                  Leaderboard
                </h3>
                <div className="space-y-3">
                  {sortedTeams.map((team, i) => (
                    <div
                      key={team.id}
                      className="flex items-center justify-between p-4 bg-tbn-black/50 rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-2xl font-bold text-tbn-gold">#{i + 1}</span>
                        <div className={cn('w-4 h-4 rounded-full', `bg-${team.color}`)} />
                        <span className="font-medium">{team.name}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-2xl font-display font-bold">{team.score}</span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => adjustScore(team.id, 10)}
                            className="p-2 bg-tbn-gold/20 rounded hover:bg-tbn-gold/30"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => adjustScore(team.id, -10)}
                            className="p-2 bg-tbn-orange/20 rounded hover:bg-tbn-orange/30"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Passcode Modal */}
      {showPasscodeModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="card-glow max-w-md w-full">
            <h2 className="text-2xl font-display font-bold mb-4">Host Access</h2>
            <p className="text-tbn-cream/60 mb-6">
              Enter your host passcode to create or access a game session.
            </p>
            <input
              type="password"
              value={passcodeInput}
              onChange={(e) => setPasscodeInput(e.target.value)}
              placeholder="Enter passcode"
              className="w-full p-4 bg-tbn-black border border-tbn-gold/20 rounded-lg text-tbn-cream text-lg mb-4 focus:outline-none focus:border-tbn-gold"
              autoFocus
            />
            <div className="flex gap-4">
              <button
                onClick={verifyPasscode}
                className="btn-primary flex-1"
              >
                Continue
              </button>
              <button
                onClick={() => setShowPasscodeModal(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Room Modal */}
      {showCreateRoom && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="card-glow max-w-md w-full">
            <h2 className="text-2xl font-display font-bold mb-4">Create New Room</h2>
            <p className="text-tbn-cream/60 mb-6">
              This will create a new game session. Players can join using the room code or QR code.
            </p>
            <div className="flex gap-4">
              <button
                onClick={createRoom}
                className="btn-primary flex-1"
              >
                Create Room
              </button>
              <button
                onClick={() => setShowCreateRoom(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Team Modal */}
      {showTeamModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="card-glow max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-display font-bold">Add Team</h2>
              <button onClick={() => setShowTeamModal(false)} className="text-tbn-cream/60 hover:text-tbn-cream">
                <X className="w-6 h-6" />
              </button>
            </div>
            {/* Team creation form would go here */}
            <p className="text-tbn-cream/60">Teams are created automatically when players join.</p>
          </div>
        </div>
      )}

      {/* Mission Modal */}
      {showMissionModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="card-glow max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-display font-bold">Assign Mission</h2>
              <button onClick={() => setShowMissionModal(false)} className="text-tbn-cream/60 hover:text-tbn-cream">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              {MISSION_TEMPLATES.map(mission => (
                <button
                  key={mission.key}
                  onClick={() => {
                    setSelectedMission(mission);
                    // Assign mission to teams
                  }}
                  className="w-full p-4 bg-tbn-black/50 rounded-lg border border-tbn-gold/20 hover:border-tbn-gold transition-colors text-left"
                >
                  <h3 className="text-lg font-bold text-tbn-gold mb-2">{mission.title}</h3>
                  <p className="text-tbn-cream/60">{mission.description}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
