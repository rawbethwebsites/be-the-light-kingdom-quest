'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, Users, Shield, Trophy, Play, Pause, RotateCcw, Flame, 
  ChevronRight, Eye, EyeOff, Lock, Unlock, Download,
  Settings, LogOut, Monitor, Volume2, VolumeX, Wifi, WifiOff,
  QrCode, Plus, Minus, X, Check, AlertCircle
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { supabase, type Database } from '@/lib/supabase';
import { cn, validateNickname, TEAM_COLORS, TEAM_ICONS, calculateLightRushScore, calculateTruthDetectorScore, calculateLightsOutScore } from '@/lib/utils';
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
  { key: 'lights_out', name: 'Lights Out', icon: Flame, description: 'Rescue the City', color: 'tbn-orange' },
];

const QUESTION_SECONDS = 30;
const REVEAL_SECONDS = 5;
const LIGHT_RUSH_QUESTIONS_PER_GAME = 15;
const LIGHTS_OUT_QUESTIONS_PER_GAME = 12;

function shuffled<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function getTimerEndsAt(seconds = QUESTION_SECONDS) {
  return new Date(Date.now() + seconds * 1000).toISOString();
}

function getRemainingSeconds(endsAt?: string | null) {
  if (!endsAt) return 0;
  return Math.max(0, Math.ceil((new Date(endsAt).getTime() - Date.now()) / 1000));
}

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
  const [currentQuestion, setCurrentQuestion] = useState<GameQuestion | null>(null);
  const [answerRevealed, setAnswerRevealed] = useState(false);
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

  // Shared room timer: the room timer_ends_at value is the source of truth.
  useEffect(() => {
    if (!room?.timer_ends_at || room.status !== 'active' || answerRevealed) return;

    const tick = () => {
      const remaining = getRemainingSeconds(room.timer_ends_at);
      setTimerSeconds(remaining);

      if (remaining <= 0) {
        setTimerRunning(false);
        revealAnswer();
      }
    };

    tick();
    const interval = setInterval(tick, 250);
    return () => clearInterval(interval);
  }, [room?.timer_ends_at, room?.status, answerRevealed, currentQuestion?.id]);

  // After an automatic reveal, give the room a short reveal window, then advance.
  useEffect(() => {
    if (!room || room.status !== 'active' || !answerRevealed) return;

    const timeout = setTimeout(() => {
      if (activeQuestionIndex >= questions.length - 1) {
        endGame(false);
      } else {
        nextQuestion();
      }
    }, REVEAL_SECONDS * 1000);

    return () => clearTimeout(timeout);
  }, [answerRevealed, room?.status, activeQuestionIndex, questions.length]);

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
      setActiveGame(data.active_game_key);
      setActiveQuestionIndex(data.active_question_index || 0);
      setTimerSeconds(getRemainingSeconds(data.timer_ends_at));
      loadTeams(data.id);
      await loadQuestions(data.active_game_key);
      if (data.active_question_id) {
        const { data: qData } = await supabase
          .from('game_questions')
          .select('*')
          .eq('id', data.active_question_id)
          .single();
        if (qData) setCurrentQuestion(qData as GameQuestion);
      }
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
      // Load questions for this game
      const { data: qData } = await supabase
        .from('game_questions')
        .select('*')
        .eq('game_key', gameKey)
        .eq('is_active', true)
        .order('sequence');

      if (!qData || qData.length === 0) {
        setError('No questions found for this game');
        return;
      }

      const orderedQuestions = gameKey === 'light_rush'
        ? shuffled(qData as GameQuestion[]).slice(0, Math.min(LIGHT_RUSH_QUESTIONS_PER_GAME, qData.length))
        : gameKey === 'lights_out'
          ? shuffled(qData as GameQuestion[]).slice(0, Math.min(LIGHTS_OUT_QUESTIONS_PER_GAME, qData.length))
          : (qData as GameQuestion[]);
      const firstQuestion = orderedQuestions[0];
      const timerEndsAt = getTimerEndsAt(QUESTION_SECONDS);

      const { error: updateError } = await supabase
        .from('rooms')
        .update({
          status: 'active',
          active_game_key: gameKey,
          active_question_index: 0,
          active_question_id: firstQuestion.id,
          timer_started_at: new Date().toISOString(),
          timer_ends_at: timerEndsAt,
          joins_locked: true,
        })
        .eq('id', room.id);

      if (updateError) throw updateError;

      setRoom({
        ...room,
        status: 'active',
        active_game_key: gameKey,
        active_question_index: 0,
        active_question_id: firstQuestion.id,
        timer_started_at: new Date().toISOString(),
        timer_ends_at: timerEndsAt,
        joins_locked: true,
      });

      setQuestions(orderedQuestions);
      setActiveGame(gameKey);
      setActiveQuestionIndex(0);
      setCurrentQuestion(firstQuestion);
      setTimerSeconds(QUESTION_SECONDS);
      setTimerRunning(true);
      setAnswerRevealed(false);
    } catch (err) {
      setError('Failed to start game');
    }
  };

  const nextQuestion = async () => {
    if (!room || activeQuestionIndex >= questions.length - 1) return;

    const newIndex = activeQuestionIndex + 1;
    const nextQ = questions[newIndex];

    const timerEndsAt = getTimerEndsAt(QUESTION_SECONDS);
    const { error: updateError } = await supabase
      .from('rooms')
      .update({
        active_question_index: newIndex,
        active_question_id: nextQ.id,
        timer_started_at: new Date().toISOString(),
        timer_ends_at: timerEndsAt,
      })
      .eq('id', room.id);

    if (updateError) {
      setError(updateError.message || 'Failed to advance question');
      return;
    }

    setRoom({
      ...room,
      active_question_index: newIndex,
      active_question_id: nextQ.id,
      timer_started_at: new Date().toISOString(),
      timer_ends_at: timerEndsAt,
    });
    setActiveQuestionIndex(newIndex);
    setCurrentQuestion(nextQ);
    setTimerSeconds(QUESTION_SECONDS);
    setTimerRunning(true);
    setAnswerRevealed(false);
  };

  const revealAnswer = async () => {
    if (!room || !currentQuestion) return;

    try {
      setAnswerRevealed(true);
      setTimerRunning(false);

      // Score all unscored answers for this question before broadcasting reveal.
      const { data: answerRows, error: answersError } = await supabase
        .from('answers')
        .select('*')
        .eq('room_id', room.id)
        .eq('question_id', currentQuestion.id)
        .eq('points_awarded', 0);

      if (answersError) throw answersError;

      for (const answer of answerRows || []) {
        const team = teams.find(t => t.id === answer.team_id);
        if (!team) continue;

        const isCorrect = answer.selected_option === currentQuestion.correct_option;
        const responseMs = Math.max(0, answer.response_time_ms || currentQuestion.time_limit_seconds * 1000);
        const scoreResult = activeGame === 'truth_detector'
          ? calculateTruthDetectorScore(isCorrect, false, team.streak || 0)
          : activeGame === 'lights_out'
            ? calculateLightsOutScore(isCorrect, responseMs, currentQuestion.time_limit_seconds, team.streak || 0)
            : calculateLightRushScore(
                isCorrect,
                responseMs,
                currentQuestion.time_limit_seconds,
                team.streak || 0
              );

        const newScore = (team.score || 0) + scoreResult.points;

        await supabase
          .from('answers')
          .update({ points_awarded: scoreResult.points })
          .eq('id', answer.id);

        await supabase
          .from('teams')
          .update({ score: newScore, streak: scoreResult.newStreak })
          .eq('id', team.id);
      }

      await loadTeams(room.id);

      // Broadcast reveal only after scoring is calculated.
      await supabase
        .from('game_events')
        .insert([{
          room_id: room.id,
          event_type: 'answer_revealed',
          payload: {
            question_id: currentQuestion.id,
            correct_option: currentQuestion.correct_option,
            explanation: currentQuestion.explanation,
            bible_reference: currentQuestion.bible_reference,
          },
        }]);
    } catch (err: any) {
      console.error('Reveal answer error:', err);
      setError(err.message || 'Failed to reveal answer');
    }
  };

  const toggleTimer = async () => {
    if (!room || room.status !== 'active') {
      setTimerRunning(!timerRunning);
      return;
    }

    if (timerRunning) {
      // Pause locally for the host. The authoritative timer resumes when host resets/starts it again.
      setTimerRunning(false);
      return;
    }

    const seconds = timerSeconds > 0 ? timerSeconds : currentQuestion?.time_limit_seconds || QUESTION_SECONDS;
    const startedAt = new Date().toISOString();
    const endsAt = getTimerEndsAt(seconds);
    const { error: updateError } = await supabase
      .from('rooms')
      .update({ timer_started_at: startedAt, timer_ends_at: endsAt })
      .eq('id', room.id);

    if (updateError) {
      setError('Failed to sync timer');
      return;
    }

    setRoom({ ...room, timer_started_at: startedAt, timer_ends_at: endsAt });
    setTimerSeconds(seconds);
    setTimerRunning(true);
    setAnswerRevealed(false);
  };

  const resetTimer = async (seconds: number) => {
    if (!room || room.status !== 'active') {
      setTimerSeconds(seconds);
      setTimerRunning(false);
      return;
    }

    const startedAt = new Date().toISOString();
    const endsAt = getTimerEndsAt(seconds);
    const { error: updateError } = await supabase
      .from('rooms')
      .update({ timer_started_at: startedAt, timer_ends_at: endsAt })
      .eq('id', room.id);

    if (updateError) {
      setError('Failed to reset timer for players');
      return;
    }

    setRoom({ ...room, timer_started_at: startedAt, timer_ends_at: endsAt });
    setTimerSeconds(seconds);
    setTimerRunning(true);
    setAnswerRevealed(false);
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

  const endGame = async (requireConfirmation = true) => {
    if (!room) return;

    if (requireConfirmation && !confirm('End the current game? Players will see the Game Over screen.')) return;

    try {
      setTimerRunning(false);

      // If the host ends during/just after the final question before the reveal
      // cycle completes, score the current submitted answers first. Otherwise
      // players can reach Game Over with a stale 0 even though they answered
      // correctly.
      if (currentQuestion && !answerRevealed && room.status === 'active') {
        await revealAnswer();
        await loadTeams(room.id);
      }

      setAnswerRevealed(false);

      const endedRoom = {
        ...room,
        status: 'ended' as const,
        active_game_key: null,
        active_question_index: 0,
        active_question_id: null,
        timer_started_at: null,
        timer_ends_at: null,
      };

      const { error } = await supabase
        .from('rooms')
        .update({
          status: 'ended',
          active_game_key: null,
          active_question_index: 0,
          active_question_id: null,
          timer_started_at: null,
          timer_ends_at: null,
        })
        .eq('id', room.id);

      if (error) throw error;

      setRoom(endedRoom);
      setActiveGame(null);
      setQuestions([]);
      setCurrentQuestion(null);
      setActiveQuestionIndex(0);
      setTimerSeconds(0);
    } catch (err: any) {
      console.error('End game error:', err);
      setError(err.message || 'Failed to end game');
    }
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
                  onClick={() => endGame()}
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
        ) : room.status === 'ended' ? (
          // Ended state
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="card-glow py-12">
              <Trophy className="w-20 h-20 text-tbn-gold mx-auto mb-6" />
              <h2 className="text-4xl md:text-6xl font-display font-bold text-gradient mb-4">
                Game Ended
              </h2>
              <p className="text-xl text-tbn-cream/70 mb-8">
                The room is closed. Players will see the Game Over screen.
              </p>

              {sortedTeams.length > 0 && (
                <div className="max-w-2xl mx-auto mb-8 text-left">
                  <h3 className="text-2xl font-display font-bold text-tbn-gold mb-4 text-center">
                    Final Leaderboard
                  </h3>
                  <div className="space-y-3">
                    {sortedTeams.map((team, i) => (
                      <div key={team.id} className="flex items-center justify-between p-4 bg-tbn-black/50 rounded-lg border border-tbn-gold/20">
                        <div className="flex items-center gap-4">
                          <span className="text-2xl font-bold text-tbn-gold">#{i + 1}</span>
                          <div className={cn('w-4 h-4 rounded-full', `bg-${team.color}`)} />
                          <span className="font-medium">{team.name}</span>
                        </div>
                        <span className="text-2xl font-display font-bold">{team.score}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-center gap-4">
                <button onClick={exportResults} className="btn-secondary">
                  <Download className="inline-block w-5 h-5 mr-2" />
                  Export Results
                </button>
                <button
                  onClick={() => {
                    setRoom(null);
                    setTeams([]);
                    setPlayers([]);
                    setShowPasscodeModal(true);
                  }}
                  className="btn-primary"
                >
                  <Plus className="inline-block w-5 h-5 mr-2" />
                  Create New Room
                </button>
              </div>
            </div>
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
                  <h3 className="text-lg font-bold">Players ({teams.length})</h3>
                  <button
                    onClick={() => setShowTeamModal(true)}
                    className="text-tbn-gold hover:text-tbn-gold/80 text-sm font-medium"
                  >
                    + Add Team
                  </button>
                </div>

                <div className="space-y-2">
                  {teams.length === 0 ? (
                    <p className="text-tbn-cream/40 text-sm">No players yet. Players will appear here when they join.</p>
                  ) : (
                    teams.map(team => (
                      <div key={team.id} className="flex items-center justify-between p-3 bg-tbn-black/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={cn('w-3 h-3 rounded-full', `bg-${team.color}`)} />
                          <span className="font-medium">{team.name}</span>
                        </div>
                        <span className="text-tbn-cream/60 text-sm">
                          {players.filter(p => p.team_id === team.id).length ? 'joined' : 'joining'}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Right: Game selection */}
            <div className="card-glow">
              <h2 className="text-2xl font-display font-bold mb-2">Choose a Game</h2>
              <p className="text-tbn-cream/55 mb-4">Run the games in order: knowledge, discernment, then real-life wisdom.</p>
              
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
                    aria-label="Reset countdown to 15 seconds"
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
                  onClick={revealAnswer}
                  className="btn-secondary border-tbn-orange text-tbn-orange hover:bg-tbn-orange/10"
                >
                  End Question Now
                </button>
              </div>
            </div>

            {/* Current question */}
            {questions.length > 0 && activeQuestionIndex < questions.length && (
              <div className="card-glow">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-tbn-gold font-medium">
                    {activeGame === 'lights_out' ? 'City Rescue' : 'Question'} {activeQuestionIndex + 1} of {questions.length}
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

      {/* Legacy Mission Modal (kept hidden; Lights Out replaced Kingdom Builders) */}
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
