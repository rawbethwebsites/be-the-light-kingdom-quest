import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY');
}
const supabase = createClient(supabaseUrl, supabaseAnonKey, { auth: { persistSession: false } });

const rows = [
  ['Which verse says, “You are the light of the world”?', ['Matthew 5:14','John 8:12','Psalm 119:105','Isaiah 60:1'], 0, 'Matthew 5:14', 'Jesus gives His followers a public identity and responsibility: shine with visible faith and good works.'],
  ['In Matthew 5:15, where should a lamp be placed?', ['Under a basket','On a stand','Inside a jar','Beside the gate'], 1, 'Matthew 5:15', 'A lamp is placed where it gives light. Gifts and faith are meant to serve people, not stay hidden.'],
  ['According to Matthew 5:16, what should people glorify when they see good works?', ['Our talent','Our church brand','Our Father in heaven','Our confidence'], 2, 'Matthew 5:16', 'The goal of shining is not personal hype; it is pointing people to God.'],
  ['Jesus also calls His followers the salt of the earth. What does salt suggest?', ['Noise and attention','Preservation and flavour','Speed and popularity','Secrecy and silence'], 1, 'Matthew 5:13', 'Salt quietly makes a difference. Believers should preserve what is good and add kingdom influence.'],
  ['David’s confidence before Goliath came mostly from what?', ['Saul’s armour','Crowd support','His height','God’s past faithfulness'], 3, '1 Samuel 17:37', 'David remembered how God helped him before. Memory of God’s faithfulness fuels courage.'],
  ['What weapon did David actually use against Goliath?', ['A sling and stone','Saul’s sword','A bronze spear','A battle axe'], 0, '1 Samuel 17:49', 'David used what he had trained with. God can use simple tools in faithful hands.'],
  ['Why did David refuse Saul’s armour?', ['It was too expensive','He had not tested it','It belonged to Jonathan','It was already broken'], 1, '1 Samuel 17:38–39', 'David did not copy someone else’s style. He used what God had prepared him with.'],
  ['Daniel continued praying after the law changed because he valued what most?', ['Public approval','Political safety','Faithfulness to God','Winning arguments'], 2, 'Daniel 6:10', 'Daniel’s private devotion stayed strong under public pressure.'],
  ['How often did Daniel pray after the decree was issued?', ['Once a day','Twice a day','Three times a day','Only at night'], 2, 'Daniel 6:10', 'Daniel’s courage was built by consistent spiritual discipline.'],
  ['What did Daniel say God did in the lions’ den?', ['Sent rain','Shut the lions’ mouths','Opened the prison gate','Removed the king'], 1, 'Daniel 6:22', 'God protected Daniel and defended his innocence.'],
  ['Noah’s obedience is powerful because he built the ark when what was still true?', ['The flood had already ended','The king commanded him','The warning required faith','Everyone agreed with him'], 2, 'Genesis 6:13–22', 'Noah acted before the evidence looked obvious to everyone else.'],
  ['How many days and nights did rain fall during the flood?', ['Seven','Twenty-one','Thirty','Forty'], 3, 'Genesis 7:12', 'The flood story shows both judgment and God’s provision of rescue.'],
  ['What quality is Esther especially remembered for?', ['Physical strength','Courageous advocacy','Temple construction','Military strategy'], 1, 'Esther 4:14–16', 'Esther risked comfort and safety to plead for her people.'],
  ['“For such a time as this” means Esther’s position carried what?', ['Luck only','Responsibility and purpose','Permission to relax','Freedom from risk'], 1, 'Esther 4:14', 'Purpose often shows up as responsibility in a difficult moment.'],
  ['Joseph resisted temptation in Potiphar’s house because he saw sin primarily as what?', ['A bad career move','A private mistake only','A sin against God','A family tradition'], 2, 'Genesis 39:9', 'Integrity grows when we understand that hidden choices still matter before God.'],
  ['When Joseph interpreted dreams, who did he credit?', ['His education only','Egyptian magic','His brothers','God'], 3, 'Genesis 40:8', 'Joseph used his gift with humility and gave God the glory.'],
  ['In the Good Samaritan story, who acted as the true neighbour?', ['The priest','The Levite','The Samaritan','The innkeeper'], 2, 'Luke 10:33–37', 'Jesus defines neighbour-love by merciful action, not labels.'],
  ['The Good Samaritan teaches that compassion should cross what?', ['Social boundaries','River banks only','Temple walls only','Weather conditions'], 0, 'Luke 10:25–37', 'Kingdom love moves toward need, even when culture expects distance.'],
  ['Which list contains only fruit of the Spirit?', ['Love, joy, peace','Pride, envy, anger','Fear, shame, greed','Fame, control, comfort'], 0, 'Galatians 5:22–23', 'The Spirit forms character that makes a believer’s life bright and trustworthy.'],
  ['Which is NOT a fruit of the Spirit?', ['Gentleness','Self-control','Faithfulness','Jealous ambition'], 3, 'Galatians 5:22–23', 'Spiritual growth is not ego. It looks like love-shaped character.'],
  ['The Bereans were considered noble because they did what?', ['Accepted every speech immediately','Checked teaching against Scripture','Avoided all questions','Followed the loudest crowd'], 1, 'Acts 17:11', 'Discernment means testing even impressive claims by Scripture.'],
  ['What is the safest response when an online quote sounds biblical but has no reference?', ['Post it quickly','Check Scripture first','Call it a prophecy','Assume it is from Proverbs'], 1, 'Acts 17:11', 'Not everything spiritual-sounding is Scripture. Verify before sharing.'],
  ['Which statement best describes responsible AI use?', ['AI replaces wisdom','AI is always neutral and perfect','AI can help, but character must lead','AI should make every choice for us'], 2, 'Proverbs 4:7', 'Powerful tools need wise users. Wisdom and character must guide technology.'],
  ['Which AI use is honest for school?', ['Submitting generated work as yours','Asking for explanations and practice questions','Copying answers during tests','Hiding sources from teachers'], 1, 'Colossians 3:23', 'AI can support learning, but it should not replace personal effort and honesty.'],
  ['What should you protect when using online tools?', ['Private information','Rumours','Every trend','Anonymous insults'], 0, 'Proverbs 22:3', 'Wisdom sees risk ahead and takes protection seriously.'],
  ['If a message asks for your password to claim a prize, what is the wise move?', ['Verify and refuse to share private details','Send it before time runs out','Forward it to friends','Use a parent’s account instead'], 0, 'Proverbs 14:15', 'The prudent think carefully before trusting a claim.'],
  ['Peter walked on water when he responded to whose invitation?', ['John’s','The crowd’s','Jesus’','The boat owner’s'], 2, 'Matthew 14:29', 'Faith steps out because Jesus calls, not because the crowd cheers.'],
  ['When Peter started sinking, Jesus responded how?', ['Immediately reached out His hand','Waited until morning','Asked the disciples to vote','Sent him back alone'], 0, 'Matthew 14:30–31', 'Jesus corrected Peter’s doubt but also rescued him immediately.'],
  ['Timothy was told not to let anyone despise him because of what?', ['His youth','His accent','His job','His family size'], 0, '1 Timothy 4:12', 'Young people can set an example through godly character.'],
  ['According to 1 Timothy 4:12, young believers should set an example in what?', ['Speech, conduct, love, faith, purity','Fashion, followers, money, influence','Noise, speed, jokes, status','Debate, power, image, control'], 0, '1 Timothy 4:12', 'Teenagers can lead by the quality of their lives.'],
  ['What did the boy offer before Jesus fed the crowd?', ['Five loaves and two fish','Twelve baskets and wine','Seven loaves and honey','Three fish and wheat'], 0, 'John 6:9', 'A small surrendered gift can become significant in Jesus’ hands.'],
  ['What remained after Jesus fed the five thousand?', ['Nothing at all','Twelve baskets','One jar of oil','Seven stones'], 1, 'John 6:13', 'Jesus provided more than enough. The leftovers showed abundance.'],
  ['Ruth’s statement “Your people shall be my people” showed what?', ['Loyalty and faith','Political ambition','Fear of travel','A business plan'], 0, 'Ruth 1:16', 'Ruth chose covenant loyalty even when the future was uncertain.'],
  ['Nehemiah’s rebuilding project combined prayer with what?', ['Planning and teamwork','Ignoring opposition','Personal fame','Avoiding leadership'], 0, 'Nehemiah 2–4', 'Kingdom work often requires prayer, planning, courage, and collaboration.'],
  ['Before Nehemiah asked the king for help, he first did what?', ['Prayed and fasted','Built the gates','Called an army','Wrote a law'], 0, 'Nehemiah 1:4–11', 'Prayer was not a substitute for action; it prepared him for wise action.'],
  ['Isaiah responded to God’s call by saying what?', ['Here am I. Send me','I am too busy forever','Ask my brother first','Wait until I am older'], 0, 'Isaiah 6:8', 'A willing heart is central to God’s mission.'],
  ['Jonah’s story warns us about what?', ['Running from God’s assignment','Helping enemies too quickly','Praying too much','Studying too hard'], 0, 'Jonah 1–4', 'Jonah struggled with obedience and mercy, but God’s compassion was bigger.'],
  ['In Ephesians 6, the sword of the Spirit is what?', ['The word of God','The shield of faith','The belt of truth','The helmet of salvation'], 0, 'Ephesians 6:17', 'Scripture helps believers stand firm and discern truth.'],
  ['Which item in the armour of God is connected with faith?', ['Shield','Helmet','Breastplate','Belt'], 0, 'Ephesians 6:16', 'Faith helps believers resist spiritual attack and discouragement.'],
  ['James says anyone who lacks wisdom should do what?', ['Ask God','Pretend confidence','Copy the crowd','Wait for popularity'], 0, 'James 1:5', 'God invites us to ask for wisdom, not fake it.'],
  ['Faith without works is described by James as what?', ['Dead','Incomplete but fine','Popular','Hidden treasure'], 0, 'James 2:17', 'Real faith becomes visible through action.'],
  ['Jesus said the greatest commandment is to love whom first?', ['God','Yourself only','Your teacher','Your nation only'], 0, 'Matthew 22:37–38', 'Love for God is the foundation of a faithful life.'],
  ['The second great commandment is to love whom?', ['Your neighbour as yourself','Only your friends','Only your family','People who agree with you'], 0, 'Matthew 22:39', 'Love of neighbour makes faith practical and visible.'],
  ['In John 13, Jesus showed servant leadership by doing what?', ['Washing His disciples’ feet','Calling down fire','Collecting taxes','Building a throne'], 0, 'John 13:5', 'Jesus modelled leadership through humble service.'],
  ['Thomas is remembered after the resurrection because he first did what?', ['Doubted until he saw Jesus','Denied Jesus three times','Climbed a sycamore tree','Sold a field'], 0, 'John 20:24–29', 'Jesus met Thomas honestly and invited him to believe.'],
  ['Jesus said peacemakers will be called what?', ['Children of God','Kings of Israel','Sons of thunder','Teachers of the law'], 0, 'Matthew 5:9', 'Peacemakers reflect God’s character in conflict.'],
  ['Proverbs says the fear of the Lord is the beginning of what?', ['Knowledge','Wealth','Strength','Travel'], 0, 'Proverbs 1:7', 'True learning starts with reverence for God.'],
  ['Psalm 119:105 calls God’s word what?', ['A lamp and a light','A crown and robe','A shield and spear','A river and tree'], 0, 'Psalm 119:105', 'Scripture gives direction for daily steps and long-term choices.'],
  ['Joshua challenged Israel to choose whom they would what?', ['Serve','Fight','Tax','Crown'], 0, 'Joshua 24:15', 'Faith requires a clear allegiance, not vague intention.'],
  ['Mary responded to God’s message by calling herself what?', ['The Lord’s servant','The queen of Israel','The temple guard','The prophet’s sister'], 0, 'Luke 1:38', 'Mary’s faith showed humble surrender.'],
  ['Zacchaeus climbed a tree because he wanted to do what?', ['See Jesus','Hide from Rome','Preach in public','Collect fruit'], 0, 'Luke 19:4', 'His curiosity became a moment of transformation when Jesus noticed him.'],
  ['After meeting Jesus, Zacchaeus promised to make things right through what?', ['Generosity and restitution','More tax pressure','Religious debate','Moving city'], 0, 'Luke 19:8', 'True repentance changes behaviour, including how we treat money and people.'],
  ['Solomon asked God for what above riches?', ['Wisdom','Long life only','Military power','Fame'], 0, '1 Kings 3:9–12', 'Wisdom is a better foundation for leadership than status or wealth.'],
  ['1 Peter 4:10 says each person should use their gift to do what?', ['Serve others','Prove superiority','Avoid work','Gain control'], 0, '1 Peter 4:10', 'Gifts are entrusted for service, not selfish display.'],
  ['Ephesians 4:29 teaches our words should do what?', ['Build others up','Win every insult contest','Expose every rumour','Sound religious only'], 0, 'Ephesians 4:29', 'Online and offline words should give grace and strengthen people.'],
  ['What is a wise response to cyberbullying?', ['Do not join, save evidence, tell a trusted adult','Reply with worse insults','Create a fake account','Share it for laughs'], 0, 'Ephesians 4:29', 'Being light online means refusing harm and seeking safe help.'],
  ['Which phrase best captures discernment?', ['Test what you hear','Trust every viral post','Believe only confident voices','Ignore all correction'], 0, '1 Thessalonians 5:21', 'Discernment checks claims and holds on to what is good.'],
  ['What should happen before sharing a dramatic “fact” online?', ['Verify the source','Add emojis','Post before others do','Assume it is true'], 0, 'Proverbs 18:17', 'The first story can sound right until it is examined.'],
  ['Which habit helps teenagers use AI well?', ['Ask, learn, verify, then apply honestly','Copy, paste, hide, repeat','Outsource every thought','Share private data for better answers'], 0, 'Proverbs 18:15', 'Wise learners use tools to grow, not to escape thinking.'],
  ['Which option is closest to biblical wisdom about technology?', ['Use tools under truth and character','Let tools define truth','Use speed as morality','Choose popularity over honesty'], 0, 'Proverbs 4:23', 'The heart must be guarded because tools amplify what is inside.'],
  ['What does a “city on a hill” communicate?', ['Visible witness','Private fear','Hidden talent','Secret knowledge'], 0, 'Matthew 5:14', 'Jesus describes influence that cannot stay invisible.'],
  ['Which action best shines light in school?', ['Defending someone being mocked','Joining the mockery','Spreading unverified gist','Ignoring lonely students'], 0, 'Matthew 5:16', 'Light shows up through courage, kindness, truth, and service.'],
  ['What makes a Bible-style quote dangerous if it is not Scripture?', ['It can sound holy while being false','It is always harmless','It automatically becomes a verse','It needs no checking'], 0, 'Acts 17:11', 'Spiritual language can be convincing, so Scripture must be checked.'],
  ['Which is the stronger study prompt?', ['Explain the topic, quiz me, and show sources','Write my assignment so nobody knows','Give me only final answers','Make a shortcut to avoid studying'], 0, 'Proverbs 9:9', 'Strong prompts help you understand, practise, and verify.'],
  ['Which behaviour best protects privacy?', ['Keeping passwords and OTPs private','Sharing login details with friends','Posting school ID numbers','Using the same weak password everywhere'], 0, 'Proverbs 22:3', 'Caution is wisdom, not fear.'],
  ['What is one way to test an AI Bible claim?', ['Compare it with an actual Bible passage','Check if it sounds emotional','Count how many likes it gets','Ask it to insist harder'], 0, 'Acts 17:11', 'Verification requires a real source, not confidence or emotion.'],
  ['Which is a Kingdom Builder mindset?', ['Use gifts to solve real problems','Wait until adults do everything','Use talent only for applause','Avoid hard needs'], 0, '1 Peter 4:10', 'God-given gifts can serve school, church, home, and community.'],
  ['What should lead online influence?', ['Truth, love, and responsibility','Attention at any cost','Winning every argument','Being feared'], 0, 'Ephesians 4:15', 'Christian influence joins truth with love.'],
  ['What did Jesus say people do with a city set on a hill?', ['They cannot hide it','They rebuild it daily','They move it into a valley','They cover it with a basket'], 0, 'Matthew 5:14', 'Visible discipleship is part of the calling.'],
  ['Which is the best meaning of “Use AI to learn, not to copy”?', ['Let AI support understanding while you do honest work','Let AI replace your effort','Use AI only when cheating is easy','Avoid all technology forever'], 0, 'Colossians 3:23', 'Responsible technology use protects both learning and integrity.'],
  ['Which choice shows wisdom when a classmate sends harmful content?', ['Do not forward it; report or seek help','Forward it quietly','Save it for jokes later','Threaten them publicly'], 0, 'Ephesians 5:11', 'Light exposes harmful works without participating in them.'],
  ['Why should teens verify information before reposting?', ['Falsehood can harm people quickly','It makes posts slower only','Every post disappears instantly','Verification is only for adults'], 0, 'Proverbs 14:15', 'Fast sharing can spread harm; wise people check first.'],
  ['Which answer best links faith and creativity?', ['Create to serve people and glorify God','Create only for status','Hide creativity until perfect','Copy others without credit'], 0, 'Exodus 31:1–5', 'God gives creative skill that can be used for excellent service.'],
  ['Who received skill and wisdom for artistic work on the tabernacle?', ['Bezalel','Barabbas','Balaam','Belshazzar'], 0, 'Exodus 31:1–5', 'Creative skill can be spiritual service when used faithfully.'],
  ['Which person showed courage by speaking before Pharaoh?', ['Moses','Matthew','Malachi','Mordecai'], 0, 'Exodus 5:1', 'God can use reluctant people when they obey His call.'],
  ['Which person encouraged Esther to act for her people?', ['Mordecai','Melchizedek','Methuselah','Micah'], 0, 'Esther 4:13–14', 'Wise voices can help us recognise responsibility and timing.'],
  ['What should a light-bearer do when they make a mistake online?', ['Own it, correct it, and learn','Delete evidence and blame others','Double down for pride','Create a new rumour'], 0, 'Proverbs 28:13', 'Integrity includes confession, correction, and growth.'],
  ['Which statement is most true about spiritual influence?', ['Consistency matters more than performance','Only platforms matter','Only loud people lead','Private choices never count'], 0, 'Matthew 5:16', 'Light is not a stage trick; it is a consistent life that points to God.'],
];

function rotate(row, index) {
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

const questions = rows.map(rotate);

const { error: disableError } = await supabase
  .from('game_questions')
  .update({ is_active: false })
  .eq('game_key', 'light_rush');
if (disableError) throw disableError;

const { error: insertError } = await supabase.from('game_questions').insert(questions);
if (insertError) throw insertError;

const distribution = questions.reduce((acc, q) => {
  acc[String.fromCharCode(65 + q.correct_option)] = (acc[String.fromCharCode(65 + q.correct_option)] || 0) + 1;
  return acc;
}, {});
console.log(JSON.stringify({ inserted: questions.length, distribution }, null, 2));
