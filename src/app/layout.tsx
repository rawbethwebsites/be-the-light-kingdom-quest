import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'BE THE LIGHT: Kingdom Quest',
  description: 'A real-time multiplayer Bible game for church youth events',
  keywords: ['Bible game', 'youth ministry', 'church games', 'Christian teenagers'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="font-body bg-tbn-black text-tbn-cream antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
