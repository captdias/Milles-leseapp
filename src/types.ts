export type TextCategory = 'fact' | 'fiction';

export type TopicKey = 
  | 'space' 
  | 'nature' 
  | 'body' 
  | 'history' 
  | 'tech' 
  | 'mystery' 
  | 'everyday' 
  | 'adventure' 
  | 'animals';

export type DifficultyLevel = 'easy' | 'medium' | 'challenge';

export interface GeneratedText {
  id: string;
  title: string;
  text: string;
  type: TextCategory;
  topic: TopicKey;
  difficulty: DifficultyLevel;
  targetWords: number;
  wordCount: number;
  isCustom?: boolean;
}

export interface SessionRecord {
  id: string;
  date: string;
  title: string;
  type: TextCategory;
  topic: TopicKey;
  target: number;
  r1: number;
  r2: number;
  points: number;
  diff: number;
  rating?: number;
}

export interface BadgeDef {
  id: string;
  icon: string;
  name: string;
  desc: string;
  category: 'innsats' | 'rutine' | 'variasjon' | 'mestring';
  test: (sessions: SessionRecord[]) => boolean;
}

export interface LevelInfo {
  name: string;
  title: string;
  min: number;
  max: number;
  color: string;
  badge: string;
}

export type ScreenId = 
  | 'home' 
  | 'setup' 
  | 'read' 
  | 'mark' 
  | 'model' 
  | 'pace' 
  | 'result' 
  | 'badges' 
  | 'stats';

export interface UserSettings {
  soundEnabled: boolean;
  rulerEnabled: boolean;
  fontSize: 'medium' | 'large' | 'xlarge';
  dyslexicFont: boolean;
  ttsSpeed: number;
  theme?: 'nordic' | 'sunshine' | 'evening';
}
