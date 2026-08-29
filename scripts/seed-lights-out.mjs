import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey, { auth: { persistSession: false } });

const rows = [
  ['Your friend sends a screenshot mocking another student. The group chat is laughing. What is the best Light Move?', ['Forward it so more people can see it', 'Stay silent and pretend you did not see it', 'Tell the group to stop, refuse to share it, and check on the student privately', 'Edit the screenshot into a meme so it feels less serious'], 2, 'Ephesians 4:29', 'Online Life', 'Light restores dignity. Being light online means refusing cruelty, protecting people, and using your voice with courage.'],
  ['You used AI to explain your homework. The answer sounds confident, but you are not fully sure it is correct. What is the best Light Move?', ['Copy it immediately because AI sounds smart', 'Check it with your textbook, class notes, or teacher before using it', 'Tell your friends AI is always more accurate than people', 'Change a few words so nobody knows you used AI'], 1, '1 Thessalonians 5:21', 'School', 'Use AI to learn faster, but wisdom verifies before trusting. Confidence is not the same as truth.'],
  ['A link says you won free data if you enter your password and phone number. What is the best Light Move?', ['Enter quickly before the offer expires', 'Share it with the church group so everyone can win', 'Ignore the link, do not enter details, and ask a trusted adult to verify it', 'Use your friend’s phone number instead'], 2, 'Proverbs 22:3', 'Digital Safety', 'Light includes wisdom and protection. Your private information is not something to trade for pressure or fake rewards.'],
  ['You notice a new student sitting alone at youth conference. Your friends want to keep your normal circle closed. What is the best Light Move?', ['Invite them in and help them feel seen', 'Wait for a leader to handle it', 'Laugh about how awkward they look', 'Ignore them so your friends do not tease you'], 0, 'Luke 10:33-37', 'Church', 'Jesus calls us to love people practically. Light makes room for others instead of leaving them invisible.'],
  ['You are angry and about to post something that will embarrass someone publicly. What is the best Light Move?', ['Post it now before you calm down', 'Save it, pray, cool down, and choose a private respectful conversation if needed', 'Ask followers to vote if you should expose them', 'Use AI to write a harsher caption'], 1, 'Proverbs 15:1', 'Online Life', 'Technology is powerful; character must lead. Self-control protects people and protects your witness.'],
  ['Your classmate asks you to send answers during a test because “everyone cheats small.” What is the best Light Move?', ['Send the answers to keep the friendship', 'Refuse kindly, stay honest, and offer to help them study later', 'Send wrong answers as a joke', 'Use AI during the test and split the marks'], 1, 'Proverbs 10:9', 'School', 'Light is integrity when pressure is high. Helping someone prepare is love; helping them cheat is not.'],
  ['An AI chatbot gives you spiritual advice that contradicts a Bible verse you know. What is the best Light Move?', ['Trust the chatbot because it knows everything', 'Compare it with Scripture and ask a mature Christian leader for guidance', 'Post it as a Bible verse because it sounds deep', 'Keep asking until AI agrees with you'], 1, '2 Timothy 3:16-17', 'Faith + AI', 'AI is a tool, not spiritual authority. Scripture, prayer, wise counsel, and responsibility come first.'],
  ['You have a talent for design, music, coding, drama, or speaking, but you feel it is not spiritual enough. What is the best Light Move?', ['Hide the gift because only preaching matters', 'Use the gift to serve people, build others up, and glorify God', 'Only use it if it makes you famous', 'Compare yourself until you quit'], 1, '1 Peter 4:10', 'Purpose', 'Your gifts can solve real problems and serve people. Light shines when gifts become service, not just attention.'],
  ['A viral video claims a Bible verse says something shocking, but no reference is shown. What is the best Light Move?', ['Believe it because it is emotional', 'Share it with “wow” before checking', 'Look up the reference, compare translations, and verify before sharing', 'Argue in the comments without checking'], 2, 'Acts 17:11', 'Truth Check', 'Truth is worth checking. Not everything that sounds wise, religious, emotional, or convincing is true.'],
  ['Your younger sibling wants help with homework. You are busy scrolling and annoyed. What is the best Light Move?', ['Tell them to stop disturbing you', 'Help for a short focused time, then return to your work', 'Give them AI answers without explaining', 'Mock them for not understanding'], 1, 'Galatians 5:13', 'Home', 'Light starts at home. Serving does not always look dramatic; sometimes it looks like patient help.'],
  ['Your friend confesses they are struggling with anxiety and cannot pray. What is the best Light Move?', ['Tell them real Christians never feel anxious', 'Listen, encourage them, pray with them if they want, and help them speak to a trusted adult/leader', 'Post their story as anonymous content', 'Send one motivational quote and disappear'], 1, 'Romans 12:15', 'Friendship', 'Being light means compassion and responsibility. Listen well, pray, and help people reach safe support.'],
  ['You want to use AI to make church content for teenagers. What is the best Light Move?', ['Let AI invent Bible verses so the posts sound powerful', 'Use AI for ideas and drafts, then verify Scripture, edit with care, and label examples clearly', 'Copy trending content even if it is false', 'Use fear and shame because it gets more views'], 1, 'Colossians 3:17', 'Church', 'Use AI to create and serve, but never fake Scripture or replace truth with hype.'],
  ['Someone asks for your location, school name, and private photos in a game chat. What is the best Light Move?', ['Send it if they seem nice', 'Refuse, block/report if needed, and tell a trusted adult', 'Send old photos so it is safer', 'Keep chatting but hide it from your parents'], 1, 'Proverbs 4:23', 'Digital Safety', 'Digital safety is wisdom. Do not give strangers private access to your life.'],
  ['Your group is planning a school clean-up, but people say it is not cool. What is the best Light Move?', ['Quit so nobody laughs', 'Serve anyway and invite others with a clear, positive plan', 'Complain online but do nothing', 'Only join if someone records you'], 1, 'Matthew 5:16', 'Community', 'Light changes environments through action. Good works point beyond you to God.'],
  ['You discover an embarrassing rumor about someone is false. People are still spreading it. What is the best Light Move?', ['Stay quiet because drama is entertaining', 'Help stop the rumor, speak truth carefully, and protect the person from more shame', 'Add your own version so it sounds funnier', 'Use AI to generate more gossip'], 1, 'Ephesians 4:15', 'Truth Check', 'Light exposes lies without destroying people. Truth and love must work together.'],
  ['You are exhausted from trying to impress everyone online. What is the best Light Move?', ['Post more so nobody forgets you', 'Take a healthy break, remember your identity in Christ, and use tech with boundaries', 'Compare yourself until you improve', 'Create a fake perfect version of your life'], 1, 'Romans 12:2', 'Identity', 'You are not your likes, views, or streaks. Character and identity are deeper than performance.'],
  ['A friend wants to use AI to generate an apology instead of actually taking responsibility. What is the best Light Move?', ['Let AI apologize and move on', 'Use AI only to organize thoughts, then personally own the wrong and speak honestly', 'Deny everything', 'Make the apology sound spiritual but avoid changing'], 1, 'James 5:16', 'Character', 'AI can help words, but it cannot replace repentance, humility, and changed behavior.'],
  ['Your team has one minute to encourage the hall before the final score. What is the best Light Move?', ['Brag about being smarter than everyone', 'Celebrate others, point to the theme, and challenge everyone to shine this week', 'Mock the lowest scores', 'Say nothing because only winners matter'], 1, 'Matthew 5:14-16', 'Finale', 'No one should be shamed. The real win is leaving ready to shine at school, church, home, and online.'],
];

function rotate(row, index) {
  const target = index % 4;
  const options = [...row[1]];
  const [correct] = options.splice(row[2], 1);
  options.splice(target, 0, correct);
  return {
    game_key: 'lights_out',
    sequence: index + 1,
    question_text: row[0],
    question_type: 'multiple_choice',
    options,
    correct_option: target,
    bible_reference: row[3],
    source_label: row[4],
    explanation: row[5],
    time_limit_seconds: 25,
    difficulty: index % 5 === 1 ? 'hard' : index % 3 === 0 ? 'medium' : 'easy',
    is_active: true,
  };
}

const questions = rows.map(rotate);

await supabase.from('game_questions').update({ is_active: false }).eq('game_key', 'kingdom_builders');
await supabase.from('game_questions').delete().eq('game_key', 'lights_out');
const { error } = await supabase.from('game_questions').insert(questions);
if (error) throw error;
const distribution = questions.reduce((acc, q) => {
  const key = String.fromCharCode(65 + q.correct_option);
  acc[key] = (acc[key] || 0) + 1;
  return acc;
}, {});
console.log(JSON.stringify({ inserted: questions.length, distribution }, null, 2));
