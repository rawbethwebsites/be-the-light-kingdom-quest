# BE THE LIGHT: KINGDOM QUEST
# Live Event Operations Guide

## 🎯 Pre-Event Checklist (2-3 Days Before)

### Technical Setup
- [ ] Supabase project created and migrations run
- [ ] Environment variables configured in Vercel
- [ ] Production deployment successful
- [ ] Custom domain connected (optional): games.theboostnation.com
- [ ] Test all three game modes end-to-end

### Content Review
- [ ] All Bible questions verified for accuracy
- [ ] Mission templates reviewed for age-appropriateness
- [ ] Explanations clear and teen-friendly
- [ ] No copyrighted material used

### Hardware Prep
- [ ] Host laptop charged + power cable
- [ ] Projector tested with laptop
- [ ] HDMI adapter ready (bring backup)
- [ ] Backup hotspot for internet (in case venue WiFi fails)
- [ ] Extension cords and power strips

## 📋 Event Day Setup (2 Hours Before)

### 1. Venue Setup (60 minutes before)
```
[Projector Screen]
       |
       | HDMI
       v
[Host Laptop] ---- WiFi ---- [Internet]
       |
   [Backup Hotspot]
```

- Position projector screen visible to all teenagers
- Test projector brightness and focus
- Ensure host laptop visible to facilitator
- Test WiFi speed (minimum 5 Mbps recommended)
- Set up backup hotspot if venue WiFi unreliable

### 2. System Check (45 minutes before)

**On Host Laptop:**
```bash
cd be-the-light-kingdom-quest
npm run dev
# Or if deployed: open https://your-deployment.vercel.app/host
```

**Test Flow:**
1. Open host dashboard: `/host`
2. Create test room
3. Open display screen in new tab: `/display/[CODE]`
4. Join as test player on phone: `/play?room=[CODE]`
5. Verify realtime sync working
6. Test one question from each game mode
7. End test game

### 3. QR Code Prep (30 minutes before)

**Option A: Digital Display**
- Show QR code on projector before event starts
- Keep room code visible at all times

**Option B: Printed Cards**
```
┌─────────────────────────┐
│   BE THE LIGHT          │
│   Kingdom Quest         │
│                         │
│   Room Code: ABC123     │
│                         │
│   [QR Code Image]       │
│                         │
│   Scan to join!         │
│   Or visit:             │
│   bit.ly/btl-join       │
└─────────────────────────┘
```

**Short URL Setup:**
- Create Bit.ly or similar: `bit.ly/btl-join`
- Redirect to: `https://your-game.com/play?room=ABC123`
- Update room code dynamically or print blank cards to fill in

### 4. Team Formation Strategy

**Option 1: Pre-Assigned Teams**
- Create teams before event (5-8 teenagers per team)
- Assign team names: Light, Fire, Salt, etc.
- Print team assignment list for facilitator

**Option 2: Self-Forming Teams**
- First player to join creates team
- Others join existing teams
- Facilitator can manually adjust if needed

**Recommended:** 4-6 teams of 5-8 players each

## 🎮 Running the Event

### Opening (5 minutes)

**Facilitator Script:**
> "Welcome to BE THE LIGHT: Kingdom Quest! Over the next hour, you'll compete in teams to test your Bible knowledge, discern truth from falsehood, and solve real problems using faith and technology responsibly.
>
> Remember our theme verse: Matthew 5:14 - 'You are the light of the world. A city set on a hill cannot be hidden.'
>
> Scan the QR code or enter the room code on screen. No app download needed—just use your phone browser!"

**Wait for all players to join:**
- Monitor player count on host dashboard
- Aim for 80%+ of teenagers joined
- Help those struggling with connection

### Game 1: Light Rush (15-20 minutes)

**Purpose:** High-energy opener, Bible knowledge

**Host Actions:**
1. Click "Start Light Rush"
2. Read each question aloud
3. Start timer (15 seconds)
4. Let players submit answers
5. Click "Reveal Answer"
6. Read explanation and Bible reference
7. After every 2-3 questions, show leaderboard

**Facilitator Tips:**
- Keep energy high
- Celebrate correct answers
- Explain "Light Streak" bonus
- Encourage teams to discuss (but answer individually)

**Sample Commentary:**
> "Question 1: Which verse says 'You are the light of the world'? You have 15 seconds... Go!"
> [Timer counts down]
> "Time's up! Let's reveal... The answer is B, Matthew 5:14! That's our theme verse!"
> "Team Fire is on a Light Streak—three correct answers in a row!"

### Game 2: Truth Detector (20-25 minutes)

**Purpose:** Discernment training, media literacy, AI awareness

**Host Actions:**
1. Click "Start Truth Detector"
2. Explain the four categories:
   - **Direct Bible Verse**: Exact Scripture quote
   - **True Bible Fact**: Accurate biblical information
   - **AI-Generated**: Sounds spiritual but not Scripture
   - **False or Altered**: Incorrect or made-up claim
3. Show statement on screen
4. Give 20 seconds for teams to discuss
5. Players submit their classification
6. Reveal correct category
7. Read explanation and Bible reference
8. Emphasize key teaching points

**Key Teaching Moments:**

After Round 4 (AI-generated quote):
> "Not everything that sounds wise, religious, emotional, or convincing is true. Test what you hear, check Scripture, verify information, and hold on to what is good." — 1 Thessalonians 5:21

After Round 12 (AI-generated counsel):
> "AI can give us good advice that aligns with biblical principles, but it's not Scripture. Use AI to learn, not to copy. Use it to understand, not to replace your own thinking."

**Facilitator Tips:**
- Pause after reveals for discussion
- Ask: "Why do you think this was tricky?"
- Connect to real-life scenarios (social media, fake news)
- Emphasize: Technology is a tool; character must lead

### Game 3: Kingdom Builders (25-30 minutes)

**Purpose:** Apply faith to real problems, responsible AI use

**Host Actions:**
1. Click "Start Kingdom Builders"
2. Assign mission (or let teams choose)
3. Explain submission form:
   - Problem to solve (180 chars)
   - AI prompt to use (350 chars)
   - Your solution (500 chars)
   - Responsible-use rule (180 chars)
   - Team slogan (100 chars)
4. Give teams 10-12 minutes to collaborate
5. Collect submissions
6. Display top 2-3 submissions on projector
7. Teams vote (cannot vote for themselves)
8. Host awards bonus points for quality
9. Announce Kingdom Builder Award winner

**Example Mission: Study Smart**

**Problem:** "Teenagers are distracted by phones and struggle to revise consistently."

**AI Prompt:** "Act as a study coach for Nigerian secondary-school students. Create a realistic seven-day revision plan for mathematics and English. Include short study sessions, breaks, past questions, sleep, prayer, and phone limits. Present it as a simple table."

**Solution:** "Students use AI to understand topics and generate practice questions, then verify answers with teachers and textbooks."

**Responsible-Use Rule:** "Use AI to explain and practise; do not submit AI-generated work as your own."

**Slogan:** "Use AI to learn, not to copy."

**Facilitator Tips:**
- Walk around and help teams collaborate
- Remind: "Use AI to learn, not to copy"
- Encourage creativity and faith connection
- Celebrate practical solutions
- Award points for: clarity, usefulness, faith connection, responsible AI use

### Closing (5-10 minutes)

**Final Leaderboard:**
1. Show final standings
2. Announce winning team
3. Optional: Small prizes for top 3 teams

**Closing Challenge:**
> "Today you competed in games, but the real Kingdom Quest starts now. You are the light of your generation. Use your gifts, your faith, your creativity, and yes—even technology—to solve real problems, serve people, and make an impact.
>
> Remember:
> - A city on a hill cannot be hidden
> - Technology is powerful; character must lead
> - Your light is needed
>
> Go shine!"

## 🔧 Troubleshooting During Event

### Internet Issues

**Slow WiFi:**
- Switch to backup hotspot
- Enable offline mode on host dashboard
- Use static questions (pre-loaded)
- Manually track scores on whiteboard

**Complete Outage:**
- Continue with offline fallback
- Host reads questions from printed sheets
- Teams write answers on paper
- Facilitator collects and scores manually
- Resume digital when connection restored

### Player Connection Issues

**"Room Not Found":**
- Verify room code (case-sensitive, 6 characters)
- Check room not locked or ended
- Refresh player's browser

**"Cannot Submit Answer":**
- Player already submitted (one answer per question)
- Question timer expired
- Refresh player's browser

**"Session Lost":**
- Player refreshed browser
- Click "Reconnect" button
- Or re-enter room code

### Host Dashboard Issues

**Timer Not Syncing:**
- Refresh host page
- Restart timer manually
- Announce time remaining verbally

**Scores Not Updating:**
- Check answer submissions in database
- Manually adjust scores using + / - buttons
- Export results at end for verification

**QR Code Not Scanning:**
- Increase QR code size on display
- Ensure good lighting
- Provide room code as alternative
- Use short URL: bit.ly/btl-join

## 📊 Post-Event Wrap-Up

### Immediate (Within 1 Hour)
- [ ] Export results CSV from host dashboard
- [ ] Screenshot final leaderboard
- [ ] Collect feedback from facilitator
- [ ] Note any technical issues for improvement

### Follow-Up (Next Day)
- [ ] Send thank-you message to participants
- [ ] Share photos (with consent)
- [ ] Post leaderboard on church social media
- [ ] Schedule debrief with team
- [ ] Document lessons learned

### Long-Term
- [ ] Update question bank based on feedback
- [ ] Add new mission templates
- [ ] Improve UX based on observed pain points
- [ ] Plan next Kingdom Quest event

## 📞 Emergency Contacts

**Technical Support:**
- [Your Name/Developer]: [Phone/Email]
- Backup Developer: [Phone/Email]

**Venue Support:**
- Venue Manager: [Phone]
- IT/AV Support: [Phone]

**Church Leadership:**
- Youth Pastor: [Phone]
- Event Coordinator: [Phone]

## 🎁 Optional Enhancements

### Prizes
- Gift cards for winning team
- Christian books or devotionals
- Branded merchandise (water bottles, notebooks)
- "Kingdom Builder" trophy or certificate

### Photo Opportunities
- Backdrop with "BE THE LIGHT" branding
- Props: light bulbs, crowns, shields
- Team photos with final scores
- Winner celebration shots

### Follow-Up Content
- Share Bible references from questions
- Post mission solutions that worked
- Create small group discussion guide
- Develop discipleship pathway from game themes

---

**"Your light is needed. Think. Discern. Create. Impact."**
