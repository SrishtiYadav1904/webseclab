import React, { createContext, useContext, useState, useEffect } from 'react';
import type { UserProfile } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isDemoMode: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  register: (email: string, password: string, fullName: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  loginDemoStudent: () => void;
  loginDemoInstructor: () => void;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

const DEMO_STUDENT: UserProfile = {
  id: 'demo-student-uuid',
  email: 'student@webseclab.internal',
  fullName: 'Alex Vance',
  role: 'student',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
  createdAt: '2026-09-01T08:00:00Z',
  totalPoints: 210,
  rank: 'Security Apprentice'
};

const DEMO_INSTRUCTOR: UserProfile = {
  id: 'demo-instructor-uuid',
  email: 'instructor@webseclab.internal',
  fullName: 'Dr. Evelyn Reed (CISSP)',
  role: 'instructor',
  avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
  createdAt: '2026-01-15T08:00:00Z',
  totalPoints: 1250,
  rank: 'Lead AppSec Instructor'
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('webseclab_active_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return DEMO_STUDENT;
  });

  const [isDemoMode, setIsDemoMode] = useState<boolean>(() => {
    const savedDemo = localStorage.getItem('webseclab_is_demo');
    return savedDemo !== null ? savedDemo === 'true' : !isSupabaseConfigured;
  });

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('webseclab_active_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('webseclab_active_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('webseclab_is_demo', String(isDemoMode));
  }, [isDemoMode]);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase || isDemoMode) return;
    const client = supabase;

    setLoading(true);
    client.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        client
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data, error }) => {
            if (!error && data) {
              setUser({
                id: data.id,
                email: session.user.email || '',
                fullName: data.full_name || 'AppSec Learner',
                role: data.role || 'student',
                avatarUrl: data.avatar_url,
                createdAt: data.created_at,
                totalPoints: data.total_points || 0,
                rank: data.rank || 'Security Cadet'
              });
            }
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = client.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const { data } = await client
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (data) {
          setUser({
            id: data.id,
            email: session.user.email || '',
            fullName: data.full_name || 'AppSec Learner',
            role: data.role || 'student',
            avatarUrl: data.avatar_url,
            createdAt: data.created_at,
            totalPoints: data.total_points || 0,
            rank: data.rank || 'Security Cadet'
          });
        }
      } else if (!isDemoMode) {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [isDemoMode]);

  const login = async (email: string, password: string): Promise<{ error?: string }> => {
    setLoading(true);
    if (!isSupabaseConfigured || !supabase) {
      setIsDemoMode(true);
      const studentUser: UserProfile = {
        ...DEMO_STUDENT,
        email,
        fullName: email.split('@')[0] || 'AppSec Student'
      };
      setUser(studentUser);
      setLoading(false);
      return {};
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setLoading(false);
        return { error: error.message };
      }
      if (data.user) {
        setIsDemoMode(false);
      }
      setLoading(false);
      return {};
    } catch (err: unknown) {
      setLoading(false);
      return { error: err instanceof Error ? err.message : 'Login failed' };
    }
  };

  const register = async (email: string, password: string, fullName: string): Promise<{ error?: string }> => {
    setLoading(true);
    if (!isSupabaseConfigured || !supabase) {
      setIsDemoMode(true);
      const newUser: UserProfile = {
        id: 'demo-user-' + Date.now(),
        email,
        fullName,
        role: 'student',
        createdAt: new Date().toISOString(),
        totalPoints: 0,
        rank: 'Security Cadet'
      };
      setUser(newUser);
      setLoading(false);
      return {};
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName }
        }
      });
      if (error) {
        setLoading(false);
        return { error: error.message };
      }
      if (data.user) {
        setIsDemoMode(false);
      }
      setLoading(false);
      return {};
    } catch (err: unknown) {
      setLoading(false);
      return { error: err instanceof Error ? err.message : 'Registration failed' };
    }
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase && !isDemoMode) {
      await supabase.auth.signOut();
    }
    setUser(null);
    localStorage.removeItem('webseclab_active_user');
  };

  const loginDemoStudent = () => {
    setIsDemoMode(true);
    setUser(DEMO_STUDENT);
  };

  const loginDemoInstructor = () => {
    setIsDemoMode(true);
    setUser(DEMO_INSTRUCTOR);
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);

    if (isSupabaseConfigured && supabase && !isDemoMode) {
      await supabase.from('profiles').update({
        full_name: updated.fullName,
        avatar_url: updated.avatarUrl
      }).eq('id', user.id);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isDemoMode,
        login,
        register,
        logout,
        loginDemoStudent,
        loginDemoInstructor,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
