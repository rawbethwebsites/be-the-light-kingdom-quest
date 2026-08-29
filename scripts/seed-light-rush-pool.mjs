import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://biegqlxagqouppnvjdox.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_D85-oLlStHz22DUHr033ug_ZJKoqBfm';
const supabase = createClient(supabaseUrl, supabaseAnonKey, { auth: { persistSession: false } });

const refs = [
  ['Which verse says, “You are the light of the world”?', ['Romans 8:28','Matthew 5:14','Psalm 23:1','John 3:16'], 1, 'Matthew 5:14', 'Jesus calls His followers the light of the world — visible, useful, and impossible to hide.'],
  ['Jesus said people do not light a lamp and put it under what?', ['A basket','A mountain','A river','A crown'], 0, 'Matthew 5:15', 'Light is meant to be seen. God gives gifts and courage so we can serve others, not hide.'],
  ['Why should our light shine before people?', ['So we become famous','So they glorify our Father in heaven','So we win arguments','So nobody corrects us'], 1, 'Matthew 5:16', 'Good works are not for showing off; they point people back to God.'],
  ['David defeated Goliath with what surprising weapon?', ['A golden sword','A spear from Saul','A sling and stone','A thunderbolt'], 2, '1 Samuel 17:49', 'Faith plus courage made a simple tool powerful in David’s hands.'],
  ['What did David refuse to wear before facing Goliath?', ['Saul’s armour','Joseph’s coat','A priestly robe','A Roman helmet'], 0, '1 Samuel 17:38–39', 'David did not copy someone else’s style. He used what God had trained him with.'],
  ['Daniel kept praying even when the law said what?', ['No one could pray to anyone except the king','Everyone must sleep outside','Only lions could be fed','No one could read Scripture'], 0, 'Daniel 6:7–10', 'Daniel chose faithfulness under pressure, even when obedience was costly.'],
  ['How many times a day did Daniel pray?', ['Once','Twice','Three times','Seven times'], 2, 'Daniel 6:10', 'Daniel’s courage came from consistent prayer, not last-minute panic.'],
  ['What happened to Daniel in the lions’ den?', ['He fought the lions with a sword','God shut the lions’ mouths','He escaped through a tunnel','The lions became sheep'], 1, 'Daniel 6:22', 'God protected Daniel and showed that faithfulness matters.'],
  ['How many days and nights did it rain during Noah’s flood?', ['7','12','30','40'], 3, 'Genesis 7:12', 'Noah obeyed God before the crowd understood what was coming.'],
  ['What was Noah told to build?', ['A tower','An ark','A palace','A city wall'], 1, 'Genesis 6:14', 'Noah’s obedience looked strange until the storm came. Wisdom often prepares before others clap.'],
  ['What courageous action is Esther known for?', ['She approached the king to plead for her people','She built the ark','She interpreted Pharaoh’s dream','She defeated Goliath'], 0, 'Esther 4:14–16', 'Esther used her position bravely to protect others.'],
  ['Who said Esther may have come to royalty “for such a time as this”?', ['Mordecai','Moses','Peter','Elijah'], 0, 'Esther 4:14', 'Purpose sometimes appears as responsibility in a hard moment.'],
  ['Why was Joseph thrown into prison in Egypt?', ['He stole gold','He refused temptation and was falsely accused','He mocked Pharaoh','He abandoned his family'], 1, 'Genesis 39:7–20', 'Joseph chose integrity even when the immediate result was unfair.'],
  ['What gift helped Joseph interpret dreams?', ['Magic tricks','Wisdom from God','A secret app','A royal textbook'], 1, 'Genesis 40:8', 'Joseph gave credit to God, not himself.'],
  ['In the Good Samaritan story, who stopped to help the injured man?', ['A Samaritan','A priest only','A Levite only','A soldier'], 0, 'Luke 10:33–35', 'Jesus teaches that real love crosses social lines and takes action.'],
  ['What question does the Good Samaritan story answer?', ['Who is my neighbour?','Where is the temple?','How tall was Goliath?','Who built the ark?'], 0, 'Luke 10:29–37', 'A neighbour is someone we choose to love and help.'],
  ['Which is a fruit of the Spirit?', ['Jealousy','Self-control','Pride','Revenge'], 1, 'Galatians 5:22–23', 'The Spirit grows character that makes our lives a light.'],
  ['Which is NOT listed as a fruit of the Spirit?', ['Kindness','Faithfulness','Boasting','Gentleness'], 2, 'Galatians 5:22–23', 'Godly character is not loud ego; it is love, joy, peace, patience, and more.'],
  ['Jesus said believers are also the what of the earth?', ['Salt','Smoke','Mirror','Thunder'], 0, 'Matthew 5:13', 'Salt preserves and adds flavour. Followers of Jesus should make a healthy difference.'],
  ['What should lead how we use technology and AI?', ['Character and wisdom','Only speed','Online popularity','Winning at any cost'], 0, 'Proverbs 4:7', 'Wisdom must lead powerful tools, or the tools can lead us badly.'],
  ['Which is the best responsible use of AI for schoolwork?', ['Copy and submit without reading','Ask it to explain, practise, then verify','Use it to insult classmates','Share private passwords with it'], 1, 'Proverbs 18:15', 'Wise learners seek knowledge and verify what they receive.'],
  ['What should you do when an AI answer sounds spiritual but has no Bible reference?', ['Believe it immediately','Share it as Scripture','Check Scripture and verify','Argue online for hours'], 2, 'Acts 17:11', 'The Bereans were praised because they examined the Scriptures carefully.'],
  ['The Bereans checked Paul’s teaching against what?', ['Trends','Scripture','Memes','Dreams only'], 1, 'Acts 17:11', 'Even impressive teaching should be tested by Scripture.'],
  ['Which phrase best matches “Truth Detector”?', ['If it sounds deep, it must be true','Truth is worth checking','Fast posts are always facts','Likes prove accuracy'], 1, '1 Thessalonians 5:21', 'Test everything; hold on to what is good.'],
  ['What did Peter do when Jesus called him on the water?', ['Walked on water toward Jesus','Built an ark','Fought a lion','Wrote a text message'], 0, 'Matthew 14:29', 'Peter stepped out in faith, but he still needed to keep his eyes on Jesus.'],
  ['When Peter began sinking, what did Jesus do?', ['Ignored him','Immediately reached out His hand','Sent a boat invoice','Told him to swim alone'], 1, 'Matthew 14:30–31', 'Jesus corrected Peter but also rescued him.'],
  ['Who interpreted Pharaoh’s dreams in Egypt?', ['Joseph','Daniel','David','Nehemiah'], 0, 'Genesis 41:15–16', 'Joseph used his God-given gift to serve and solve a national crisis.'],
  ['Who interpreted King Nebuchadnezzar’s dream?', ['Daniel','Esther','Noah','Ruth'], 0, 'Daniel 2:27–28', 'Daniel gave God credit for wisdom beyond human ability.'],
  ['Which young person said, “Speak, for your servant is listening”?', ['Samuel','Solomon','Samson','Saul'], 0, '1 Samuel 3:10', 'Samuel learned to recognise and respond to God’s voice.'],
  ['Who was told, “Do not let anyone look down on you because you are young”?', ['Timothy','Gideon','Jonah','Abel'], 0, '1 Timothy 4:12', 'Young believers can lead through speech, conduct, love, faith, and purity.'],
  ['According to 1 Timothy 4:12, young people should set an example in all EXCEPT:', ['Speech','Love','Faith','Clout chasing'], 3, '1 Timothy 4:12', 'Influence is not clout; it is character people can trust.'],
  ['Who used a small lunch to feed thousands after giving it to Jesus?', ['A boy','A king','A soldier','A tax collector'], 0, 'John 6:9–11', 'Small gifts surrendered to Jesus can become bigger than expected.'],
  ['How many loaves were in the boy’s lunch?', ['Two','Five','Seven','Twelve'], 1, 'John 6:9', 'Five loaves and two fish were enough when placed in Jesus’ hands.'],
  ['Which woman showed loyalty by saying, “Your people shall be my people”?', ['Ruth','Esther','Mary Magdalene','Deborah'], 0, 'Ruth 1:16', 'Ruth’s loyalty and faith shaped her future.'],
  ['Who rebuilt Jerusalem’s walls while facing opposition?', ['Nehemiah','Noah','Nathan','Nicodemus'], 0, 'Nehemiah 4:6', 'Nehemiah combined prayer, planning, teamwork, and courage.'],
  ['What did Nehemiah do before asking the king for help?', ['Prayed','Posted a rant','Ran away','Built a statue'], 0, 'Nehemiah 1:4–11', 'Prayer and planning can work together.'],
  ['Who said, “Here am I. Send me!”?', ['Isaiah','Jonah','Cain','Pilate'], 0, 'Isaiah 6:8', 'God calls willing people to carry His message.'],
  ['Which prophet ran away from God’s assignment to Nineveh?', ['Jonah','Elisha','Habakkuk','Malachi'], 0, 'Jonah 1:1–3', 'Running from purpose delays obedience but does not cancel God’s mercy.'],
  ['What is the “armour of God” passage about?', ['Standing firm spiritually','Winning fashion awards','Building Noah’s ark','Training lions'], 0, 'Ephesians 6:10–18', 'God equips believers with truth, righteousness, faith, salvation, Scripture, and prayer.'],
  ['Which item is called the “sword of the Spirit”?', ['The Word of God','A golden spear','A phone charger','A crown'], 0, 'Ephesians 6:17', 'Scripture is not decoration; it helps us discern and stand firm.'],
  ['What should we do if we lack wisdom?', ['Ask God','Pretend online','Copy the loudest person','Give up'], 0, 'James 1:5', 'God invites us to ask for wisdom generously.'],
  ['According to James, faith without works is what?', ['Dead','Expensive','Invisible ink','A microphone'], 0, 'James 2:17', 'Real faith produces visible action.'],
  ['What did Jesus say is the greatest commandment?', ['Love God with all your heart','Win every debate','Become famous','Never ask questions'], 0, 'Matthew 22:37–38', 'Love for God should shape our thoughts, choices, and actions.'],
  ['What commandment is like the first?', ['Love your neighbour as yourself','Build a bigger barn','Only help friends','Avoid every problem'], 0, 'Matthew 22:39', 'Faith becomes visible in how we treat people.'],
  ['What did Jesus do for His disciples in John 13?', ['Washed their feet','Gave them phones','Built a palace','Sold tickets'], 0, 'John 13:5', 'Leadership in God’s kingdom looks like humble service.'],
  ['Which disciple doubted until he saw Jesus alive?', ['Thomas','Andrew','Philip','Matthew'], 0, 'John 20:24–29', 'Jesus met Thomas with truth and invited him into faith.'],
  ['What did Jesus say about peacemakers?', ['They will be called children of God','They will always win arguments','They should avoid everyone','They need more noise'], 0, 'Matthew 5:9', 'Peacemakers bring God’s character into conflict.'],
  ['Which Bible book says, “The fear of the Lord is the beginning of knowledge”?', ['Proverbs','Acts','Revelation','Philemon'], 0, 'Proverbs 1:7', 'True learning begins with reverence for God.'],
  ['Which is a wise online privacy choice?', ['Never share passwords or private details','Post your OTP for friends','Click every free-money link','Use your birthday as every password'], 0, 'Proverbs 22:3', 'Wisdom sees danger and takes precautions.'],
  ['If a link promises free prizes but asks for your password, what should you do?', ['Stop, verify, and do not enter private info','Share it with everyone','Type fast before it expires','Send your bank details'], 0, 'Proverbs 14:15', 'The simple believe anything, but the prudent think carefully.'],
  ['Which AI prompt is strongest for learning?', ['Do my homework and hide it','Explain this topic, quiz me, and show sources','Make me look smarter than I am','Insult my teacher'], 1, 'Proverbs 9:9', 'Good prompts help you learn, practise, and grow honestly.'],
  ['Which is cheating with AI?', ['Using it to explain hard topics','Using it to generate practice questions','Submitting AI work as your own','Checking grammar after writing'], 2, 'Colossians 3:23', 'Responsible AI use supports effort; it should not replace honesty.'],
  ['What should character do when technology becomes powerful?', ['Lead it','Disappear','Sleep','Follow trends blindly'], 0, 'Proverbs 4:23', 'Guarding the heart matters because choices flow from it.'],
  ['What does “city set on a hill” mean in Matthew 5?', ['Visible influence that cannot be hidden','A secret cave','A private password','A sports stadium'], 0, 'Matthew 5:14', 'Jesus describes visible, public witness through faithful living.'],
  ['Which person showed courage before a giant when adults were afraid?', ['David','Jonah','Pilate','Ahab'], 0, '1 Samuel 17:32', 'Courage is not about size; it is about trust and obedience.'],
  ['Which Bible character became queen and helped save her people?', ['Esther','Ruth','Miriam','Lydia'], 0, 'Esther 7:3–4', 'Esther used influence for protection, not personal comfort only.'],
  ['Which is the funniest but still true lesson from Jonah?', ['You can run from God, but fish transport is not comfortable','God hates cities','Boats are always bad','Prophets never complain'], 0, 'Jonah 1–2', 'Jonah’s story is serious and funny: God’s mercy outruns our stubbornness.'],
  ['Which action best shows “being light” at school?', ['Encouraging someone others ignore','Joining cyberbullying','Sharing fake gist','Mocking someone’s accent'], 0, 'Matthew 5:16', 'Light is visible through love, courage, truth, and service.'],
  ['Which statement best captures Kingdom Quest?', ['Think. Discern. Create. Impact.','Scroll. Copy. Flex. Repeat.','Hide. Panic. Blame. Quit.','Argue. Trend. Vanish. Sleep.'], 0, 'Matthew 5:14–16', 'The game calls teenagers to faith-filled action in real life.'],
  ['What does Psalm 119:105 call God’s word?', ['A lamp to my feet and a light to my path','A Wi-Fi router','A locked gate','A hidden sword only'], 0, 'Psalm 119:105', 'Scripture gives direction when choices are confusing.'],
  ['Who led Israel after Moses and told the people to choose whom they would serve?', ['Joshua','Goliath','Herod','Caesar'], 0, 'Joshua 24:15', 'Joshua challenged people to make a clear commitment.'],
  ['What did Mary say when told she would give birth to Jesus?', ['I am the Lord’s servant','This is impossible so I quit','Send someone else forever','Where is my crown?'], 0, 'Luke 1:38', 'Mary responded with humble trust.'],
  ['Who climbed a tree to see Jesus?', ['Zacchaeus','Nicodemus','Barabbas','Stephen'], 0, 'Luke 19:4', 'Jesus noticed Zacchaeus and transformed his life.'],
  ['What changed after Zacchaeus met Jesus?', ['He chose restitution and generosity','He bought a bigger tree','He became a fisherman','He built an ark'], 0, 'Luke 19:8', 'Real encounter with Jesus changes how we treat money and people.'],
  ['Who was the first king of Israel?', ['Saul','David','Solomon','Samuel'], 0, '1 Samuel 10:1', 'Saul began with opportunity, but leadership still required obedience.'],
  ['Who asked God for wisdom instead of riches?', ['Solomon','Samson','Saul','Simeon'], 0, '1 Kings 3:9–12', 'Solomon’s best request was for wisdom to serve well.'],
  ['Which is a high-value way to use your gift?', ['Serve people and glorify God','Hide it forever','Use it only for attention','Use it to embarrass others'], 0, '1 Peter 4:10', 'Gifts are given for service, not selfish display.'],
  ['According to 1 Peter 4:10, each person should use gifts to do what?', ['Serve others','Win every argument','Avoid responsibility','Become untouchable'], 0, '1 Peter 4:10', 'God gives varied gifts so we can bless one another.'],
  ['Which claim should immediately trigger Truth Detector mode?', ['“This sounds like a Bible verse, but I have no reference.”','“Matthew 5:14 says you are light.”','“Check the source.”','“Ask a trusted leader.”'], 0, 'Acts 17:11', 'No reference means verify before trusting or sharing.'],
  ['What is one safe response to cyberbullying?', ['Do not join; save evidence and tell a trusted adult','Forward it for laughs','Create a revenge account','Expose private information'], 0, 'Ephesians 4:29', 'Words should build up, not tear down. Safety and help matter.'],
  ['Which verse teaches words should build others up?', ['Ephesians 4:29','Genesis 1:1','John 11:35','Numbers 22:28'], 0, 'Ephesians 4:29', 'Online words count too; use them to give grace, not harm.'],
  ['What should teenagers remember about AI?', ['It is a tool, not a replacement for wisdom and character','It is always perfect','It is Scripture','It removes responsibility'], 0, 'Proverbs 4:7', 'AI can help, but wisdom, truth, prayer, and responsibility must lead.']
];

function rotateOptions(row, index) {
  // Keep some legacy B answers, but distribute correct answers across A-D.
  const target = index % 4;
  const options = [...row[1]];
  const [correct] = options.splice(row[2], 1);
  options.splice(target, 0, correct);
  return {
    game_key: 'light_rush',
    sequence: index + 1,
    question_text: row[0],
    question_type: 'multiple_choice',
    options,
    correct_option: target,
    explanation: row[4],
    bible_reference: row[3],
    source_label: 'Bible + Responsible Tech',
    time_limit_seconds: 30,
    difficulty: index % 5 === 0 ? 'hard' : index % 3 === 0 ? 'medium' : 'easy',
    is_active: true,
  };
}

const questions = refs.map(rotateOptions);

const { error: disableError } = await supabase
  .from('game_questions')
  .update({ is_active: false })
  .eq('game_key', 'light_rush');
if (disableError) throw disableError;

const { error: insertError } = await supabase.from('game_questions').insert(questions);
if (insertError) throw insertError;

const counts = questions.reduce((acc, q) => {
  acc[q.correct_option] = (acc[q.correct_option] || 0) + 1;
  return acc;
}, {});

console.log(JSON.stringify({ inserted: questions.length, correctOptionDistribution: counts }, null, 2));
