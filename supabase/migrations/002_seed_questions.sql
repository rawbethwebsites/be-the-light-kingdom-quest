-- ============================================
-- SEED DATA: GAME QUESTIONS
-- ============================================

-- ============================================
-- GAME 1: LIGHT RUSH (Bible Quiz)
-- ============================================

INSERT INTO game_questions (game_key, sequence, question_text, question_type, options, correct_option, explanation, bible_reference, source_label, time_limit_seconds, difficulty) VALUES
('light_rush', 1, 
'Which verse says, "You are the light of the world"?',
'multiple_choice',
'["John 3:16", "Matthew 5:14", "Psalm 23:1", "Romans 8:28"]'::jsonb,
1,
'Jesus teaches that believers should visibly influence the world through faith and good works.',
'Matthew 5:14',
'Bible',
15,
'medium'),

('light_rush', 2,
'What did David use to defeat Goliath?',
'multiple_choice',
'["A golden sword", "A sling and stone", "A spear", "A bow and arrow"]'::jsonb,
1,
'David chose five smooth stones and a sling, trusting God rather than conventional weapons.',
'1 Samuel 17:49-50',
'Bible',
15,
'easy'),

('light_rush', 3,
'Where was Daniel thrown when he continued praying to God?',
'multiple_choice',
'["A fiery furnace", "A lions'' den", "A prison cell", "The wilderness"]'::jsonb,
1,
'Daniel was thrown into the lions'' den for praying to God, but God sent an angel to shut the lions'' mouths.',
'Daniel 6:16-22',
'Bible',
15,
'easy'),

('light_rush', 4,
'How many days and nights did it rain during Noah''s time?',
'multiple_choice',
'["7 days and nights", "40 days and nights", "100 days and nights", "3 days and nights"]'::jsonb,
1,
'It rained for 40 days and 40 nights, flooding the earth and destroying all life except those in the ark.',
'Genesis 7:12',
'Bible',
15,
'medium'),

('light_rush', 5,
'What brave thing did Esther do to save her people?',
'multiple_choice',
'["She fought in battle", "She approached the king without being summoned", "She built an ark", "She wrote a letter"]'::jsonb,
1,
'Esther risked her life by approaching King Xerxes without being summoned, saying "If I perish, I perish."',
'Esther 4:16',
'Bible',
15,
'medium'),

('light_rush', 6,
'Why was Joseph thrown into prison in Egypt?',
'multiple_choice',
'["He stole from Potiphar", "He refused to sin with Potiphar''s wife", "He interpreted dreams wrongly", "He attacked someone"]'::jsonb,
1,
'Joseph chose integrity over sin, refusing Potiphar''s wife even though it cost him his freedom.',
'Genesis 39:7-20',
'Bible',
15,
'medium'),

('light_rush', 7,
'In the parable of the Good Samaritan, who helped the injured man?',
'multiple_choice',
'["A priest", "A Levite", "A Samaritan", "A Roman soldier"]'::jsonb,
2,
'A despised Samaritan showed compassion when religious leaders passed by, teaching us to love our neighbors.',
'Luke 10:33-34',
'Bible',
15,
'easy'),

('light_rush', 8,
'Which of these is NOT a fruit of the Spirit?',
'multiple_choice',
'["Love", "Patience", "Pride", "Self-control"]'::jsonb,
2,
'Pride is not a fruit of the Spirit. The fruits are: love, joy, peace, patience, kindness, goodness, faithfulness, gentleness, and self-control.',
'Galatians 5:22-23',
'Bible',
15,
'medium'),

('light_rush', 9,
'What did Jesus say we should let others see?',
'multiple_choice',
'["Our wealth", "Our good deeds", "Our intelligence", "Our power"]'::jsonb,
1,
'Jesus said to let our light shine before others through good deeds, so they may glorify God.',
'Matthew 5:16',
'Bible',
15,
'easy'),

('light_rush', 10,
'How should we use the gifts God has given us?',
'multiple_choice',
'["To serve others", "To show off", "To make money only", "To compete with others"]'::jsonb,
0,
'God gives us gifts to serve others and build up His kingdom, not for selfish gain.',
'1 Peter 4:10',
'Bible',
15,
'easy');

-- ============================================
-- GAME 2: TRUTH DETECTOR
-- ============================================

INSERT INTO game_questions (game_key, sequence, question_text, question_type, options, correct_option, explanation, bible_reference, source_label, time_limit_seconds, difficulty) VALUES
('truth_detector', 1,
'"You are the light of the world. A city set on a hill cannot be hidden."',
'classification',
'["Direct Bible Verse", "True Bible Fact", "AI-Generated Inspiration", "False or Altered Claim"]'::jsonb,
0,
'This is a direct quote from Jesus'' Sermon on the Mount, calling believers to be visible examples of faith.',
'Matthew 5:14',
'Bible',
20,
'medium'),

('truth_detector', 2,
'Daniel prayed three times a day, even when it was forbidden by law.',
'classification',
'["Direct Bible Verse", "True Bible Fact", "AI-Generated Inspiration", "False or Altered Claim"]'::jsonb,
1,
'This is a true fact about Daniel. He continued his habit of praying three times daily despite the king''s decree.',
'Daniel 6:10',
'Bible',
20,
'medium'),

('truth_detector', 3,
'David defeated Goliath using a golden sword given to him by King Saul.',
'classification',
'["Direct Bible Verse", "True Bible Fact", "AI-Generated Inspiration", "False or Altered Claim"]'::jsonb,
3,
'FALSE! David rejected Saul''s armor and used a sling with five smooth stones, trusting God not weapons.',
'1 Samuel 17:38-50',
'Bible',
20,
'easy'),

('truth_detector', 4,
'"Be strong and courageous, because AI will give you all the answers you need."',
'classification',
'["Direct Bible Verse", "True Bible Fact", "AI-Generated Inspiration", "False or Altered Claim"]'::jsonb,
3,
'FALSE! This sounds spiritual but is not Scripture. The real verse says "Be strong and courageous, for the LORD your God will be with you."',
'Joshua 1:9',
'Bible',
20,
'medium'),

('truth_detector', 5,
'Noah built an ark to save his family and pairs of every kind of animal from the flood.',
'classification',
'["Direct Bible Verse", "True Bible Fact", "AI-Generated Inspiration", "False or Altered Claim"]'::jsonb,
1,
'This is a true Bible fact. God commanded Noah to build the ark to preserve life during the flood.',
'Genesis 6:14-19',
'Bible',
20,
'easy'),

('truth_detector', 6,
'Moses received the Ten Commandments through a phone message from God.',
'classification',
'["Direct Bible Verse", "True Bible Fact", "AI-Generated Inspiration", "False or Altered Claim"]'::jsonb,
3,
'FALSE! Moses received the Ten Commandments written on stone tablets by God''s finger on Mount Sinai.',
'Exodus 31:18',
'Bible',
20,
'easy'),

('truth_detector', 7,
'Peter walked on water toward Jesus before becoming afraid and sinking.',
'classification',
'["Direct Bible Verse", "True Bible Fact", "AI-Generated Inspiration", "False or Altered Claim"]'::jsonb,
1,
'True! Peter stepped out in faith and walked on water, but sank when he took his eyes off Jesus.',
'Matthew 14:29-30',
'Bible',
20,
'medium'),

('truth_detector', 8,
'"Your potential is limitless. Technology and faith together can solve any problem. You are designed for greatness."',
'classification',
'["Direct Bible Verse", "True Bible Fact", "AI-Generated Inspiration", "False or Altered Claim"]'::jsonb,
2,
'AI-GENERATED: This is an inspirational message that sounds spiritual but is not a Bible verse. It can encourage but should not be treated as Scripture.',
NULL,
'AI-Generated',
20,
'medium');

-- ============================================
-- GAME 3: KINGDOM BUILDERS (Missions)
-- ============================================

-- Note: Missions are created dynamically per room, but we can add template data
-- The actual mission cards are defined in the application code

INSERT INTO game_questions (game_key, sequence, question_text, question_type, options, correct_option, explanation, bible_reference, source_label, time_limit_seconds, difficulty) VALUES
('kingdom_builders', 1,
'Mission: Study Smart - Help teenagers who struggle with distraction and exam preparation.',
'mission_template',
'["Problem to solve", "AI prompt to use", "Your solution", "Responsible-use rule", "Team slogan"]'::jsonb,
0,
'Teams create a study system using AI responsibly to help students focus and prepare better.',
NULL,
'Mission Template',
60,
'hard');

-- ============================================
-- ADDITIONAL TRUTH DETECTOR ROUNDS (Bonus)
-- ============================================

INSERT INTO game_questions (game_key, sequence, question_text, question_type, options, correct_option, explanation, bible_reference, source_label, time_limit_seconds, difficulty) VALUES
('truth_detector', 9,
'"Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God."',
'classification',
'["Direct Bible Verse", "True Bible Fact", "AI-Generated Inspiration", "False or Altered Claim"]'::jsonb,
0,
'This is a direct Bible verse from Paul, teaching us to bring our worries to God in prayer.',
'Philippians 4:6',
'Bible',
20,
'medium'),

('truth_detector', 10,
'Jesus fed 5,000 people with five loaves and two fish.',
'classification',
'["Direct Bible Verse", "True Bible Fact", "AI-Generated Inspiration", "False or Altered Claim"]'::jsonb,
1,
'True! This miracle shows Jesus'' power and compassion, feeding a multitude with almost nothing.',
'Matthew 14:17-21',
'Bible',
20,
'easy'),

('truth_detector', 11,
'"Success comes to those who manifest it. The universe rewards positive thinking."',
'classification',
'["Direct Bible Verse", "True Bible Fact", "AI-Generated Inspiration", "False or Altered Claim"]'::jsonb,
3,
'FALSE! This is a New Age concept, not biblical. Scripture teaches humility, hard work, and dependence on God.',
'Proverbs 16:3',
'Bible',
20,
'medium'),

('truth_detector', 12,
'"Use technology wisely. Let your creativity serve others. Verify what you read. Protect your heart online."',
'classification',
'["Direct Bible Verse", "True Bible Fact", "AI-Generated Inspiration", "False or Altered Claim"]'::jsonb,
2,
'AI-GENERATED: This is wise counsel that aligns with biblical principles but is not a direct Scripture quote.',
NULL,
'AI-Generated',
20,
'medium');

-- ============================================
-- VERIFICATION
-- ============================================
SELECT game_key, COUNT(*) as question_count 
FROM game_questions 
GROUP BY game_key 
ORDER BY game_key;
