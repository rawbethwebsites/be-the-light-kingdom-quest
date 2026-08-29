'use client';

import Link from 'next/link';
import { Home, Gamepad2, Monitor } from 'lucide-react';

export function NavBar({ current }: { current: 'home' | 'host' | 'play' }) {
  return (
    <nav className="sticky top-0 z-[100] bg-tbn-navy/90 backdrop-blur-sm border-b border-tbn-gold/20">
      <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-lg font-display font-bold text-gradient">BE THE LIGHT</span>
        </Link>
        <div className="flex items-center gap-1 md:gap-2">
          <Link
            href="/"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
              current === 'home' ? 'bg-tbn-gold/20 text-tbn-gold' : 'text-tbn-cream/60 hover:text-tbn-cream hover:bg-white/5'
            }`}
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">Home</span>
          </Link>
          <Link
            href="/host"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
              current === 'host' ? 'bg-tbn-gold/20 text-tbn-gold' : 'text-tbn-cream/60 hover:text-tbn-cream hover:bg-white/5'
            }`}
          >
            <Monitor className="w-4 h-4" />
            <span className="hidden sm:inline">Host</span>
          </Link>
          <Link
            href="/play"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
              current === 'play' ? 'bg-tbn-gold/20 text-tbn-gold' : 'text-tbn-cream/60 hover:text-tbn-cream hover:bg-white/5'
            }`}
          >
            <Gamepad2 className="w-4 h-4" />
            <span className="hidden sm:inline">Play</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}