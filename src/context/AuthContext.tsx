'use client';

import React, { createContext, useCallback, useContext, useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { isSupabaseConfigured } from '@/utils/supabase/env';
import { skipIntroOnNextLanding } from '@/lib/intro-entry';

export interface PersonalInfo {
  name: string;
  email?: string;
  title: string;
  location: string;
  isOpenToWork: boolean;
  avatar: string;
}

export interface Project {
  name: string;
  description: string;
  tags: string[];
  githubUrl: string;
  liveUrl: string;
  category: string;
  outcome?: string; // used for blueprint outcome
}

export interface Experience {
  company: string;
  role: string;
  startDate: string;
  endDate: string; // or 'Present'
  achievements: string[];
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  gradYear: string;
  gpa: string;
}

export interface SocialLinks {
  github: string;
  linkedin: string;
  twitter: string;
  blog: string;
  leetcode: string;
}

export interface ThemeSettings {
  templateName: 'obsidian' | 'blueprint' | 'neon' | 'minimal' | '';
  accentColor: string; // Preset hex
  fontPairing: string; // Preset name
}

export interface StudentNotification {
  id: string;
  title: string;
  description: string;
  time: string;
  unread: boolean;
}

export interface StudentProfile {
  username: string; // for username.portfolioai.dev
  provider: 'google' | 'github' | 'linkedin' | 'email';
  status: 'Published' | 'Draft' | 'Unpublished';
  lastUpdated: string;
  sectionViews: number;
  aiCreditsUsed: number;
  personalInfo: PersonalInfo;
  bio: string;
  skills: string[];
  projects: Project[];
  experience: Experience[];
  education: Education[];
  socialLinks: SocialLinks;
  themeSettings: ThemeSettings;
  notifications: StudentNotification[];
  resumeData?: Record<string, unknown>;
}

interface AuthContextType {
  user: StudentProfile | null;
  isLoading: boolean;
  login: (provider: 'google' | 'github' | 'linkedin' | 'email', email?: string, name?: string) => Promise<void>;
  signInWithPassword: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
  updateProfile: (newProfile: StudentProfile) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
}

const generateEmptyProfile = (provider: StudentProfile['provider'], email?: string, name?: string, avatar?: string): StudentProfile => {
  const emailVal = email || 'student@university.edu';
  const nameVal = name || emailVal.split('@')[0].split('.').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const usernameVal = emailVal.split('@')[0].replace(/[^a-zA-Z0-9]/g, '-');
  
  return {
    username: usernameVal,
    provider: provider,
    status: 'Unpublished',
    lastUpdated: 'Never',
    sectionViews: 0,
    aiCreditsUsed: 0,
    bio: '',
    skills: [],
    projects: [],
    experience: [],
    education: [],
    socialLinks: {
      github: '',
      linkedin: '',
      twitter: '',
      blog: '',
      leetcode: ''
    },
    themeSettings: {
      templateName: '',
      accentColor: '#7C3AED',
      fontPairing: 'Inter + JetBrains Mono'
    },
    notifications: [
      { id: 'n1', title: 'Welcome', description: 'Welcome to your PortfolioAI student dashboard! Get started by editing details.', time: 'Just now', unread: true }
    ],
    personalInfo: {
      name: nameVal,
      email: emailVal,
      title: '',
      location: '',
      isOpenToWork: true,
      avatar: avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=fallback'
    }
  };
};

const safeParseProfile = (raw: string): StudentProfile | null => {
  try {
    const parsed = JSON.parse(raw) as StudentProfile;
    if (parsed.personalInfo && parsed.themeSettings && parsed.skills) {
      return parsed;
    }
  } catch {}
  return null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<StudentProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load user from Supabase and LocalStorage
  useEffect(() => {
    if (!isSupabaseConfigured()) {
      const storedUser = localStorage.getItem('student_user');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser) as StudentProfile;
          if (parsedUser.personalInfo && parsedUser.themeSettings && parsedUser.skills) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setUser(parsedUser);
            document.cookie = 'student_auth=true; path=/; SameSite=Lax';
          }
        } catch {}
      }
      setIsLoading(false);
      return;
    }

    const supabase = createClient();
    
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        // If we have a supabase user, check if we have a mocked local profile
        const storedUser = localStorage.getItem('student_user');
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser) as StudentProfile;
            if (parsedUser.personalInfo && parsedUser.themeSettings && parsedUser.skills) {
              // ALWAYS sync with the real Supabase session data to prevent outdated mock data from showing
              const metadata = session.user.user_metadata;
              const name = metadata?.full_name || metadata?.name || session.user.email?.split('@')[0] || parsedUser.personalInfo.name;
              const avatar = metadata?.avatar_url || parsedUser.personalInfo.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=fallback";
              
              parsedUser.personalInfo.name = name;
              parsedUser.personalInfo.email = session.user.email;
              parsedUser.personalInfo.avatar = avatar;
              parsedUser.provider = (session.user.app_metadata.provider as StudentProfile['provider']) || parsedUser.provider;
              
              setUser(parsedUser);
              localStorage.setItem('student_user', JSON.stringify(parsedUser)); // Update local storage with real data
              document.cookie = 'student_auth=true; path=/; SameSite=Lax';
            }
          } catch {}
        } else {
          // Fallback if no local profile but auth exists
          const metadata = session.user.user_metadata;
          const provider = session.user.app_metadata.provider || 'email';
          const name = metadata?.full_name || metadata?.name || session.user.email?.split('@')[0] || 'User';
          const avatar = metadata?.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=fallback";
          
          const newProfile = generateEmptyProfile(provider as StudentProfile['provider'], session.user.email, name, avatar);
          setUser(newProfile);
          document.cookie = 'student_auth=true; path=/; SameSite=Lax';
        }
      } else {
        setUser(null);
        localStorage.removeItem('student_user');
        document.cookie = 'student_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      }
      setIsLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setUser(null);
        localStorage.removeItem('student_user');
        document.cookie = 'student_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      } else {
        document.cookie = 'student_auth=true; path=/; SameSite=Lax';
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (
    provider: 'google' | 'github' | 'linkedin' | 'email',
    email?: string,
    name?: string
  ): Promise<void> => {
    setIsLoading(true);

    if (provider !== 'email' && isSupabaseConfigured()) {
      const supabase = createClient();

      // The provider navigates away from this page, so park the intro skip now.
      // Without it the post-login landing visit would replay the preloader.
      skipIntroOnNextLanding();

      // Trigger OAuth Login
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) {
        console.error('Error logging in:', error.message);
        setIsLoading(false);
        return;
      }

      // A successful OAuth call hands the browser to the provider. Returning a
      // local profile here would flash a mock user before that navigation, so
      // stop and let /auth/callback establish the real session.
      return;
    } else if (provider !== 'email') {
      console.warn('Supabase is not configured. Using local profile instead of OAuth.');
    }

    const finalProfile = generateEmptyProfile(provider, email, name);

    setUser(finalProfile);
    localStorage.setItem('student_user', JSON.stringify(finalProfile));
    document.cookie = 'student_auth=true; path=/; SameSite=Lax';
    
    // Clear temporary resume data from sessionStorage on login to isolate users
    if (typeof window !== 'undefined') {
      try {
        const keysToRemove: string[] = [];
        for (let i = 0; i < sessionStorage.length; i++) {
          const key = sessionStorage.key(i);
          if (key && key.startsWith('temp_resume_upload_')) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach(key => sessionStorage.removeItem(key));
      } catch (e) {
        console.error('Failed to clear temporary resume data', e);
      }
    }
    
    setIsLoading(false);
  };

  // Reads the authenticated account back into the student profile the app renders
  const applySupabaseSession = useCallback(
    (sessionUser: {
      email?: string | null;
      user_metadata?: Record<string, unknown>;
      app_metadata?: Record<string, unknown>;
    }): StudentProfile => {
      const metadata = sessionUser.user_metadata;
      const name =
        (metadata?.full_name as string) ||
        (metadata?.name as string) ||
        sessionUser.email?.split('@')[0] ||
        'User';
      const avatar =
        (metadata?.avatar_url as string) ||
        (metadata?.picture as string) ||
        'https://api.dicebear.com/7.x/avataaars/svg?seed=fallback';
      const provider = (sessionUser.app_metadata?.provider as StudentProfile['provider']) || 'email';

      const storedUser = localStorage.getItem('student_user');
      const profile = storedUser ? safeParseProfile(storedUser) : null;

      if (!profile) {
        const created = generateEmptyProfile(provider, sessionUser.email || undefined, name, avatar);
        localStorage.setItem('student_user', JSON.stringify(created));
        return created;
      }

      profile.personalInfo.name = name;
      profile.personalInfo.email = sessionUser.email || profile.personalInfo.email;
      profile.personalInfo.avatar = avatar;
      profile.provider = provider;
      localStorage.setItem('student_user', JSON.stringify(profile));
      return profile;
    },
    []
  );

  const signInWithPassword = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);

    if (isSupabaseConfigured()) {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error || !data.user) {
        setIsLoading(false);
        throw error ?? new Error('Invalid login credentials.');
      }

      const profile = applySupabaseSession(data.user);
      setUser(profile);
      document.cookie = 'student_auth=true; path=/; SameSite=Lax';
      setIsLoading(false);
      return;
    }

    // No backend configured: the demo app trusts the local profile instead of a password
    const storedUser = localStorage.getItem('student_user');
    const profile = storedUser ? safeParseProfile(storedUser) : null;

    if (!profile || profile.personalInfo.email?.toLowerCase() !== email.toLowerCase()) {
      setIsLoading(false);
      throw new Error('No account found for that email. Create an account first.');
    }

    setUser(profile);
    document.cookie = 'student_auth=true; path=/; SameSite=Lax';
    setIsLoading(false);
  };

  const signUp = async (email: string, password: string, name?: string): Promise<void> => {
    setIsLoading(true);

    if (isSupabaseConfigured()) {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: name ? { full_name: name } : undefined,
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setIsLoading(false);
        throw error;
      }

      // A confirmed signup returns a session; one that still needs email confirmation does not
      if (data.user && data.session) {
        const profile = applySupabaseSession(data.user);
        setUser(profile);
        document.cookie = 'student_auth=true; path=/; SameSite=Lax';
      }

      setIsLoading(false);
      return;
    }

    // No backend configured: create the local profile so the app stays usable
    const finalProfile = generateEmptyProfile('email', email, name);

    setUser(finalProfile);
    localStorage.setItem('student_user', JSON.stringify(finalProfile));
    document.cookie = 'student_auth=true; path=/; SameSite=Lax';
    setIsLoading(false);
  };

  const logout = async () => {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      await supabase.auth.signOut();
    }
    setUser(null);
    setIsLoading(false);
    localStorage.removeItem('student_user');
    document.cookie = 'student_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    
    // Clear temporary resume data from sessionStorage on logout to prevent exposure to other users
    if (typeof window !== 'undefined') {
      try {
        const keysToRemove: string[] = [];
        for (let i = 0; i < sessionStorage.length; i++) {
          const key = sessionStorage.key(i);
          if (key && key.startsWith('temp_resume_upload_')) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach(key => sessionStorage.removeItem(key));
      } catch (e) {
        console.error('Failed to clear temporary resume data', e);
      }
    }
    
    skipIntroOnNextLanding();
    window.location.href = '/';
  };

  const updateProfile = (newProfile: StudentProfile) => {
    setUser(newProfile);
    localStorage.setItem('student_user', JSON.stringify(newProfile));
  };

  const markNotificationRead = (id: string) => {
    if (!user) return;
    const updatedNotifications = user.notifications.map(n => 
      n.id === id ? { ...n, unread: false } : n
    );
    const updatedUser = { ...user, notifications: updatedNotifications };
    setUser(updatedUser);
    localStorage.setItem('student_user', JSON.stringify(updatedUser));
  };

  const clearNotifications = () => {
    if (!user) return;
    const updatedNotifications = user.notifications.map(n => ({ ...n, unread: false }));
    const updatedUser = { ...user, notifications: updatedNotifications };
    setUser(updatedUser);
    localStorage.setItem('student_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider       value={{ user, isLoading, login, signInWithPassword, signUp, logout, updateProfile, markNotificationRead, clearNotifications }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
