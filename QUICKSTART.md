# 🚀 QUICK START GUIDE

## For First-Time Setup (15 minutes)

### Step 1: Create Supabase Project (5 min)
1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Choose organization (or create one)
4. Set project name: `kingdom-quest`
5. Set database password (save it!)
6. Choose region (closest to your location)
7. Click "Create new project"
8. Wait 2-3 minutes for setup

### Step 2: Get API Keys (2 min)
1. In Supabase dashboard, go to **Settings** (gear icon)
2. Click **API**
3. Copy these values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Step 3: Configure Environment (2 min)
```bash
cd be-the-light-kingdom-quest
cp .env.local.example .env.local
```

Edit `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
HOST_PASSCODE=pastor123
```

### Step 4: Run Database Migrations (3 min)
1. In Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy entire contents of `supabase/migrations/001_initial_schema.sql`
4. Paste into SQL Editor
5. Click **Run** (or Ctrl+Enter / Cmd+Enter)
6. Wait for "Success" message
7. Create another new query
8. Copy contents of `supabase/migrations/002_seed_questions.sql`
9. Paste and Run
10. Verify: You should see 22 rows inserted

### Step 5: Install & Run (3 min)
```bash
npm install
npm run dev
```

Open browser: [http://localhost:3000](http://localhost:3000)

**Done!** You're ready to test.

---

## 🎮 Quick Test (5 minutes)

### Test the Full Flow

1. **Open Host Dashboard**
   ```
   http://localhost:3000/host
   ```
   - Enter passcode: `pastor123` (or whatever you set)
   - Click "Create New Room"
   - Note the room code (e.g., `ABC123`)

2. **Open Display Screen** (new tab)
   ```
   http://localhost:3000/display/ABC123
   ```
   - Should show QR code and room code
   - "Ready to Shine" message

3. **Join as Player** (on your phone or new tab)
   ```
   http://localhost:3000/play?room=ABC123
   ```
   - Enter nickname: `TestPlayer`
   - Click "Join Game"
   - Should see lobby

4. **Start a Game** (back on host dashboard)
   - Click "Start Light Rush"
   - Display should update
   - Player should see question

5. **Submit an Answer** (on player screen)
   - Tap any answer option
   - Should show "Answer Submitted!"
   - Wait for reveal

6. **Reveal Answer** (host dashboard)
   - Click "Reveal Answer"
   - Display shows correct answer + Bible reference

**Everything working?** You're ready for production!

---

## 🌐 Deploy to Vercel (10 minutes)

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/kingdom-quest.git
git push -u origin main
```

### Step 2: Deploy on Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repo
4. Configure:
   - Framework Preset: Next.js
   - Root Directory: `./`
5. Add Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `HOST_PASSCODE`
6. Click "Deploy"
7. Wait 1-2 minutes

### Step 3: Test Production
- Vercel gives you: `https://kingdom-quest.vercel.app`
- Test: `/host`, `/play`, `/display/[CODE]`

### Optional: Custom Domain
1. In Vercel dashboard → Settings → Domains
2. Add: `games.theboostnation.com`
3. Update DNS records as instructed
4. Wait for propagation (can take up to 48 hours)

---

## 📱 Event Day Checklist

### 2 Hours Before
- [ ] Laptop charged + power cable
- [ ] Projector tested
- [ ] HDMI adapter ready
- [ ] WiFi tested (or backup hotspot)
- [ ] Open host dashboard
- [ ] Create room
- [ ] Display QR code on projector

### 30 Minutes Before
- [ ] Teenagers start arriving
- [ ] Help them scan QR code
- [ ] Monitor player count
- [ ] Troubleshoot connection issues

### Event Start
- [ ] Welcome everyone
- [ ] Ensure 80%+ joined
- [ ] Lock joins
- [ ] Start Light Rush
- [ ] Have fun!

---

## 🆘 Common Issues & Fixes

### "Room not found"
- Check room code is exactly 6 characters
- Make sure it's uppercase
- Verify room not ended

### "Cannot connect to Supabase"
- Check `.env.local` has correct values
- Verify Supabase project is active
- Check internet connection

### "Host passcode rejected"
- Default is `pastor123` (change in `.env.local`)
- Passcode must be 4+ characters
- Case-sensitive

### QR code not scanning
- Increase brightness on projector
- Make QR code larger on screen
- Provide room code as alternative

### Player can't submit answer
- Already submitted (one answer per question)
- Timer expired
- Refresh player's browser

---

## 📞 Need Help?

**Documentation:**
- `README.md` - Full setup guide
- `OPERATIONS_GUIDE.md` - Event day operations
- `TESTING_CHECKLIST.md` - Complete testing protocol

**Supabase Docs:** https://supabase.com/docs  
**Next.js Docs:** https://nextjs.org/docs

---

**"Your light is needed. Think. Discern. Create. Impact."**
