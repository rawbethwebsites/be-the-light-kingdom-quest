'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  CalendarDays, Clock, MapPin, Users, Gamepad2, Palette,
  Lightbulb, Shield, Sparkles, ArrowRight, CheckCircle2, Mic, Music
} from 'lucide-react';
import { NavBar } from '@/components/NavBar';

const EVENT = {
  org: 'FCT9 Junior Church',
  date: 'Saturday, 29th August 2026',
  time: '9:00 AM',
  venue: 'RCCG Glory Assembly',
  address: 'Gaduwa Estate, Prompt Gudu, Abuja',
  speaker: 'Rob / The Boost Nation',
};

const SEGMENTS = [
  {
    time: '9:00 – 9:10',
    duration: '10 min',
    title: 'Welcome & Opening',
    icon: Sparkles,
    color: 'text-tbn-gold',
    items: [
      'Greet the teenagers, introduce the theme: "Be The Light"',
      'Read Matthew 5:14 — "You are the light of the world. A city set on a hill cannot be hidden."',
      'Quick icebreaker: "What does it mean to be light in your generation?"',
      'Introduce the session plan: talk + game + portfolio design',
    ],
  },
  {
    time: '9:10 – 9:25',
    duration: '15 min',
    title: 'Talk Part 1 — Faith & Technology',
    icon: Lightbulb,
    color: 'text-tbn-gold',
    items: [
      'God calls young people to be light in their generation',
      'Technology and AI are tools — they can be used for good or bad',
      'Teenagers should use AI to learn, create, solve problems, and develop their gifts',
      'AI must not replace wisdom, character, truth, prayer, or personal effort',
      'Key verse: 1 Timothy 4:12 — "Don\'t let anyone look down on you because you are young"',
    ],
  },
  {
    time: '9:25 – 9:50',
    duration: '25 min',
    title: 'Game Session 1 — Light Rush',
    icon: Gamepad2,
    color: 'text-tbn-gold',
    items: [
      'Facilitator opens host dashboard on laptop connected to projector',
      'Create a room, show QR code on the big screen',
      'Players join from their phones — no app download, no account needed',
      '10 Bible quiz questions, 30 seconds each — speed bonuses and light streaks',
      'Live leaderboard after every 2–3 questions',
      'Wrap with: "You know the Word — now let\'s test what you hear"',
    ],
  },
  {
    time: '9:50 – 10:05',
    duration: '15 min',
    title: 'Talk Part 2 — Discernment & Truth',
    icon: Shield,
    color: 'text-tbn-amber',
    items: [
      'Not everything that sounds wise, religious, or convincing is true',
      'Test what you hear, check Scripture, verify information',
      'AI can generate content that sounds spiritual but isn\'t from the Bible',
      'Always label AI-generated content clearly — don\'t pass it off as Scripture',
      'Key teaching: "Truth is worth checking. Use AI to learn, not to copy."',
    ],
  },
  {
    time: '10:05 – 10:25',
    duration: '20 min',
    title: 'Game Session 2 — Truth Detector',
    icon: Shield,
    color: 'text-tbn-amber',
    items: [
      '8 rounds: statements appear on projector, players categorise from phones',
      'Four categories: Bible Verse / True Bible Fact / AI-Generated / False Claim',
      'Includes real Bible facts, altered claims, and AI-generated inspiration',
      'Bonus: identify the Bible reference for extra points',
      'Truth Shield bonus for two correct consecutive answers',
      'Display the key teaching phrase on screen after the final round',
    ],
  },
  {
    time: '10:25 – 10:35',
    duration: '10 min',
    title: 'Talk Part 3 — Create & Impact',
    icon: Palette,
    color: 'text-tbn-orange',
    items: [
      'Your gifts, faith, creativity, and technology can solve real problems',
      'AI is a tool to help you — not a replacement for your own thinking',
      'Responsible use: verify info, protect privacy, avoid cheating, reject harmful content',
      'Introduction to digital portfolios: "Show your light online"',
      'Explain the workshop: everyone will design a personal portfolio today',
    ],
  },
  {
    time: '10:35 – 11:15',
    duration: '40 min',
    title: 'Portfolio Design Workshop',
    icon: Palette,
    color: 'text-tbn-orange',
    items: [
      'Each teenager gets a portfolio template (digital or paper)',
      'Step 1: Write your name, your gifts, and what you want to be known for',
      'Step 2: Add 1–3 things you\'ve made or done (art, writing, music, code, service)',
      'Step 3: Write a short "About Me" — use AI as a helper, not a replacement',
      'Step 4: Add a Bible verse that represents you and your goals',
      'Step 5: Review and polish — verify everything AI helped you write',
      'Facilitator walks around to help individuals, highlights a few on the projector',
    ],
  },
  {
    time: '11:15 – 11:30',
    duration: '15 min',
    title: 'Game Session 3 — Lights Out (Optional)',
    icon: Gamepad2,
    color: 'text-tbn-orange',
    items: [
      'If time permits: 12 scenario-based questions on AI, school, friendship, privacy, and faith',
      'Players choose wise moves to "rescue the city" from their phones',
      'Reinforces the talk themes: character must lead, technology is powerful',
      'Shorter version: play 5–6 questions if running behind schedule',
    ],
  },
  {
    time: '11:30 – 11:50',
    duration: '20 min',
    title: 'Showcase, Awards & Closing',
    icon: Mic,
    color: 'text-tbn-gold',
    items: [
      'Show the final game leaderboard on the projector',
      'Kingdom Builder Award for the best portfolio/mission submission',
      'Highlight 2–3 standout portfolios on the big screen',
      'Recap: "Think. Discern. Create. Impact."',
      'Closing prayer: "Lord, make us light in our generation"',
      'Group photo with the leaderboard screen',
    ],
  },
];

const TIPS = [
  'Arrive 30 minutes early to set up the projector and test the Wi-Fi at RCCG Glory Assembly',
  'Have a backup of game questions on the host laptop in case internet drops — the game has an offline fallback mode',
  'Test the QR code from the back of the hall — make sure it\'s scannable on a projector',
  'Assign 2–3 team leaders from the youth to help younger teens join the game on their phones',
  'Keep the room code visible on screen throughout the game sessions',
  'If a phone disconnects, the player can rejoin automatically — no refresh needed',
  'Bring printed portfolio templates as backup in case not all teenagers have phones',
  'Label all AI-assisted content clearly during the workshop — practice what we teach',
];

export default function ItineraryPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <NavBar current="itinerary" />

      {/* Particle background */}
      <div className="particle-bg">
        {Array.from({ length: 16 }).map((_, i) => (
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
        <div className="absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-tbn-gold/6 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-4 py-10 md:px-6 md:py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-tbn-gold/30 bg-tbn-gold/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-tbn-gold md:text-sm">
            <CalendarDays className="h-4 w-4" />
            Session Itinerary · {EVENT.org}
          </div>
          <h1 className="mb-3 font-display text-4xl font-bold tracking-tight md:text-6xl">
            <span className="text-gradient">Talk Plan</span>
          </h1>
          <p className="mx-auto max-w-xl text-sm text-tbn-cream/60 md:text-base">
            A 2-hour interactive session for teenagers: live Bible games, short talks on faith and AI,
            and a hands-on portfolio design workshop.
          </p>

          {/* Event meta */}
          <div className="mx-auto mt-6 flex flex-wrap justify-center gap-3">
            {[
              { icon: CalendarDays, text: EVENT.date },
              { icon: Clock, text: `${EVENT.time} start` },
              { icon: MapPin, text: EVENT.venue },
              { icon: Users, text: 'Ages 13–19' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 rounded-full border border-tbn-gold/15 bg-white/[0.03] px-4 py-2 text-xs text-tbn-cream/70 md:text-sm">
                <Icon className="h-4 w-4 text-tbn-gold/60" />
                {text}
              </div>
            ))}
          </div>
          <p className="mt-2 text-xs text-tbn-cream/40">
            <MapPin className="mr-1 inline h-3 w-3 text-tbn-gold/40" />
            {EVENT.address}
          </p>
          <p className="mt-1 text-xs text-tbn-cream/40">
            <Mic className="mr-1 inline h-3 w-3 text-tbn-gold/40" />
            Speaker: {EVENT.speaker}
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-tbn-gold/40 via-tbn-gold/15 to-transparent md:left-8" />

          <div className="space-y-6 md:space-y-8">
            {SEGMENTS.map((seg, i) => (
              <motion.div
                key={seg.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.05, duration: 0.4 }}
                className="relative pl-16 md:pl-20"
              >
                {/* Node */}
                <div className={`absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-full border-2 border-tbn-gold/30 bg-tbn-charcoal md:h-16 md:w-16`}>
                  <seg.icon className={`h-5 w-5 ${seg.color} md:h-7 md:w-7`} />
                </div>

                {/* Card */}
                <div className="card-dark">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-tbn-gold/15 px-3 py-1 text-xs font-semibold text-tbn-gold">
                      {seg.time}
                    </span>
                    <span className="rounded-full border border-tbn-gold/20 px-3 py-1 text-xs text-tbn-cream/50">
                      {seg.duration}
                    </span>
                  </div>
                  <h3 className="mb-3 font-display text-lg font-bold text-tbn-cream md:text-xl">
                    {seg.title}
                  </h3>
                  <ul className="space-y-2">
                    {seg.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-tbn-cream/65 md:text-base">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-tbn-gold/50" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Facilitator tips */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-12 md:mt-16"
        >
          <h3 className="mb-5 font-display text-xl font-bold text-tbn-cream md:text-2xl">
            Facilitator Checklist
          </h3>
          <div className="card-dark">
            <ul className="space-y-3">
              {TIPS.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-tbn-cream/65 md:text-base">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-tbn-gold/15 text-xs font-bold text-tbn-gold">
                    {i + 1}
                  </span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </motion.section>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link href="/game" className="btn-primary w-full sm:w-auto">
            <Gamepad2 className="mr-2 inline-block h-5 w-5" />
            Go to Game
          </Link>
          <Link href="/" className="btn-secondary w-full sm:w-auto">
            Back to Event
          </Link>
        </motion.div>
      </div>
    </main>
  );
}