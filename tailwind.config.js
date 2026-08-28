/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary dark backgrounds
        'tbn-black': '#0a0a0a',
        'tbn-navy': '#162442',
        'tbn-charcoal': '#1a1210',
        'tbn-dark': '#1a1a2e',
        
        // Light/gold accents
        'tbn-gold': '#FBB931',
        'tbn-amber': '#F88F22',
        'tbn-orange': '#EA6113',
        'tbn-cream': '#F2F2E7',
        'tbn-mint': '#99E5C0',
        'tbn-sand': '#FFE3B3',
        
        // Utility
        'tbn-white': '#ffffff',
        'tbn-gray': '#6b7280',
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'light-gradient': 'linear-gradient(135deg, #FBB931 0%, #F88F22 50%, #EA6113 100%)',
        'dark-gradient': 'linear-gradient(180deg, #0a0a0a 0%, #162442 100%)',
        'glow-conic': 'conic-gradient(from 180deg at 50% 50%, #FBB931 0deg, #F88F22 180deg, #EA6113 360deg)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
        'shine': 'shine 1.5s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(251, 185, 49, 0.3), 0 0 10px rgba(251, 185, 49, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(251, 185, 49, 0.6), 0 0 30px rgba(251, 185, 49, 0.4)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shine: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
      },
      boxShadow: {
        'glow-sm': '0 0 10px rgba(251, 185, 49, 0.3)',
        'glow': '0 0 20px rgba(251, 185, 49, 0.5)',
        'glow-lg': '0 0 30px rgba(251, 185, 49, 0.6), 0 0 60px rgba(251, 185, 49, 0.3)',
        'glow-xl': '0 0 40px rgba(251, 185, 49, 0.7), 0 0 80px rgba(251, 185, 49, 0.4)',
      },
    },
  },
  plugins: [],
}
