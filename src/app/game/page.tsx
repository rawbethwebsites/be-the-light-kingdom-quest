'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Zap, Shield, Flame, Users, Monitor, ArrowRight, Gamepad2 } from 'lucide-react';
import { NavBar } from '@/components/NavBar';

const GAMES = [
  {
    icon: Zap,
    name: 'Light Rush',
    key: 'light_rush',
    desc: 'A fast, high-energy Bible quiz. Answer through your phone, earn speed bonuses, and build light streaks.',
    color: 'text-tbn-gold',
    border: 'border-tbn-gold/30',
    glow: 'shadow-glow',
    duration: '10 questions · 30s each',
    players: '2–6 teams',
  },
  {
    icon: Shield,
    name: 'Truth Detector',
    key: 'truth_detector',
    desc: 'Discern between Bible truth, true facts, AI-generated inspiration, and false claims. Test what you hear.',
    color: 'text-tbn-amber',
    border: 'border-tbn-amber/30',
    glow: 'shadow-glow-sm',
    duration: '8 rounds · 30s each',
    players: '2–6 teams',
  },
  {
    icon: Flame,
    name: 'Lights Out',
    key: 'lights_out',
    desc: 'Rescue the city by choosing wise moves in AI, school, friendship, privacy, and faith scenarios.',
    color: 'text-tbn-orange',
    border: 'border-tbn-orange/30',
    glow: 'shadow-glow-sm',
    duration: '12 scenarios · 30s each',
    players: '2–6 teams',
  },
];

export default function GameMenu() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <NavBar current="game" />

      {/* Particle background */}
      <div className="particle-bg">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 15}s`,
              animationDuration: `${15 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-tbn-gold/8 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-4 py-10 md:px-6 md:py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center md:mb-14"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-tbn-gold/30 bg-tbn-gold/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-tbn-gold md:text-sm">
            <Gamepad2 className="h-4 w-4" />
            Choose Your Game
          </div>
          <h1 className="mb-3 font-display text-4xl font-bold tracking-tight md:text-6xl">
            <span className="text-gradient">KINGDOM QUEST</span>
          </h1>
          <p className="mx-auto max-w-xl text-sm text-tbn-cream/60 md:text-base">
            The facilitator starts the game from the host dashboard. Players join from their phones.
            No app needed — just scan the QR code or enter the room code.
          </p>
        </motion.div>

        {/* Game cards */}
        <div className="grid gap-4 md:gap-6">
          {GAMES.map(({ icon: Icon, name, desc, color, border, glow, duration, players }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
              className={`card-dark group flex flex-col gap-4 border-2 ${border} p-5 transition-all hover:${glow} md:flex-row md:items-center md:p-6`}
            >
              <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/5 ${color}`}>
                <Icon className="h-7 w-7" />
              </div>
              <div className="flex-1">
                <h3 className="font-display text-xl font-bold text-tbn-cream md:text-2xl">{name}</h3>
                <p className="mt-1 text-sm text-tbn-cream/60 md:text-base">{desc}</p>
                <div className="mt-2 flex flex-wrap gap-3 text-xs text-tbn-cream/40">
                  <span className="flex items-center gap-1">
                    <Gamepad2 className="h-3 w-3" /> {duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" /> {players}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Action section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-10 grid gap-4 sm:grid-cols-2 md:gap-6"
        >
          <Link href="/host" className="card-dark group flex items-center gap-4 border-2 border-tbn-gold/20 p-5 transition-all hover:border-tbn-gold/40 hover:shadow-glow">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-tbn-gold/10">
              <Monitor className="h-6 w-6 text-tbn-gold" />
            </div>
            <div className="flex-1">
              <h3 className="font-display text-lg font-bold text-tbn-cream">Host Dashboard</h3>
              <p className="text-sm text-tbn-cream/50">For the facilitator — laptop + projector</p>
            </div>
            <ArrowRight className="h-5 w-5 text-tbn-gold/50 transition-transform group-hover:translate-x-1" />
          </Link>

          <Link href="/play" className="card-dark group flex items-center gap-4 border-2 border-tbn-gold/20 p-5 transition-all hover:border-tbn-gold/40 hover:shadow-glow">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-tbn-gold/10">
              <Users className="h-6 w-6 text-tbn-gold" />
            </div>
            <div className="flex-1">
              <h3 className="font-display text-lg font-bold text-tbn-cream">Join a Game</h3>
              <p className="text-sm text-tbn-cream/50">For players — enter room code or scan QR</p>
            </div>
            <ArrowRight className="h-5 w-5 text-tbn-gold/50 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>

        {/* Core messages */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-tbn-cream/40 md:text-base">
            <span className="font-semibold text-tbn-gold/80">Think. Discern. Create. Impact.</span>
            <br />
            Technology is powerful; character must lead. Use AI to learn, not to copy.
          </p>
        </motion.div>
      </div>
    </main>
  );
}