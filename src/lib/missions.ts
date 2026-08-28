// Mission templates for Kingdom Builders game

export interface MissionTemplate {
  key: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

export const MISSION_TEMPLATES: MissionTemplate[] = [
  {
    key: 'study_smart',
    title: 'Study Smart Mission',
    description: 'Help teenagers who struggle with distraction and exam preparation.',
    icon: 'book-open',
    color: 'tbn-gold',
  },
  {
    key: 'kindness_online',
    title: 'Kindness Online Mission',
    description: 'Create an anti-cyberbullying campaign that encourages positive behaviour online.',
    icon: 'heart',
    color: 'tbn-mint',
  },
  {
    key: 'church_impact',
    title: 'Church Impact Mission',
    description: 'Create a content idea or digital campaign that encourages teenagers and helps them engage with church.',
    icon: 'church',
    color: 'tbn-amber',
  },
  {
    key: 'purpose_discovery',
    title: 'Purpose Mission',
    description: 'Create a simple way for young people to identify their gifts, career interests, and useful skills.',
    icon: 'compass',
    color: 'tbn-orange',
  },
  {
    key: 'community_solution',
    title: 'Community Mission',
    description: 'Create a low-cost solution for a problem in the school, church, or neighbourhood.',
    icon: 'users',
    color: 'tbn-cream',
  },
  {
    key: 'digital_safety',
    title: 'Digital Safety Mission',
    description: 'Create an awareness campaign about scams, fake news, unsafe links, privacy, and responsible social-media use.',
    icon: 'shield',
    color: 'tbn-gold',
  },
];

export function getMissionTemplate(key: string): MissionTemplate | undefined {
  return MISSION_TEMPLATES.find(m => m.key === key);
}

// Example AI prompts for each mission
export const EXAMPLE_AI_PROMPTS: Record<string, string> = {
  study_smart:
    'Act as a study coach for Nigerian secondary-school students. Create a realistic seven-day revision plan for mathematics and English. Include short study sessions, breaks, past questions, sleep, prayer, and phone limits. Present it as a simple table.',
  kindness_online:
    'Generate 10 positive social media post ideas that encourage kindness online and discourage cyberbullying. Make them relatable for teenagers aged 13-19.',
  church_impact:
    'Suggest 5 creative digital content ideas (TikTok, Instagram, YouTube) that would help teenagers feel more connected to church and excited about faith.',
  purpose_discovery:
    'Create a simple 10-question self-assessment that helps teenagers discover their natural gifts, interests, and potential career paths based on what they enjoy doing.',
  community_solution:
    'Brainstorm 3 low-cost solutions for [specific problem in school/church/neighborhood]. Consider using technology, volunteer efforts, or simple process improvements.',
  digital_safety:
    'Create a checklist of 10 safety rules for teenagers using social media, covering scams, fake news, privacy settings, and how to verify information before sharing.',
};
