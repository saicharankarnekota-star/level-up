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

// ---------- Learning content ----------

export type Grade = 1 | 2 | 8;
export type Subject = 'Math' | 'Science';

export type VisualizerKey =
  | 'tenFrame'
  | 'numberLine'
  | 'compare'
  | 'baseTen'
  | 'array'
  | 'shapes'
  | 'measure'
  | 'pattern'
  | 'clock'
  | 'coins'
  | 'fraction'
  | 'pictograph'
  | 'sortBins'
  | 'plantParts'
  | 'senses'
  | 'weather'
  | 'dayNight'
  | 'lifeCycle'
  | 'phetSim';

export type VisualizerParams = Record<string, unknown>;

export interface Question {
  id: string;
  topicId: string;
  prompt: string;
  /** Optional emoji picture shown above the choices. */
  picture?: string;
  choices: string[];
  answer: string;
  hint: string;
  why: string;
  /** Explanation keyed by a wrong choice. */
  misconceptions?: Record<string, string>;
  /** Visualizer params that re-create this question on screen ("Show me"). */
  show?: VisualizerParams;
}

export interface LearnCard {
  emoji: string;
  title: string;
  text: string;
}

export interface Topic {
  id: string;
  grade: Grade;
  subject: Subject;
  title: string;
  emoji: string;
  blurb: string;
  visualizer: VisualizerKey;
  visualizerParams?: VisualizerParams;
  /** What the child should try in the visualizer. */
  exploreGoal: string;
  /** Story-style narrator script read at the start of the topic. */
  narration?: string;
  learnCards: LearnCard[];
  realLife: string;
  generate: () => Question;
}

export interface MissionStep {
  narration: string;
  question: Question;
}

export interface Mission {
  id: string;
  grade: Grade;
  subject: Subject;
  title: string;
  emoji: string;
  intro: string;
  outro: string;
  xpReward: number;
  steps: MissionStep[];
}

// ---------- Saved progress ----------

export interface TopicProgress {
  visualized: boolean;
  learned: boolean;
  stars: number; // best 0-3
  rounds: number;
}

export interface DayLog {
  activities: number;
  xp: number;
  cappedXp: number;
  goalMet: boolean;
}

export interface Lifelines {
  fiftyFifty: number;
  hint: number;
  shield: number;
  refilledOn: string;
}

export interface Note {
  id: string;
  title: string;
  text: string;
  topicId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileStats {
  questionsAnswered: number;
  correctAnswers: number;
  gamesPlayed: number;
  mistakesReviewed: number;
}

export interface ProfileData {
  id: string;
  name: string;
  grade: Grade;
  avatarConfig: AvatarConfig;
  createdAt: string;
  xp: number;
  streak: number;
  bestStreak: number;
  shields: number;
  lastActiveDate: string | null;
  activeDates: string[];
  goalDays: number;
  topics: Record<string, TopicProgress>;
  awarded: Record<string, true>;
  badges: Record<string, string>;
  daily: Record<string, DayLog>;
  lifelines: Lifelines;
  stats: ProfileStats;
  gameBest: Record<string, number>;
  adventureCompleted: number[];
  missionsCompleted: string[];
  notes: Note[];
}

export interface SavedState {
  version: 2;
  activeId: string | null;
  profiles: Record<string, ProfileData>;
}
