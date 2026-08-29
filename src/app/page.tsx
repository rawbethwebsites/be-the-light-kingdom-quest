'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  CalendarDays, MapPin, Clock, Users, Gamepad2, Sparkles,
  Zap, Shield, Flame, ArrowRight, Lightbulb, Palette, Mic
} from 'lucide-react';
import { NavBar } from '@/components/NavBar';

const EVENT = {
  title: 'BE THE LIGHT',
  subtitle: 'Kingdom Quest',
  verse: 'You are the light of the world. A city set on a hill cannot be hidden.',
  verseRef: 'Matthew 5:14',
  org: 'FCT9 Junior Church',
  date: 'Saturday, 29th August 2026',
  time: '9:00 AM',
  venue: 'RCCG Glory Assembly',
  address: 'Gaduwa Estate, Prompt Gudu, Abuja',
  audience: 'Teenagers (Ages 13–19)',
  speaker: 'Rob / The Boost Nation',
  tagline: 'Think. Discern. Create. Impact.',
  themes: ['Music', 'Life-Changing Talks', 'Vocational Skills'],
  description:
    'An interactive session on productive AI use for teenagers. We will play a live multiplayer Bible game, learn how to use AI responsibly, and design personal digital portfolios.',
};

const TALK_HIGHLIGHTS = [
  { icon: Lightbulb, title: 'Learn', text: 'Bible knowledge through fast-paced quiz games on your phone.' },
  { icon: Shield, title: 'Discern', text: 'Tell apart Bible truth, facts, AI-generated content, and false claims.' },
  { icon: Palette, title: 'Create', text: 'Design a personal digital portfolio you can take home today.' },
  { icon: Sparkles, title: 'Impact', text: 'Use your gifts, faith, and technology to serve your community.' },
];

const GAMES = [
  { icon: Zap, name: 'Light Rush', desc: 'Fast-paced Bible quiz with speed bonuses and light streaks.', color: 'text-tbn-gold' },
  { icon: Shield, name: 'Truth Detector', desc: 'Discern between Bible truth, facts, and AI-generated content.', color: 'text-tbn-amber' },
  { icon: Flame, name: 'Lights Out', desc: 'Rescue the city by choosing wise moves in real-life scenarios.', color: 'text-tbn-orange' },
];

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <NavBar current="home" />

      {/* Particle background */}
      <div className="particle-bg">
        {Array.from({ length: 24 }).map((_, i) => (
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

      {/* Light rays */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-tbn-gold/8 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 h-[400px] w-[400px] rounded-full bg-tbn-orange/6 blur-3xl" />
        <div className="absolute right-1/4 top-1/3 h-[300px] w-[300px] rounded-full bg-tbn-amber/5 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-16">
        {/* Org banner */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-6 text-center"
        >
          <span className="inline-block rounded-full border border-tbn-gold/20 bg-tbn-charcoal/60 px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-tbn-gold/70 md:text-sm">
            {EVENT.org} · Annual Teenagers Conference
          </span>
        </motion.div>

        {/* Hero */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <p className="mb-3 text-base font-medium italic text-tbn-gold/80 md:text-lg">
            "{EVENT.verse}"
          </p>
          <p className="mb-6 text-sm text-tbn-amber/70 md:text-base">— {EVENT.verseRef}</p>

          <h1 className="mb-2 font-display text-5xl font-bold tracking-tight md:text-7xl lg:text-8xl">
            <span className="text-gradient">{EVENT.title}</span>
          </h1>
          <h2 className="mb-6 font-display text-2xl font-bold text-tbn-cream md:text-4xl lg:text-5xl">
            {EVENT.subtitle}
          </h2>

          <p className="mx-auto mb-8 max-w-2xl text-base text-tbn-cream/70 md:text-lg">
            {EVENT.description}
          </p>

          {/* Event meta grid */}
          <div className="mx-auto mb-10 grid max-w-3xl grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {[
              { icon: CalendarDays, label: 'Date', value: EVENT.date },
              { icon: Clock, label: 'Time', value: EVENT.time },
              { icon: MapPin, label: 'Venue', value: EVENT.venue },
              { icon: Users, label: 'For', value: EVENT.audience },
            ].map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="card-dark flex flex-col items-center gap-1.5 p-3 text-center md:p-4"
              >
                <Icon className="h-5 w-5 text-tbn-gold md:h-6 md:w-6" />
                <p className="text-[10px] font-semibold uppercase tracking-wider text-tbn-gold/60 md:text-xs">
                  {label}
                </p>
                <p className="text-xs font-medium text-tbn-cream/80 md:text-sm">{value}</p>
              </div>
            ))}
          </div>

          {/* Address line */}
          <p className="mb-8 text-sm text-tbn-cream/40">
            <MapPin className="mr-1 inline h-4 w-4 text-tbn-gold/50" />
            {EVENT.address}
          </p>

          {/* CTAs */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/game" className="btn-primary w-full sm:w-auto">
              <Gamepad2 className="mr-2 inline-block h-5 w-5" />
              Play the Game
            </Link>
            <Link href="/itinerary" className="btn-secondary w-full sm:w-auto">
              <CalendarDays className="mr-2 inline-block h-5 w-5" />
              View Talk Plan
            </Link>
          </div>
        </motion.section>

        {/* Highlights */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="mt-16 md:mt-24"
        >
          <h3 className="mb-8 text-center font-display text-2xl font-bold text-tbn-cream md:text-3xl">
            What We&apos;ll Do
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 md:gap-6">
            {TALK_HIGHLIGHTS.map(({ icon: Icon, title, text }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                className="card-dark group"
              >
                <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-tbn-gold/10 transition-transform group-hover:scale-110">
                  <Icon className="h-6 w-6 text-tbn-gold" />
                </div>
                <h4 className="mb-1 font-display text-lg font-bold text-tbn-cream">{title}</h4>
                <p className="text-sm text-tbn-cream/60">{text}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Game preview */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.7 }}
          className="mt-16 md:mt-24"
        >
          <div className="mb-8 flex items-center justify-between">
            <h3 className="font-display text-2xl font-bold text-tbn-cream md:text-3xl">
              Three Games. One Mission.
            </h3>
            <Link
              href="/game"
              className="flex items-center gap-1 text-sm font-semibold text-tbn-gold hover:text-tbn-amber"
            >
              Start <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-3 md:gap-6">
            {GAMES.map(({ icon: Icon, name, desc, color }, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + i * 0.1, duration: 0.5 }}
                className="card-dark group cursor-pointer"
              >
                <Icon className={`mb-4 h-10 w-10 ${color}`} />
                <h4 className="mb-2 font-display text-xl font-bold text-tbn-cream">{name}</h4>
                <p className="text-sm text-tbn-cream/60">{desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Event themes from flyer */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-16 md:mt-20"
        >
          <div className="mx-auto flex max-w-2xl flex-wrap justify-center gap-3">
            {EVENT.themes.map((theme) => (
              <span
                key={theme}
                className="rounded-full border border-tbn-gold/20 bg-tbn-gold/8 px-5 py-2 text-sm font-medium text-tbn-gold/80"
              >
                {theme}
              </span>
            ))}
          </div>
        </motion.section>

        {/* Speaker / footer */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="mt-12 text-center md:mt-16"
        >
          <div className="mx-auto max-w-xl rounded-2xl border border-tbn-gold/15 bg-gradient-to-b from-tbn-navy/40 to-transparent p-6">
            <p className="mb-2 flex items-center justify-center gap-1 text-sm font-semibold uppercase tracking-wider text-tbn-gold/60">
              <Mic className="h-4 w-4" /> Speaker
            </p>
            <p className="font-display text-xl font-bold text-tbn-cream">{EVENT.speaker}</p>
            <p className="mt-3 text-sm text-tbn-cream/50">{EVENT.tagline}</p>
          </div>
        </motion.section>
      </div>
    </main>
  );
}