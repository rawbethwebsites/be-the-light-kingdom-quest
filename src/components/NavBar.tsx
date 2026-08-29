'use client';

import Link from 'next/link';
import { CalendarDays, Gamepad2, Home, Monitor, Sparkles, Users } from 'lucide-react';

type NavKey = 'home' | 'game' | 'itinerary' | 'host' | 'play';

const links: Array<{ href: string; label: string; key: NavKey; icon: React.ComponentType<{ className?: string }> }> = [
  { href: '/', label: 'Event', key: 'home', icon: Home },
  { href: '/itinerary', label: 'Talk Plan', key: 'itinerary', icon: CalendarDays },
  { href: '/game', label: 'Game', key: 'game', icon: Gamepad2 },
  { href: '/host', label: 'Host', key: 'host', icon: Monitor },
  { href: '/play', label: 'Join', key: 'play', icon: Users },
];

export function NavBar({ current }: { current: NavKey }) {
  return (
    <nav className="sticky top-0 z-[100] border-b border-tbn-gold/15 bg-[#070707]/85 backdrop-blur-xl supports-[backdrop-filter]:bg-[#070707]/65">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 md:px-6">
        <Link href="/" className="group flex min-w-0 items-center gap-2">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-tbn-gold/30 bg-tbn-gold/10 shadow-glow-sm">
            <Sparkles className="h-4 w-4 text-tbn-gold" />
          </span>
          <span className="truncate font-display text-sm font-bold uppercase tracking-[0.18em] text-tbn-cream md:text-base">
            Be The Light
          </span>
        </Link>

        <div className="flex items-center gap-1 overflow-x-auto rounded-full border border-white/10 bg-white/[0.04] p-1">
          {links.map(({ href, label, key, icon: Icon }) => {
            const active = current === key;
            return (
              <Link
                key={key}
                href={href}
                className={`flex min-h-10 items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold transition-all md:px-4 md:text-sm ${
                  active
                    ? 'bg-light-gradient text-tbn-black shadow-glow-sm'
                    : 'text-tbn-cream/65 hover:bg-white/8 hover:text-tbn-cream'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className={key === 'host' || key === 'play' ? 'hidden sm:inline' : ''}>{label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
