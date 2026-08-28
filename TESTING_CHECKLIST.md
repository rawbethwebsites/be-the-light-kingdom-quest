# BE THE LIGHT: KINGDOM QUEST
# Testing Protocol for Live Events

## 🧪 Complete Testing Checklist

### Phase 1: Initial Setup Testing (Day Before Event)

#### 1.1 Database & Backend
```bash
# Verify Supabase connection
- [ ] Supabase project accessible
- [ ] Migrations run successfully
- [ ] Tables created: rooms, teams, players, game_questions, answers, missions, votes
- [ ] RLS policies active
- [ ] Realtime enabled for all tables
- [ ] Seed data loaded (10 Light Rush questions, 12 Truth Detector questions)
```

#### 1.2 Environment Variables
```bash
# Check .env.local
- [ ] NEXT_PUBLIC_SUPABASE_URL set
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY set
- [ ] HOST_PASSCODE set (minimum 6 characters)
- [ ] No sensitive keys exposed (service_role key NOT in .env.local)
```

#### 1.3 Local Development
```bash
cd be-the-light-kingdom-quest
npm run dev
```
- [ ] Development server starts without errors
- [ ] Landing page loads: http://localhost:3000
- [ ] No console errors in browser DevTools
- [ ] Tailwind styles rendering correctly

### Phase 2: Host Dashboard Testing

#### 2.1 Room Creation
```
Test Case: Create new room
Steps:
1. Navigate to /host
2. Enter host passcode
3. Click "Create New Room"
Expected:
- Room created with unique 6-character code
- QR code displayed
- Room code visible
- "Lobby" status shown
```
- [ ] Room created successfully
- [ ] Room code is 6 uppercase characters
- [ ] QR code renders correctly
- [ ] Copy code button works

#### 2.2 Display Screen
```
Test Case: Open projector display
Steps:
1. Note room code (e.g., ABC123)
2. Open new tab: /display/ABC123
Expected:
- Display shows room code and QR code
- "Ready to Shine" message visible
- Lobby status shown
```
- [ ] Display page loads
- [ ] Room code matches host dashboard
- [ ] QR code same as host dashboard
- [ ] Text large and readable

#### 2.3 Game Controls
```
Test Case: Start Light Rush game
Steps:
1. On host dashboard, click "Start Light Rush"
2. Observe display screen
Expected:
- Room status changes to "active"
- Display shows "Light Rush" header
- Question 1 appears
- Timer starts at 15 seconds
- Joins locked
```
- [ ] Game starts successfully
- [ ] Display updates in realtime
- [ ] Timer visible and counting down
- [ ] Question text readable
- [ ] Answer options displayed

#### 2.4 Timer Controls
```
Test Case: Timer functionality
Steps:
1. Click "Start Timer"
2. Wait 5 seconds
3. Click "Pause Timer"
4. Click "Reset Timer"
Expected:
- Timer counts down smoothly
- Pause stops timer
- Reset returns to 15 seconds
```
- [ ] Start timer works
- [ ] Pause timer works
- [ ] Reset timer works
- [ ] Timer display updates in realtime

#### 2.5 Score Management
```
Test Case: Manual score adjustment
Steps:
1. Create test team
2. Click "+" button next to score
3. Click "-" button next to score
Expected:
- Score increases by 10
- Score decreases by 10
- Changes reflect on display
```
- [ ] Add points works
- [ ] Remove points works
- [ ] Score updates on display
- [ ] Leaderboard sorts correctly

#### 2.6 Leaderboard
```
Test Case: Display leaderboard
Steps:
1. Click "Leaderboard" button
2. Observe display
Expected:
- Teams sorted by score (descending)
- Team names, scores, ranks visible
- Manual adjust buttons present
```
- [ ] Leaderboard shows all teams
- [ ] Sorted by score correctly
- [ ] Ranks displayed (1st, 2nd, 3rd...)
- [ ] Scores editable

#### 2.7 Game Progression
```
Test Case: Move through questions
Steps:
1. Click "Next Question"
2. Observe display
3. Repeat for all 10 questions
Expected:
- Question index increments
- New question appears
- Timer resets
- Last question shows "End" option
```
- [ ] Next question loads
- [ ] Question text updates
- [ ] Answer options update
- [ ] Timer resets to 15s
- [ ] Final question handled correctly

#### 2.8 Answer Reveal
```
Test Case: Reveal correct answer
Steps:
1. After question displayed, click "Reveal Answer"
2. Observe player and display screens
Expected:
- Correct answer highlighted
- Bible reference shown
- Explanation displayed
- Players see reveal state
```
- [ ] Reveal triggers on display
- [ ] Correct answer indicated
- [ ] Bible reference visible
- [ ] Explanation shown
- [ ] Players receive update

### Phase 3: Player Experience Testing

#### 3.1 Join Flow - QR Code
```
Test Case: Join via QR code
Steps:
1. On phone, scan QR code from display
2. Enter nickname: "TestPlayer1"
3. Submit
Expected:
- Redirected to /play?room=ABC123
- Nickname validated
- Player created in database
- Lobby screen shown
- Team auto-created or assigned
```
- [ ] QR code scans successfully
- [ ] URL includes room code
- [ ] Nickname input works
- [ ] Validation catches empty/invalid names
- [ ] Blocked words filtered
- [ ] Lobby displays after join
- [ ] Team assigned

#### 3.2 Join Flow - Room Code
```
Test Case: Join via manual room code
Steps:
1. On phone, navigate to /play
2. Enter room code: ABC123
3. Enter nickname: "TestPlayer2"
4. Submit
Expected:
- Same as QR code flow
```
- [ ] Manual entry works
- [ ] Room code case-insensitive
- [ ] Invalid codes rejected
- [ ] Expired/locked rooms rejected

#### 3.3 Team Formation
```
Test Case: Multiple players joining
Steps:
1. Join as TestPlayer1 (creates Team A)
2. Join as TestPlayer2 (creates Team B)
3. Join as TestPlayer3 (should join existing team or create new)
Expected:
- Teams displayed on host dashboard
- Player count per team accurate
- All players in lobby state
```
- [ ] Multiple teams can form
- [ ] Player count accurate
- [ ] Team names display correctly
- [ ] Team colors assigned

#### 3.4 Answer Submission
```
Test Case: Submit answer during game
Steps:
1. Host starts Light Rush
2. On player phone, question appears
3. Tap answer option B
4. Submit
Expected:
- Answer submitted successfully
- Confirmation shown
- Cannot submit again
- "Waiting for reveal" state
```
- [ ] Question syncs to player
- [ ] Timer syncs with host
- [ ] Answer submission works
- [ ] Confirmation displays
- [ ] Double-submission prevented
- [ ] Submit button disabled after

#### 3.5 Answer Reveal (Player View)
```
Test Case: Player sees answer reveal
Steps:
1. Host clicks "Reveal Answer"
2. Observe player screen
Expected:
- Correct answer highlighted
- Bible reference shown
- Explanation displayed
- Score will update soon message
```
- [ ] Reveal triggers on player device
- [ ] Correct answer indicated
- [ ] Bible reference visible
- [ ] Explanation readable
- [ ] No premature answer display

#### 3.6 Session Persistence
```
Test Case: Player refreshes browser
Steps:
1. Join game as TestPlayer
2. Refresh browser
3. Navigate back to /play
Expected:
- Session restored from localStorage
- Player rejoins same team
- No re-entry required
- Current game state visible
```
- [ ] Session token saved
- [ ] Refresh restores session
- [ ] Team membership preserved
- [ ] Game state current

#### 3.7 Reconnection
```
Test Case: Player loses connection
Steps:
1. During game, turn on airplane mode
2. Wait 10 seconds
3. Turn off airplane mode
4. Click "Reconnect"
Expected:
- Offline state detected
- Reconnect button appears
- Session restored
- Game state synced
```
- [ ] Offline detected
- [ ] Reconnect button functional
- [ ] Session restored
- [ ] State synced

### Phase 4: Game Mode Testing

#### 4.1 Light Rush (Complete Run)
```
Test Case: Full Light Rush game
Steps:
1. Start Light Rush
2. Play through all 10 questions
3. Submit answers for each
4. Reveal all answers
5. Check final scores
Expected:
- All questions load in sequence
- Scoring correct:
  * Base: 100 points
  * Speed bonus: up to 50 points
  * Light Streak: +100 for 3 consecutive
- Leaderboard updates after each question
- Final scores accurate
```
- [ ] All 10 questions accessible
- [ ] Questions in correct sequence
- [ ] Scoring formula correct
- [ ] Light Streak bonus triggers at 3
- [ ] Speed bonus calculates correctly
- [ ] Leaderboard updates realtime
- [ ] No duplicate answers allowed

**Scoring Verification:**
```
Question 1: Correct, 10s remaining → 100 + (10/15 × 50) = 133 points
Question 2: Correct, 5s remaining → 100 + (5/15 × 50) = 117 points
Question 3: Correct → 100 + speed + 100 (streak) = 200+ points
Question 4: Incorrect → 0 points, streak reset
Question 5: Correct → 100 + speed (new streak: 1)
```

#### 4.2 Truth Detector (Classification)
```
Test Case: Truth Detector rounds
Steps:
1. Start Truth Detector
2. Show classification statement
3. Players choose category
4. Reveal correct category
5. Verify explanation
Expected:
- Four categories clear
- Bible references accurate
- AI-generated content labeled
- Explanations educational
```
- [ ] All classification types present:
  - [ ] Direct Bible Verse
  - [ ] True Bible Fact
  - [ ] AI-Generated Inspiration
  - [ ] False/Altered Claim
- [ ] Bible verses quoted accurately
- [ ] References correct (book chapter:verse)
- [ ] AI content clearly labeled
- [ ] False claims explained
- [ ] Teaching points emphasized

**Content Verification:**
```
Round 1: Matthew 5:14 → Direct Bible Verse ✓
Round 2: Daniel prayed 3x daily → True Bible Fact ✓
Round 3: David used golden sword → False ✓
Round 4: "AI will give all answers" → False ✓
Round 5: Noah's ark → True Bible Fact ✓
Round 6: Moses phone message → False ✓
Round 7: Peter walked on water → True Bible Fact ✓
Round 8: AI inspiration → AI-Generated ✓
```

#### 4.3 Kingdom Builders (Mission Flow)
```
Test Case: Complete Kingdom Builders
Steps:
1. Start Kingdom Builders
2. Assign mission (e.g., Study Smart)
3. Teams collaborate and submit
4. Display submissions
5. Teams vote
6. Host scores
7. Announce winner
Expected:
- Mission templates load
- Submission form validates
- Submissions display on projector
- Voting works (no self-vote)
- Scoring rubric applied
- Winner determined
```
- [ ] All 6 mission templates available:
  - [ ] Study Smart
  - [ ] Kindness Online
  - [ ] Church Impact
  - [ ] Purpose Discovery
  - [ ] Community Solution
  - [ ] Digital Safety
- [ ] Submission form fields:
  - [ ] Problem (180 chars)
  - [ ] AI prompt (350 chars)
  - [ ] Solution (500 chars)
  - [ ] Responsible-use rule (180 chars)
  - [ ] Slogan (100 chars)
- [ ] Character limits enforced
- [ ] Submissions save correctly
- [ ] Display shows submissions
- [ ] Voting prevents self-vote
- [ ] One vote per player enforced
- [ ] Host scoring works (0-10 bonus)
- [ ] Vote count tallies correctly
- [ ] Final score calculates:
  - [ ] Problem relevant: 10
  - [ ] Solution useful: 10
  - [ ] AI prompt strong: 10
  - [ ] Theme connection: 10
  - [ ] Responsible use: 10
  - [ ] Audience votes: up to 10
  - [ ] Host bonus: up to 10

### Phase 5: Realtime Sync Testing

#### 5.1 Multi-Device Sync
```
Test Case: 10+ devices connected
Steps:
1. Open host dashboard
2. Open display screen
3. Join with 10 player devices (or simulate)
4. Start game
5. Submit answers from multiple players
6. Reveal answer
Expected:
- All devices show same question
- Timer synced (±1 second)
- Answer submissions realtime
- Reveal triggers simultaneously
- Scores update on all devices
```
- [ ] Host dashboard responsive
- [ ] Display screen updates <1s latency
- [ ] Player devices sync <2s latency
- [ ] Timer consistent across devices
- [ ] No race conditions on submissions
- [ ] Scores accurate across all views

#### 5.2 Connection Stress Test
```
Test Case: Unstable network
Steps:
1. Simulate slow connection (3G throttling)
2. Join game
3. Submit answer
4. Disconnect mid-game
5. Reconnect
Expected:
- Graceful degradation
- Queue submissions when offline
- Reconnect restores state
- No data loss
```
- [ ] Slow connection handled
- [ ] Loading states shown
- [ ] Offline detection works
- [ ] Reconnection successful
- [ ] State restored correctly

### Phase 6: Security Testing

#### 6.1 Permission Boundaries
```
Test Case: Player cannot access host controls
Steps:
1. Join as player
2. Try to access /host directly
3. Try to modify scores via browser DevTools
4. Try to see correct answers early
Expected:
- Host routes require passcode
- Score modifications rejected
- Correct answers hidden until reveal
```
- [ ] Host dashboard protected
- [ ] Passcode required
- [ ] RLS prevents unauthorized updates
- [ ] Correct_option not sent to players early
- [ ] Server validates all actions

#### 6.2 Answer Submission Limits
```
Test Case: One answer per question
Steps:
1. Join as player
2. Submit answer
3. Try to submit different answer
4. Try via API directly (Postman)
Expected:
- Second submission rejected
- Database unique constraint enforced
- Error message shown
```
- [ ] UI prevents double submission
- [ ] Backend rejects duplicates
- [ ] Database constraint active
- [ ] Error handled gracefully

#### 6.3 Voting Integrity
```
Test Case: Voting restrictions
Steps:
1. Submit mission as Team A
2. Try to vote as Team A member for Team A
3. Try to vote twice
Expected:
- Self-vote blocked
- Second vote rejected
- One vote per player enforced
```
- [ ] Self-vote prevented in UI
- [ ] Backend validates team mismatch
- [ ] Database unique constraint on votes
- [ ] Vote count accurate

#### 6.4 Nickname Validation
```
Test Case: Inappropriate nicknames blocked
Steps:
1. Try to join with: "", "a", blocked words, special chars
Expected:
- Empty rejected
- Too short rejected (<2 chars)
- Blocked words filtered
- Special chars validated
```
- [ ] Empty nickname rejected
- [ ] Single char rejected
- [ ] Blocked words caught
- [ ] Max length enforced (30 chars)
- [ ] Special characters validated

### Phase 7: Edge Cases & Error Handling

#### 7.1 Room Edge Cases
```
Test Cases:
- [ ] Room code not found → Show "Room not found" message
- [ ] Room already ended → Show "Game has ended" message
- [ ] Room joins locked → Show "Joins are locked" message
- [ ] Invalid room code format → Show "Invalid code" message
```

#### 7.2 Timer Edge Cases
```
Test Cases:
- [ ] Timer reaches 0 → Auto-reveal or move on
- [ ] Host pauses timer → Timer stops for all
- [ ] Player joins after timer starts → See current time
- [ ] Timer negative → Display 0, not negative
```

#### 7.3 Score Edge Cases
```
Test Cases:
- [ ] Negative scores allowed? (Yes, for manual adjustment)
- [ ] Very large scores display correctly
- [ ] Tie scores sort by creation time
- [ ] Score 0 displays as "0" not blank
```

#### 7.4 Connection Edge Cases
```
Test Cases:
- [ ] Host disconnects → Show "Host offline" on display
- [ ] All players disconnect → Room remains active
- [ ] Database connection lost → Show "Reconnecting..."
- [ ] Supabase downtime → Fallback to offline mode
```

### Phase 8: Performance Testing

#### 8.1 Load Testing
```
Test Case: 50+ concurrent players
Steps:
1. Simulate 50 players joining simultaneously
2. All submit answers at once
3. Monitor database and response times
Expected:
- All joins succeed within 3s
- Submissions process without errors
- Realtime updates <2s latency
- No database connection exhaustion
```
- [ ] 50 concurrent joins successful
- [ ] Answer submissions process
- [ ] Realtime latency acceptable
- [ ] No errors or timeouts

#### 8.2 Display Performance
```
Test Case: Projector display over time
Steps:
1. Keep display open for 2 hours
2. Monitor memory usage
3. Check for animation stutter
Expected:
- Memory stable (<500MB)
- Animations smooth (60fps)
- No memory leaks
- No crashes
```
- [ ] Memory usage stable
- [ ] Animations smooth
- [ ] No degradation over time
- [ ] Browser tab remains responsive

### Phase 9: Accessibility Testing

#### 9.1 Visual Accessibility
```
Test Cases:
- [ ] Text readable on projector from 20 feet
- [ ] Color contrast meets WCAG AA
- [ ] No reliance on color alone (icons + text)
- [ ] Reduced motion setting respected
```

#### 9.2 Keyboard Navigation
```
Test Cases:
- [ ] Host controls work with keyboard
- [ ] Tab order logical
- [ ] Enter/Space activate buttons
- [ ] Focus indicators visible
```

#### 9.3 Screen Reader
```
Test Cases:
- [ ] All interactive elements labeled
- [ ] ARIA attributes correct
- [ ] Dynamic content announced
- [ ] Timer changes announced
```

### Phase 10: Browser Compatibility

#### 10.1 Desktop Browsers
```
Test on:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
Expected: All features work identically
```

#### 10.2 Mobile Browsers
```
Test on:
- [ ] iOS Safari
- [ ] Chrome for Android
- [ ] Samsung Internet
Expected: Mobile-optimized, touch-friendly
```

---

## ✅ Sign-Off Checklist

Before going live:
- [ ] All 10 phases tested
- [ ] All critical bugs fixed
- [ ] Facilitator trained on host dashboard
- [ ] Backup plan ready (offline mode)
- [ ] Emergency contacts available
- [ ] Prizes prepared (if applicable)
- [ ] Photo consent forms ready (if taking photos)

**Tested by:** _________________  
**Date:** _________________  
**Approved for live event:** ☐ Yes ☐ No  
**Notes:** _________________
