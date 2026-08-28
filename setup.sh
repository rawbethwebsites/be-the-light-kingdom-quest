#!/bin/bash

# BE THE LIGHT: KINGDOM QUEST
# Setup Script for Live Event

echo "=========================================="
echo "BE THE LIGHT: KINGDOM QUEST - Setup"
echo "=========================================="
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ .env.local not found!"
    echo ""
    echo "Please create .env.local with the following variables:"
    echo "  NEXT_PUBLIC_SUPABASE_URL=your-supabase-url"
    echo "  NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key"
    echo "  HOST_PASSCODE=your-secure-passcode"
    echo ""
    echo "Get these from your Supabase project dashboard."
    exit 1
fi

echo "✅ Environment variables found"

# Check if node_modules exists
if [ ! -d node_modules ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

echo "✅ Dependencies installed"

# Start development server
echo ""
echo "🚀 Starting development server..."
echo ""
echo "Host Dashboard: http://localhost:3000/host"
echo "Player Join:    http://localhost:3000/play"
echo "Display Screen: http://localhost:3000/display/[ROOM_CODE]"
echo ""

npm run dev
