'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Zap, Users, Shield } from 'lucide-react';
import { NavBar } from '@/components/NavBar';

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      <NavBar current="home" />
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 w-full">
      {/* Particle background */}
      <div className="particle-bg">
        {Array.from({ length: 30 }).map((_, i) => (
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

      {/* Light rays effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-b from-tbn-gold/10 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-5xl mx-auto text-center"
      >
        {/* Theme verse */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mb-6"
        >
          <p className="text-tbn-gold/80 text-lg md:text-xl font-medium italic">
            "You are the light of the world. A city set on a hill cannot be hidden."
          </p>
          <p className="text-tbn-amber/70 text-base md:text-lg mt-2">
            — Matthew 5:14
          </p>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-5xl md:text-7xl lg:text-8xl font-display font-bold mb-4"
        >
          <span className="text-gradient">BE THE LIGHT</span>
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-3xl md:text-5xl lg:text-6xl font-display font-bold text-tbn-cream mb-8"
        >
          KINGDOM QUEST
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-tbn-cream/70 text-lg md:text-xl max-w-3xl mx-auto mb-12"
        >
          A real-time multiplayer Bible game experience for church youth events.
          Learn, discern, create, and lead responsibly with faith and technology.
        </motion.p>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
        >
          <Link href="/host" className="btn-primary w-full sm:w-auto">
            <Zap className="inline-block w-5 h-5 mr-2" />
            Host a Game
          </Link>
          <Link href="/play" className="btn-secondary w-full sm:w-auto">
            <Users className="inline-block w-5 h-5 mr-2" />
            Join a Game
          </Link>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto"
        >
          <div className="card-dark text-left">
            <Zap className="w-10 h-10 text-tbn-gold mb-4" />
            <h3 className="text-xl font-display font-bold text-tbn-cream mb-2">
              Light Rush
            </h3>
            <p className="text-tbn-cream/60 text-sm md:text-base">
              Fast-paced Bible quiz with speed bonuses and light streaks. Test your knowledge!
            </p>
          </div>

          <div className="card-dark text-left">
            <Shield className="w-10 h-10 text-tbn-amber mb-4" />
            <h3 className="text-xl font-display font-bold text-tbn-cream mb-2">
              Truth Detector
            </h3>
            <p className="text-tbn-cream/60 text-sm md:text-base">
              Discern between Bible truth, facts, and AI-generated content. Think critically!
            </p>
          </div>

          <div className="card-dark text-left">
            <Users className="w-10 h-10 text-tbn-orange mb-4" />
            <h3 className="text-xl font-display font-bold text-tbn-cream mb-2">
              Kingdom Builders
            </h3>
            <p className="text-tbn-cream/60 text-sm md:text-base">
              Solve real problems using faith, creativity, and responsible AI. Make an impact!
            </p>
          </div>
        </motion.div>

        {/* Core messages */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mt-16 text-tbn-cream/50 text-sm md:text-base max-w-2xl mx-auto"
        >
          <p className="mb-4">
            <strong className="text-tbn-gold/80">Think. Discern. Create. Impact.</strong>
          </p>
          <p className="mb-2">
            Technology is powerful; character must lead. Use AI to learn, not to copy.
          </p>
          <p>
            Your gifts can solve real problems. A city on a hill cannot be hidden.
          </p>
        </motion.div>
      </motion.div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        className="absolute bottom-6 left-0 right-0 text-center text-tbn-cream/40 text-xs md:text-sm"
      >
        BE THE LIGHT: Kingdom Quest — Built for church youth events
      </motion.footer>
      </div>
    </main>
  );
}
