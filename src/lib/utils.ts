import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Blocked words filter for nicknames
const BLOCKED_WORDS = [
  // Add inappropriate words here
  'stupid',
  'dumb',
  'hate',
  'kill',
  'die',
];

export function validateNickname(nickname: string): { valid: boolean; error?: string } {
  if (!nickname || nickname.trim().length === 0) {
    return { valid: false, error: 'Please enter a nickname' };
  }

  if (nickname.length < 2) {
    return { valid: false, error: 'Nickname must be at least 2 characters' };
  }

  if (nickname.length > 30) {
    return { valid: false, error: 'Nickname must be 30 characters or less' };
  }

  // Check for blocked words
  const lowerNickname = nickname.toLowerCase();
  for (const word of BLOCKED_WORDS) {
    if (lowerNickname.includes(word)) {
      return { valid: false, error: 'Please choose a respectful nickname' };
    }
  }

  // Allow letters, numbers, spaces, and basic punctuation
  const validPattern = /^[a-zA-Z0-9\s\-_.'!]+$/;
  if (!validPattern.test(nickname)) {
    return { valid: false, error: 'Nickname can only contain letters, numbers, and basic punctuation' };
  }

  return { valid: true };
}

// Generate team colors
export const TEAM_COLORS = [
  { name: 'gold', value: 'tbn-gold', hex: '#FBB931' },
  { name: 'amber', value: 'tbn-amber', hex: '#F88F22' },
  { name: 'orange', value: 'tbn-orange', hex: '#EA6113' },
  { name: 'mint', value: 'tbn-mint', hex: '#99E5C0' },
  { name: 'cream', value: 'tbn-cream', hex: '#F2F2E7' },
];

export const TEAM_ICONS = [
  { name: 'light', icon: 'zap' },
  { name: 'flame', icon: 'flame' },
  { name: 'star', icon: 'star' },
  { name: 'shield', icon: 'shield' },
  { name: 'crown', icon: 'crown' },
  { name: 'heart', icon: 'heart' },
];

// Format time for display
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins > 0) {
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
  return secs.toString();
}

// Calculate score for Light Rush
export function calculateLightRushScore(
  isCorrect: boolean,
  responseTimeMs: number,
  timeLimitSeconds: number,
  currentStreak: number
): { points: number; newStreak: number; bonus: string | null } {
  if (!isCorrect) {
    return { points: 0, newStreak: 0, bonus: null };
  }

  let points = 100; // Base points
  let bonus: string | null = null;

  // Speed bonus (up to 50 points)
  const timeLimitMs = timeLimitSeconds * 1000;
  const speedRatio = Math.max(0, (timeLimitMs - responseTimeMs) / timeLimitMs);
  const speedBonus = Math.round(50 * speedRatio);
  points += speedBonus;

  // Light Streak bonus
  const newStreak = currentStreak + 1;
  if (newStreak >= 3) {
    points += 100;
    bonus = 'Light Streak! +100';
  }

  return { points, newStreak, bonus };
}

// Calculate score for Truth Detector
export function calculateTruthDetectorScore(
  isCorrect: boolean,
  hasBonusReference: boolean,
  currentStreak: number
): { points: number; newStreak: number; bonus: string | null } {
  if (!isCorrect) {
    return { points: 0, newStreak: 0, bonus: null };
  }

  let points = 100; // Base points
  let bonus: string | null = null;

  // Bonus reference points
  if (hasBonusReference) {
    points += 50;
  }

  // Truth Shield bonus
  const newStreak = currentStreak + 1;
  if (newStreak >= 2 && !hasBonusReference) {
    points += 75;
    bonus = 'Truth Shield! +75';
  }

  return { points, newStreak, bonus };
}


// Calculate score for Lights Out: Rescue the City
export function calculateLightsOutScore(
  isBestLightMove: boolean,
  responseTimeMs: number,
  timeLimitSeconds: number,
  currentStreak: number
): { points: number; newStreak: number; bonus: string | null } {
  if (!isBestLightMove) {
    return { points: 0, newStreak: 0, bonus: null };
  }

  let points = 150; // Best Light Move base points
  let bonus: string | null = null;
  const timeLimitMs = timeLimitSeconds * 1000;
  const speedRatio = Math.max(0, (timeLimitMs - responseTimeMs) / timeLimitMs);
  points += Math.round(50 * speedRatio);

  const newStreak = currentStreak + 1;
  if (newStreak >= 3) {
    points += 100;
    bonus = 'City Light Streak! +100';
  }

  return { points, newStreak, bonus };
}

// Mission scoring rubric
export function calculateMissionScore(
  problemRelevant: boolean,
  solutionUseful: boolean,
  promptStrong: boolean,
  themeConnection: boolean,
  responsibleUse: boolean,
  voteCount: number,
  hostBonus: number = 0
): number {
  let score = 0;
  if (problemRelevant) score += 10;
  if (solutionUseful) score += 10;
  if (promptStrong) score += 10;
  if (themeConnection) score += 10;
  if (responsibleUse) score += 10;
  
  // Vote points (max 10)
  score += Math.min(10, voteCount);
  
  // Host bonus
  score += Math.min(10, Math.max(0, hostBonus));
  
  return score;
}

// Generate room code display format
export function formatRoomCode(code: string): string {
  return code.toUpperCase();
}

// Check if connection is slow
export function isSlowConnection(): boolean {
  if (typeof navigator !== 'undefined' && 'connection' in navigator) {
    const conn = (navigator as any).connection;
    if (conn) {
      return conn.effectiveType === '2g' || conn.effectiveType === 'slow-2g';
    }
  }
  return false;
}
