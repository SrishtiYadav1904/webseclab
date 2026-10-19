import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import type { LabProgress, Achievement, QuizAttempt, LabCategory } from '../types';
import { LABS, INITIAL_ACHIEVEMENTS } from '../data/labs';
import { useAuth } from './AuthContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface ProgressContextType {
  progressMap: Record<string, LabProgress>;
  achievements: Achievement[];
  quizAttempts: QuizAttempt[];
  totalPoints: number;
  completedLabsCount: number;
  totalLabsCount: number;
  overallPercentage: number;
  getLabProgress: (labId: string) => LabProgress;
  markLabStarted: (labId: string) => void;
  completeLab: (labId: string, score: number, maxScore: number) => void;
  recordHintUsed: (labId: string, hintId: number) => void;
  recordQuizResult: (category: LabCategory | 'Final Exam', score: number, totalQuestions: number) => void;
  resetAllProgress: () => void;
  categoryStats: Record<string, { completed: number; total: number; percentage: number }>;
}

const DEFAULT_DEMO_PROGRESS: Record<string, LabProgress> = {
  'lab-xss-01': {
    labId: 'lab-xss-01',
    status: 'completed',
    score: 100,
    maxScore: 100,
    completedAt: '2026-10-18T14:30:00Z',
    attemptsCount: 1,
    hintsUsed: [1]
  },
  'lab-sqli-02': {
    labId: 'lab-sqli-02',
    status: 'completed',
    score: 110,
    maxScore: 125,
    completedAt: '2026-10-19T09:15:00Z',
    attemptsCount: 2,
    hintsUsed: [1, 2]
  },
  'lab-csrf-03': {
    labId: 'lab-csrf-03',
    status: 'in_progress',
    score: 0,
    maxScore: 110,
    attemptsCount: 1,
    hintsUsed: []
  }
};

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isDemoMode } = useAuth();
  const userId = user?.id || 'guest';

  const [progressMap, setProgressMap] = useState<Record<string, LabProgress>>(() => {
    const saved = localStorage.getItem(`webseclab_progress_${userId}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_DEMO_PROGRESS;
      }
    }
    return DEFAULT_DEMO_PROGRESS;
  });

  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const saved = localStorage.getItem(`webseclab_achievements_${userId}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // default
      }
    }
    // Pre-unlock first blood & xss slayer for demo student
    return INITIAL_ACHIEVEMENTS.map(a => {
      if (a.id === 'first_blood' || a.id === 'xss_slayer') {
        return { ...a, unlockedAt: '2026-10-18T14:30:00Z' };
      }
      return a;
    });
  });

  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>(() => {
    const saved = localStorage.getItem(`webseclab_quiz_attempts_${userId}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [
      {
        id: 'quiz-init-1',
        userId,
        category: 'XSS',
        score: 3,
        totalQuestions: 3,
        percentage: 100,
        completedAt: '2026-10-18T14:45:00Z'
      }
    ];
  });

  // Reload progress when user changes
  useEffect(() => {
    const saved = localStorage.getItem(`webseclab_progress_${userId}`);
    if (saved) {
      try {
        setProgressMap(JSON.parse(saved));
      } catch {
        setProgressMap(DEFAULT_DEMO_PROGRESS);
      }
    } else {
      setProgressMap(DEFAULT_DEMO_PROGRESS);
    }
  }, [userId]);

  // Persist progress
  useEffect(() => {
    localStorage.setItem(`webseclab_progress_${userId}`, JSON.stringify(progressMap));
  }, [progressMap, userId]);

  useEffect(() => {
    localStorage.setItem(`webseclab_achievements_${userId}`, JSON.stringify(achievements));
  }, [achievements, userId]);

  useEffect(() => {
    localStorage.setItem(`webseclab_quiz_attempts_${userId}`, JSON.stringify(quizAttempts));
  }, [quizAttempts, userId]);

  // Sync to Supabase if configured & authenticated
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase || isDemoMode || !user) return;

    // Fetch progress from Supabase
    supabase
      .from('lab_progress')
      .select('*')
      .eq('user_id', user.id)
      .then(({ data, error }) => {
        if (!error && data && data.length > 0) {
          const loaded: Record<string, LabProgress> = {};
          data.forEach(item => {
            loaded[item.lab_id] = {
              labId: item.lab_id,
              status: item.status,
              score: item.score,
              maxScore: item.max_score,
              completedAt: item.completed_at,
              attemptsCount: item.attempts_count,
              hintsUsed: item.hints_used || []
            };
          });
          setProgressMap(prev => ({ ...prev, ...loaded }));
        }
      });
  }, [user, isDemoMode]);

  const getLabProgress = (labId: string): LabProgress => {
    return progressMap[labId] || {
      labId,
      status: 'not_started',
      score: 0,
      maxScore: LABS.find(l => l.id === labId)?.points || 100,
      attemptsCount: 0,
      hintsUsed: []
    };
  };

  const markLabStarted = (labId: string) => {
    setProgressMap(prev => {
      const current = prev[labId];
      if (current && current.status === 'completed') return prev;
      return {
        ...prev,
        [labId]: {
          labId,
          status: 'in_progress',
          score: current?.score || 0,
          maxScore: LABS.find(l => l.id === labId)?.points || 100,
          attemptsCount: (current?.attemptsCount || 0) + 1,
          hintsUsed: current?.hintsUsed || [],
          lastAttemptAt: new Date().toISOString()
        }
      };
    });
  };

  const triggerCelebration = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#06b6d4', '#3b82f6', '#8b5cf6', '#10b981']
    });
  };

  const unlockBadge = (badgeId: string) => {
    setAchievements(prev =>
      prev.map(b => {
        if (b.id === badgeId && !b.unlockedAt) {
          triggerCelebration();
          return { ...b, unlockedAt: new Date().toISOString() };
        }
        return b;
      })
    );
  };

  const completeLab = (labId: string, earnedScore: number, maxScore: number) => {
    const now = new Date().toISOString();
    setProgressMap(prev => {
      const existing = prev[labId];
      return {
        ...prev,
        [labId]: {
          labId,
          status: 'completed',
          score: Math.max(existing?.score || 0, earnedScore),
          maxScore,
          completedAt: existing?.completedAt || now,
          attemptsCount: (existing?.attemptsCount || 0) + 1,
          hintsUsed: existing?.hintsUsed || [],
          lastAttemptAt: now
        }
      };
    });

    triggerCelebration();

    // Check achievements
    unlockBadge('first_blood');

    if (labId === 'lab-xss-01') unlockBadge('xss_slayer');
    if (labId === 'lab-sqli-02') unlockBadge('sql_defender');
    if (labId === 'lab-auth-04') unlockBadge('session_sentinel');
    if (labId === 'lab-tools-08') unlockBadge('scanner_pro');

    // Check Pentester Elite (all 8 labs)
    setTimeout(() => {
      const updatedKeys = Object.keys(progressMap);
      const isAllComplete = LABS.every(l => l.id === labId || progressMap[l.id]?.status === 'completed');
      if (isAllComplete && updatedKeys.length >= 7) {
        unlockBadge('pentester_elite');
      }
    }, 200);

    // Sync to Supabase if configured
    if (isSupabaseConfigured && supabase && !isDemoMode && user) {
      supabase.from('lab_progress').upsert({
        user_id: user.id,
        lab_id: labId,
        status: 'completed',
        score: earnedScore,
        max_score: maxScore,
        completed_at: now
      });
    }
  };

  const recordHintUsed = (labId: string, hintId: number) => {
    setProgressMap(prev => {
      const current = prev[labId] || {
        labId,
        status: 'in_progress',
        score: 0,
        maxScore: LABS.find(l => l.id === labId)?.points || 100,
        attemptsCount: 1,
        hintsUsed: []
      };
      if (current.hintsUsed.includes(hintId)) return prev;
      return {
        ...prev,
        [labId]: {
          ...current,
          hintsUsed: [...current.hintsUsed, hintId]
        }
      };
    });
  };

  const recordQuizResult = (category: LabCategory | 'Final Exam', score: number, totalQuestions: number) => {
    const attempt: QuizAttempt = {
      id: 'quiz-' + Date.now(),
      userId,
      category,
      score,
      totalQuestions,
      percentage: Math.round((score / totalQuestions) * 100),
      completedAt: new Date().toISOString()
    };
    setQuizAttempts(prev => [attempt, ...prev]);
    if (attempt.percentage >= 80) {
      triggerCelebration();
    }
  };

  const resetAllProgress = () => {
    setProgressMap({});
    setAchievements(INITIAL_ACHIEVEMENTS);
    setQuizAttempts([]);
    localStorage.removeItem(`webseclab_progress_${userId}`);
    localStorage.removeItem(`webseclab_achievements_${userId}`);
    localStorage.removeItem(`webseclab_quiz_attempts_${userId}`);
  };

  // Aggregated Stats
  const completedLabsCount = Object.values(progressMap).filter(p => p.status === 'completed').length;
  const totalLabsCount = LABS.length;
  const overallPercentage = Math.round((completedLabsCount / totalLabsCount) * 100);

  const totalPoints = Object.values(progressMap).reduce((sum, p) => sum + (p.score || 0), 0) +
    achievements.filter(a => a.unlockedAt).reduce((sum, a) => sum + a.points, 0);

  const categoryStats: Record<string, { completed: number; total: number; percentage: number }> = {};
  LABS.forEach(lab => {
    if (!categoryStats[lab.category]) {
      categoryStats[lab.category] = { completed: 0, total: 0, percentage: 0 };
    }
    categoryStats[lab.category].total += 1;
    if (progressMap[lab.id]?.status === 'completed') {
      categoryStats[lab.category].completed += 1;
    }
  });

  Object.keys(categoryStats).forEach(cat => {
    const s = categoryStats[cat];
    s.percentage = Math.round((s.completed / s.total) * 100);
  });

  return (
    <ProgressContext.Provider
      value={{
        progressMap,
        achievements,
        quizAttempts,
        totalPoints,
        completedLabsCount,
        totalLabsCount,
        overallPercentage,
        getLabProgress,
        markLabStarted,
        completeLab,
        recordHintUsed,
        recordQuizResult,
        resetAllProgress,
        categoryStats
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};
