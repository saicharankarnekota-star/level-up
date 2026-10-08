export type AvatarCharacter =
  | 'astronaut'
  | 'robot'
  | 'owl'
  | 'fox'
  | 'cat'
  | 'dino'
  | 'wizard'
  | 'star';

export type AvatarExpression =
  | 'happy'
  | 'focused'
  | 'curious'
  | 'cool'
  | 'winking'
  | 'excited';

export type AvatarColorTheme =
  | 'gold'
  | 'cyan'
  | 'emerald'
  | 'purple'
  | 'coral'
  | 'navy';

export type AvatarAccessory =
  | 'none'
  | 'helmet'
  | 'gradcap'
  | 'wizardhat'
  | 'headphones'
  | 'crown'
  | 'goggles';

export type AvatarAura =
  | 'orbit'
  | 'flame'
  | 'circuits'
  | 'leaf'
  | 'rainbow'
  | 'none';

export interface AvatarConfig {
  character: AvatarCharacter;
  expression: AvatarExpression;
  colorTheme: AvatarColorTheme;
  accessory: AvatarAccessory;
  aura: AvatarAura;
}

export interface Profile {
  name: string;
  age: number;
  grade: string;
  avatar: string; // legacy single letter fallback
  avatarConfig: AvatarConfig;
  interests: string[];
  xp: number;
  level: number;
  streak: number; // day to day strike
  streakShields: number;
  lastActiveDate: string;
  claimedStreakDates: string[]; // YYYY-MM-DD
}

export interface Activity {
  lessonsCompleted: number;
  missionsCompleted: number;
  questionsAnswered: number;
  gamesPlayed: number;
  creationsCount: number;
  dailyGoal: number;
  lifelinesUsed: number;
  mistakesReviewed: number;
}

export interface Creation {
  id: string;
  title: string;
  type: string;
  topic: string;
  subject: string;
  content: string;
  createdAt: string;
}

export interface LifelineInventory {
  fiftyFifty: number;
  aiClue: number;
  realLife: number;
  secondChance: number;
}

export interface QuestionMisconception {
  studentAnswer: string;
  misconception: string;
  whyWrong: string;
  keyRule: string;
}

export interface PracticeQuestion {
  id: string;
  subject: 'Math' | 'Science' | 'Nature' | 'Engineering';
  topic: string;
  gradeLevel: string;
  q: string;
  choices: string[];
  answer: string;
  why: string;
  misconceptions: Record<string, QuestionMisconception>; // key is choice string
  realLifeExample: {
    headline: string;
    scenario: string;
    takeaway: string;
  };
  clueHint: string;
}

export interface SubjectLesson {
  id: string;
  title: string;
  topic: string;
  subject: 'Math' | 'Science' | 'Nature' | 'Engineering';
  age: string;
  length: string;
  description: string;
  palette: string;
  glyph: string;
  tags: string[];
  bigIdea: string;
  inRealLife: {
    title: string;
    story: string;
    didYouKnow: string;
  };
  checkQuestion: {
    prompt: string;
    choices: string[];
    correct: string;
    explanation: string;
  };
}

export interface MissionChallenge {
  prompt: string;
  options: string[];
  correct: string;
  teach: string;
  realLifeScenario: string;
  misconceptionAlert: string;
}

export interface MissionData {
  id: string;
  title: string;
  subject: 'Math' | 'Science';
  theme: string;
  description: string;
  tags: string[];
  estimatedTime: string;
  badgeReward: string;
  xpReward: number;
  challenges: MissionChallenge[];
}

export interface AppData {
  profile: Profile;
  activity: Activity;
  mission: {
    completed: boolean;
    currentStep: number;
    activeMissionId?: string;
  };
  completedMissions: string[];
  creations: Creation[];
  badges: string[];
  games: Record<string, number>;
  lifelines: LifelineInventory;
}
