export interface User {
  id: number;
  name: string;
  email: string;
  role: 'ADMIN' | 'USER';
  avatar?: string;
  xp: number;
  level: number;
  streak: number;
  createdAt: string;
  quizzesCompleted?: any[];
  userAchievements?: any[];
  xpHistory?: any[];
}

export interface Subject {
  id: number;
  name: string;
}

export interface Question {
  id: number;
  quizId: number;
  text: string;
  imageUrl?: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: string;
  explanation?: string;
  xpReward: number;
}

export interface Quiz {
  id: number;
  title: string;
  description?: string;
  imageUrl?: string;
  subjectId: number;
  subject: Subject;
  published: boolean;
  createdAt: string;
  questions: Question[];
  completions: any[];
}

export interface Achievement {
  id: number;
  name: string;
  description: string;
  icon: string;
  type: string;
  requirement: number;
}

export interface UserAchievement {
  id: number;
  userId: number;
  achievementId: number;
  achievement: Achievement;
  unlockedAt: string;
}

export interface XpHistory {
  id: number;
  userId: number;
  amount: number;
  reason: string;
  earnedAt: string;
}
