# BE THE LIGHT: KINGDOM QUEST

A polished, browser-based, real-time multiplayer Bible game platform for church youth events.

## 🎯 Overview

**Theme:** "BE THE LIGHT" - Matthew 5:14  
**Audience:** Teenagers (13-19 years)  
**Format:** Host-controlled game with players joining via QR code or room code  
**No app download required • No accounts • No personal data collection**

## 🎮 Game Modes

### 1. Light Rush
Fast-paced Bible quiz with speed bonuses and light streaks.
- 10 Bible-themed questions
- 10-15 second timers
- Speed bonus up to 50 points
- Light Streak: +100 for 3 consecutive correct answers

### 2. Truth Detector
Discernment game teaching media literacy and responsible AI awareness.
- Classify statements as: Bible Verse, True Fact, AI-Generated, or False
- 8-12 rounds with explanations
- Truth Shield bonus for consecutive correct answers

### 3. Kingdom Builders
Mission-based challenges where teams solve real problems.
- 6 mission templates (Study Smart, Kindness Online, Church Impact, etc.)
- Team submissions with AI prompts and solutions
- Audience voting and host scoring

## 📁 Project Structure

```
be-the-light-kingdom-quest/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with fonts
│   │   ├── page.tsx            # Landing page
│   │   ├── globals.css         # Tailwind + custom styles
│   │   ├── host/
│   │   │   └── page.tsx        # Host dashboard
│   │   ├── play/
│   │   │   └── page.tsx        # Player join/play page
│   │   └── display/
│   │       └── [roomCode]/
│   │           └── page.tsx    # Projector display
│   ├── components/
│   │   ├── ui/                 # Reusable UI components
│   │   ├── games/              # Game-specific components
│   │   └── layout/             # Layout components
│   └── lib/
│       ├── supabase.ts         # Supabase client + types
│       ├── utils.ts            # Utility functions
│       └── missions.ts         # Mission templates
├── supabase/
│   └── migrations/
│       ├── 001_initial_schema.sql
│       └── 002_seed_questions.sql
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

## 🚀 Setup Instructions

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Wait for project to initialize
4. Go to **Settings → API**
5. Copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 2. Configure Environment Variables

Create a `.env.local` file:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
HOST_PASSCODE=your-secure-passcode
```

**Security Notes:**
- Never expose `service_role` key in the browser
- `HOST_PASSCODE` is used for simple host verification (enhance with proper auth in production)
- All sensitive operations should be server-side

### 3. Run Database Migrations

1. Go to **SQL Editor** in Supabase dashboard
2. Copy contents of `supabase/migrations/001_initial_schema.sql`
3. Run the SQL
4. Copy contents of `supabase/migrations/002_seed_questions.sql`
5. Run the SQL

Alternatively, use Supabase CLI:

```bash
npm install -g supabase
supabase link --project-ref your-project-ref
supabase db push
```

### 4. Install Dependencies

```bash
npm install
```

### 5. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 6. Deploy to Vercel

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `HOST_PASSCODE`
5. Deploy

## 🎨 Design System

### Colors
- **Backgrounds:** `tbn-black`, `tbn-navy`, `tbn-charcoal`, `tbn-dark`
- **Accents:** `tbn-gold`, `tbn-amber`, `tbn-orange`, `tbn-cream`, `tbn-mint`
- **Theme:** Dark with warm gold/amber light effects

### Typography
- **Display:** Space Grotesk (bold, geometric)
- **Body:** Inter (clean, readable)

### Visual Effects
- Particle backgrounds
- Light glow effects
- Smooth Framer Motion animations
- Projector-optimized text sizes

## 🔒 Security Features

### Row Level Security (RLS)
- Players can only read their own room state
- Players can only submit one answer per question
- Host-only actions require secure token
- Correct answers hidden until reveal

### Data Protection
- No personal data collected (no email, phone, password)
- Anonymous session tokens stored in localStorage
- Nickname validation with blocked word filter
- Rate limiting on join and answer endpoints

### Best Practices
- All sensitive operations server-side
- No API keys exposed in browser
- Parameterized database queries
- Input validation on all forms

## 📱 Player Experience

### Join Flow
1. Scan QR code or enter room code
2. Enter nickname (validated)
3. Auto-assigned to team
4. Wait in lobby for host to start

### During Game
- Large tap-friendly answer buttons
- Clear timer display
- Submission confirmation
- Answer reveal with Bible reference
- Live score updates

### Connection Handling
- Session persistence on refresh
- Automatic reconnection
- Offline fallback mode
- Graceful error states

## 🖥️ Host Experience

### Dashboard Features
- Create new room
- Show/hide QR code
- View joined teams and players
- Start/pause/resume games
- Timer controls
- Reveal answers
- Manual score adjustment
- Leaderboard display
- Export results (CSV)
- Fullscreen mode
- Audio toggle
- Network status indicator

### Controls
- Next Question
- Reveal Answer
- Add/Remove Points
- Assign Mission (Kingdom Builders)
- End Game
- Lock Late Joining

## 🧪 Testing Checklist

### Pre-Event Testing

**Host Laptop:**
- [ ] Create room successfully
- [ ] Display QR code clearly
- [ ] Room code visible from distance
- [ ] All game modes load correctly
- [ ] Timer functions properly
- [ ] Score adjustments work
- [ ] Fullscreen mode works
- [ ] Export results generates CSV

**Projector Display:**
- [ ] Open `/display/[roomCode]` route
- [ ] Text readable from back of hall
- [ ] QR code scannable
- [ ] Animations smooth
- [ ] Colors contrast well
- [ ] Timer visible
- [ ] Leaderboard clear

**Player Phones (test with 5-10 devices):**
- [ ] Join via QR code
- [ ] Join via room code
- [ ] Nickname validation works
- [ ] Answer buttons responsive
- [ ] Timer syncs with host
- [ ] Submission confirmation shows
- [ ] Answer reveal displays correctly
- [ ] Score updates in real-time

**Network Testing:**
- [ ] Simulate slow connection (3G)
- [ ] Test offline mode
- [ ] Disconnect/reconnect player
- [ ] Verify session persistence on refresh
- [ ] Test with unstable WiFi

**Game Flow Testing:**
- [ ] Light Rush: All 10 questions
- [ ] Truth Detector: Classification logic
- [ ] Kingdom Builders: Mission submission
- [ ] Voting system works
- [ ] Scoring calculates correctly
- [ ] Leaderboard updates

**Security Testing:**
- [ ] Player cannot access host controls
- [ ] Player cannot see answers before reveal
- [ ] Player cannot submit multiple answers
- [ ] Player cannot vote twice
- [ ] Player cannot vote for own team
- [ ] Host passcode required

## 🆘 Troubleshooting

### Room Not Found
- Check room code is correct (6 characters, uppercase)
- Verify room status is not 'ended'
- Ensure Supabase connection is active

### Players Cannot Join
- Check `joins_locked` flag on room
- Verify room status is 'lobby' or 'active'
- Ensure Supabase RLS policies are correct

### Realtime Updates Not Working
- Check Supabase Realtime is enabled for all tables
- Verify channel subscriptions in components
- Ensure database webhook limits not exceeded

### Timer Out of Sync
- Timer should be server-authoritative
- Use `timer_ends_at` for client-side calculation
- Account for network latency

### Scores Not Updating
- Verify answer submission succeeded
- Check score calculation logic
- Ensure team update triggers are firing

## 📝 Content Guidelines

### Bible Questions
- Always include Scripture reference
- Use accurate translations (NIV, ESV, NLT)
- Provide age-appropriate explanations
- Label AI-generated content clearly

### Mission Templates
- Focus on real problems teenagers face
- Emphasize responsible AI use
- Connect to faith and purpose
- Encourage creativity and service

### Copy Tone
- Energetic but respectful
- Faith-centered, not preachy
- Teen-friendly, not childish
- Purpose-driven and hopeful

## 🎯 Key Messages

1. **God calls young people to be light in their generation**
2. **Technology and AI are tools for good when used responsibly**
3. **Verify information, protect privacy, reject harmful behavior**
4. **Use gifts, faith, and creativity to impact community**
5. **A city on a hill cannot be hidden**

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Database:** Supabase (PostgreSQL)
- **Realtime:** Supabase Realtime
- **Deployment:** Vercel
- **QR Codes:** qrcode.react
- **Icons:** Lucide React

## 📄 License

Built for church youth events. Free to use and modify for ministry purposes.

## 🙏 Credits

**Theme:** Matthew 5:14 - "You are the light of the world"  
**Audience:** Church teenagers (13-19)  
**Purpose:** Faith formation, discernment training, responsible technology use

---

**"Your light is needed. Think. Discern. Create. Impact."**
