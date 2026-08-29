'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, Users, Shield, Trophy, Sparkles, Crown,
  Flame, Star, Heart, Check, Clock
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { supabase, type Database } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import { MISSION_TEMPLATES } from '@/lib/missions';

type Room = Database['public']['Tables']['rooms']['Row'];
type Team = Database['public']['Tables']['teams']['Row'];
type Player = Database['public']['Tables']['players']['Row'];
type GameQuestion = Database['public']['Tables']['game_questions']['Row'];
type Mission = Database['public']['Tables']['missions']['Row'];

const GAMES = {
  light_rush: { name: 'Light Rush', icon: Zap, color: 'tbn-gold' },
  truth_detector: { name: 'Truth Detector', icon: Shield, color: 'tbn-amber' },
  lights_out: { name: 'Lights Out', icon: Flame, color: 'tbn-orange' },
};

const SAFE_QUESTION_SELECT = 'id,game_key,sequence,question_text,question_type,options,explanation,bible_reference,source_label,time_limit_seconds,difficulty,is_active,created_at';

function getRemainingSeconds(endsAt?: string | null) {
  if (!endsAt) return 0;
  return Math.max(0, Math.ceil((new Date(endsAt).getTime() - Date.now()) / 1000));
}

export default function DisplayPage() {
  const params = useParams();
  const router = useRouter();
  const roomCode = params.roomCode as string;

  const [room, setRoom] = useState<Room | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [questions, setQuestions] = useState<GameQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<GameQuestion | null>(null);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showQR, setShowQR] = useState(true);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [revealedAnswer, setRevealedAnswer] = useState<number | null>(null);
  const [revealPayload, setRevealPayload] = useState<any>(null);

  useEffect(() => {
    loadRoom();
  }, [roomCode]);

  useEffect(() => {
    if (!room?.timer_ends_at || room.status !== 'active') return;
    const tick = () => setTimerSeconds(getRemainingSeconds(room.timer_ends_at));
    tick();
    const interval = setInterval(tick, 250);
    return () => clearInterval(interval);
  }, [room?.timer_ends_at, room?.status]);

  const loadRoom = async () => {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('code', roomCode.toUpperCase())
      .single() as { data: Room | null; error: any };
    
    if (error || !data) {
      setIsLoading(false);
      return;
    }
    
    setRoom(data);
    loadTeams(data.id);
    await loadQuestions(data.active_game_key);
    if (data.active_question_id) {
      await loadCurrentQuestion(data.active_question_id);
    }
    setTimerSeconds(getRemainingSeconds(data.timer_ends_at));
    setIsLoading(false);
  };

  const loadTeams = async (roomId: string) => {
    const { data } = await supabase
      .from('teams')
      .select('*, players(id)')
      .eq('room_id', roomId)
      .order('score', { ascending: false }) as { data: (Team & { players: Player[] })[] | null };
    
    if (data) {
      setTeams(data);
      // Count players
      const allPlayers = data.flatMap(t => t.players || []);
      setPlayers(allPlayers);
    }
  };

  const loadQuestions = async (gameKey: string | null) => {
    if (!gameKey) return;

    const { data } = await supabase
      .from('game_questions')
      .select(SAFE_QUESTION_SELECT)
      .eq('game_key', gameKey)
      .eq('is_active', true)
      .order('sequence');
    
    if (data) setQuestions(data as GameQuestion[]);
  };

  const loadCurrentQuestion = async (questionId: string) => {
    const { data } = await supabase
      .from('game_questions')
      .select(SAFE_QUESTION_SELECT)
      .eq('id', questionId)
      .single();

    if (data) {
      setCurrentQuestion(data as GameQuestion);
    }
  };

  // Subscribe to realtime updates
  useEffect(() => {
    if (!room) return;

    const roomChannel = supabase
      .channel(`display:room:${room.id}`)
      .on('postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'rooms', filter: `id=eq.${room.id}` },
        async (payload) => {
          const updated = payload.new as Room;
          setRoom(updated);
          
          if (updated.active_game_key) {
            loadQuestions(updated.active_game_key);
          }

          if (updated.active_question_id) {
            await loadCurrentQuestion(updated.active_question_id);
            setShowLeaderboard(false);
            setRevealedAnswer(null);
            setRevealPayload(null);
          }
          
          // Update timer
          if (updated.timer_ends_at) {
            const ends = new Date(updated.timer_ends_at).getTime();
            const now = Date.now();
            setTimerSeconds(Math.max(0, Math.floor((ends - now) / 1000)));
          }
        }
      )
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'game_events', filter: `room_id=eq.${room.id}` },
        (payload) => {
          const event = payload.new as any;
          if (event.event_type === 'answer_revealed' && event.payload) {
            if (event.payload.question_id && room.active_question_id && event.payload.question_id !== room.active_question_id) return;
            setRevealedAnswer(event.payload.correct_option);
            setRevealPayload(event.payload);
            setShowLeaderboard(true);
          }
        }
      )
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'teams', filter: `room_id=eq.${room.id}` },
        () => {
          loadTeams(room.id);
        }
      )
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'missions', filter: `room_id=eq.${room.id}` },
        () => {
          loadMissions(room.id);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(roomChannel);
    };
  }, [room]);

  const loadMissions = async (roomId: string) => {
    const { data } = await supabase
      .from('missions')
      .select('*')
      .eq('room_id', roomId);
    
    if (data) setMissions(data);
  };

  const sortedTeams = [...teams].sort((a, b) => b.score - a.score);
  const currentGame = room?.active_game_key ? GAMES[room.active_game_key as keyof typeof GAMES] : null;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-tbn-black">
        <div className="text-tbn-gold text-3xl animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-tbn-black">
        <div className="text-center">
          <h1 className="text-4xl font-display font-bold text-tbn-orange mb-4">Room Not Found</h1>
          <p className="text-tbn-cream/60">The room code {roomCode} is invalid or has ended.</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-tbn-black text-tbn-cream overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-tbn-gold/10 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-8 py-6 h-screen flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-display font-bold text-gradient">BE THE LIGHT</h1>
            <p className="text-tbn-cream/60 text-sm">Kingdom Quest</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-tbn-cream/60 text-xs">Room Code</p>
              <p className="text-3xl font-display font-bold text-tbn-gold tracking-wider">{room.code}</p>
            </div>
            {room.status === 'lobby' && showQR && (
              <QRCodeSVG
                value={`${typeof window !== 'undefined' ? window.location.origin.replace('/display', '') : ''}/play?room=${room.code}`}
                size={80}
                level="H"
              />
            )}
          </div>
        </header>

        {/* Main display area */}
        <div className="flex-1 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {room.status === 'lobby' ? (
              <motion.div
                key="lobby"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-center max-w-4xl"
              >
                <Sparkles className="w-24 h-24 text-tbn-gold mx-auto mb-8 animate-pulse" />
                
                <h2 className="text-5xl md:text-7xl font-display font-bold mb-4">
                  Ready to Shine?
                </h2>
                <p className="text-2xl text-tbn-cream/70 mb-12">
                  Join using the room code or scan the QR code
                </p>

                {showQR && (
                  <div className="bg-tbn-cream p-8 rounded-2xl inline-block mb-8">
                    <QRCodeSVG
                      value={`${typeof window !== 'undefined' ? window.location.origin.replace('/display', '') : ''}/play?room=${room.code}`}
                      size={300}
                      level="H"
                      includeMargin={false}
                    />
                  </div>
                )}

                <div className="text-8xl font-display font-bold text-tbn-gold tracking-widest mb-8">
                  {room.code}
                </div>

                {teams.length > 0 && (
                  <div className="card-glow p-8">
                    <h3 className="text-2xl font-bold mb-6 flex items-center justify-center gap-3">
                      <Users className="w-8 h-8" />
                      Players Joined ({teams.length})
                    </h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      {teams.map((team, i) => (
                        <div
                          key={team.id}
                          className="p-4 bg-tbn-black/50 rounded-lg flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <div className={cn('w-4 h-4 rounded-full', `bg-${team.color}`)} />
                            <span className="text-lg">{team.name}</span>
                          </div>
                          <span className="text-tbn-gold font-bold">
                            {players.filter(p => p.team_id === team.id).length}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <p className="text-tbn-cream/50 mt-8">
                  Your light is needed. Think. Discern. Create. Impact.
                </p>
              </motion.div>
            ) : room.status === 'ended' ? (
              <motion.div
                key="ended"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center"
              >
                <Trophy className="w-32 h-32 text-tbn-gold mx-auto mb-8" />
                <h2 className="text-6xl font-display font-bold mb-4">Game Complete!</h2>
                <p className="text-2xl text-tbn-cream/70 mb-12">
                  A city on a hill cannot be hidden
                </p>
                
                {/* Final leaderboard */}
                <div className="max-w-3xl mx-auto card-glow p-8">
                  <h3 className="text-3xl font-bold mb-6">Final Standings</h3>
                  {sortedTeams.slice(0, 3).map((team, i) => (
                    <motion.div
                      key={team.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.2 }}
                      className={cn(
                        'flex items-center justify-between p-6 mb-4 rounded-xl',
                        i === 0 ? 'bg-tbn-gold/20 border-2 border-tbn-gold' :
                        i === 1 ? 'bg-tbn-amber/20 border-2 border-tbn-amber' :
                        i === 2 ? 'bg-tbn-orange/20 border-2 border-tbn-orange' :
                        'bg-tbn-black/50'
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <span className={cn(
                          'text-4xl font-bold',
                          i === 0 ? 'text-tbn-gold' :
                          i === 1 ? 'text-tbn-amber' :
                          i === 2 ? 'text-tbn-orange' :
                          'text-tbn-cream/60'
                        )}>
                          {i === 0 ? <Crown className="w-10 h-10" /> : `#${i + 1}`}
                        </span>
                        <div>
                          <p className="text-2xl font-bold">{team.name}</p>
                          <p className="text-tbn-cream/60">{team.streak} streak</p>
                        </div>
                      </div>
                      <span className="text-5xl font-display font-bold">{team.score}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : currentGame ? (
              <motion.div
                key="game"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full max-w-6xl"
              >
                {/* Game header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    {currentGame.icon && (
                      <currentGame.icon className={cn('w-12 h-12', `text-${currentGame.color}`)} />
                    )}
                    <div>
                      <h2 className={cn('text-3xl font-display font-bold', `text-${currentGame.color}`)}>
                        {currentGame.name}
                      </h2>
                      <p className="text-tbn-cream/60">
                        Question {room.active_question_index + 1} of {questions.length}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <Clock className="w-8 h-8 text-tbn-gold" />
                    <span className={cn(
                      'text-6xl font-display font-bold',
                      timerSeconds <= 5 ? 'text-tbn-orange' : 'text-tbn-gold'
                    )}>
                      {timerSeconds}
                    </span>
                  </div>
                </div>

                {/* Current question */}
                {currentQuestion && (
                  <div className="card-glow p-8 mb-8 relative overflow-hidden">
                    {room.active_game_key === 'lights_out' && (
                      <div className="mb-6 grid grid-cols-6 gap-2" aria-label="City light progress">
                        {Array.from({ length: 12 }).map((_, i) => (
                          <div
                            key={i}
                            className={cn(
                              'h-8 rounded-t-lg border border-tbn-gold/20 transition-all duration-500',
                              i < Math.max(1, room.active_question_index + (revealedAnswer !== null ? 1 : 0))
                                ? 'bg-light-gradient shadow-glow'
                                : 'bg-tbn-navy/50'
                            )}
                          />
                        ))}
                      </div>
                    )}
                    <p className="text-2xl md:text-3xl font-medium mb-8 leading-relaxed">
                      {currentQuestion.question_text}
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      {(currentQuestion.options as string[]).map((option, i) => (
                        <div
                          key={i}
                          className={cn(
                            'p-6 bg-tbn-black/50 rounded-xl border-2 transition-all duration-300',
                            revealedAnswer === i ? 'border-tbn-mint bg-tbn-mint/15 shadow-glow' : 'border-tbn-gold/20',
                            revealedAnswer !== null && revealedAnswer !== i ? 'opacity-55' : ''
                          )}
                        >
                          <span className={cn(
                            'text-2xl font-bold mr-4',
                            revealedAnswer === i ? 'text-tbn-mint' : `text-${currentGame.color}`
                          )}>
                            {String.fromCharCode(65 + i)}.
                          </span>
                          <span className="text-xl">{option}</span>
                        </div>
                      ))}
                    </div>

                    {revealedAnswer !== null && (
                      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-8 rounded-2xl border border-tbn-gold/30 bg-tbn-black/60 p-6">
                        <p className="text-tbn-gold font-display text-2xl font-bold mb-2">
                          {room.active_game_key === 'lights_out' ? 'Best Light Move' : 'Answer Revealed'}
                        </p>
                        {revealPayload?.bible_reference && <p className="text-tbn-amber font-bold mb-2">{revealPayload.bible_reference}</p>}
                        {revealPayload?.explanation && <p className="text-xl text-tbn-cream/80 leading-relaxed">{revealPayload.explanation}</p>}
                      </motion.div>
                    )}
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="waiting"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center"
              >
                <div className="text-tbn-gold/60 text-2xl">Waiting for host...</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer info bar */}
        <footer className="mt-6 pt-6 border-t border-tbn-gold/20 flex items-center justify-between text-sm text-tbn-cream/60">
          <div className="flex items-center gap-6">
            <span>{teams.length} players</span>
            <span>{players.length} players</span>
            <span className={cn(
              'px-3 py-1 rounded-full text-xs font-bold',
              room.status === 'lobby' ? 'bg-tbn-mint/20 text-tbn-mint' :
              room.status === 'active' ? 'bg-tbn-gold/20 text-tbn-gold' :
              'bg-tbn-orange/20 text-tbn-orange'
            )}>
              {room.status.toUpperCase()}
            </span>
          </div>
          <div>
            BE THE LIGHT: Kingdom Quest
          </div>
        </footer>
      </div>
    </main>
  );
}
