export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export type LabCategory = 
  | 'XSS'
  | 'SQL Injection'
  | 'CSRF'
  | 'Authentication'
  | 'Access Control'
  | 'File Security'
  | 'Security Headers'
  | 'Security Tools';

export interface CodeComparison {
  vulnerableCode: string;
  secureCode: string;
  explanation: string;
}

export interface LabHint {
  id: number;
  text: string;
  costPoints?: number;
}

export interface LabExerciseStep {
  id: string;
  title: string;
  description: string;
  instructions: string[];
}

export interface Lab {
  id: string;
  slug: string;
  title: string;
  category: LabCategory;
  difficulty: Difficulty;
  estimatedMinutes: number;
  points: number;
  summary: string;
  description: string;
  learningObjectives: string[];
  prerequisites?: string[];
  theory: {
    overview: string;
    impact: string;
    attackVector: string;
    prevention: string;
  };
  codeComparison: CodeComparison;
  hints: LabHint[];
  remediationGuidance: string[];
  externalReferences: { title: string; url: string }[];
}

export interface LabProgress {
  labId: string;
  status: 'not_started' | 'in_progress' | 'completed';
  score: number;
  maxScore: number;
  completedAt?: string;
  attemptsCount: number;
  lastAttemptAt?: string;
  hintsUsed: number[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'completion' | 'mastery' | 'streak' | 'special';
  points: number;
  unlockedAt?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: 'student' | 'instructor' | 'admin';
  avatarUrl?: string;
  createdAt: string;
  totalPoints: number;
  rank: string;
}

export interface QuizQuestion {
  id: string;
  labCategory: LabCategory;
  question: string;
  type: 'multiple_choice' | 'true_false' | 'code_identify';
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  codeSnippet?: string;
}

export interface QuizAttempt {
  id: string;
  userId: string;
  category: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  completedAt: string;
}
