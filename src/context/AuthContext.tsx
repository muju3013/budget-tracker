import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import { UserProfile } from '../types/finance';
import { apiService } from '../services/api';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
  authMode: 'login' | 'signup' | 'forgot';
  openAuthModal: (mode?: 'login' | 'signup' | 'forgot') => void;
  closeAuthModal: () => void;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (updated: Partial<UserProfile>) => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot'>('login');

  useEffect(() => {
    const initAuth = async () => {
      const profile = await apiService.getUserProfile();
      setUser(profile);

      if (isSupabaseConfigured && supabase) {
        supabase.auth.getSession().then(({ data }: { data: { session: any } }) => {
          if (data?.session?.user) {
            setUser(prev => prev ? {
              ...prev,
              id: data.session.user.id,
              email: data.session.user.email || prev.email,
              fullName: data.session.user.user_metadata?.full_name || prev.fullName
            } : null);
          }
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
          if (session?.user) {
            setUser(prev => prev ? {
              ...prev,
              id: session.user.id,
              email: session.user.email || prev.email,
              fullName: session.user.user_metadata?.full_name || prev.fullName
            } : null);
          }
        });

        return () => subscription.unsubscribe();
      }
    };

    initAuth();
  }, []);

  const openAuthModal = (mode: 'login' | 'signup' | 'forgot' = 'login') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => setIsAuthModalOpen(false);

  const login = async (email: string, pass: string) => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
      if (error) return { success: false, error: error.message };
      if (data.user) {
        const current = await apiService.getUserProfile();
        const updated = { ...current, id: data.user.id, email: data.user.email || email };
        await apiService.saveUserProfile(updated);
        setUser(updated);
        setIsAuthModalOpen(false);
        return { success: true };
      }
    }

    const current = await apiService.getUserProfile();
    const updated = { ...current, email, isOnboarded: true };
    await apiService.saveUserProfile(updated);
    setUser(updated);
    setIsAuthModalOpen(false);
    return { success: true };
  };

  const signup = async (name: string, email: string, pass: string) => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: pass,
        options: { data: { full_name: name } }
      });
      if (error) return { success: false, error: error.message };
      if (data.user) {
        const current = await apiService.getUserProfile();
        const updated = { ...current, id: data.user.id, fullName: name, email };
        await apiService.saveUserProfile(updated);
        setUser(updated);
        setIsAuthModalOpen(false);
        return { success: true };
      }
    }

    const current = await apiService.getUserProfile();
    const updated = { ...current, fullName: name, email, isOnboarded: true };
    await apiService.saveUserProfile(updated);
    setUser(updated);
    setIsAuthModalOpen(false);
    return { success: true };
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    const current = await apiService.getUserProfile();
    setUser(current);
  };

  const updateProfile = async (updated: Partial<UserProfile>) => {
    if (!user) return;
    const newProfile = { ...user, ...updated };
    await apiService.saveUserProfile(newProfile);
    setUser(newProfile);
  };

  const resetPassword = async (email: string) => {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) return { success: false, error: error.message };
    }
    return { success: true };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isAuthModalOpen,
        authMode,
        openAuthModal,
        closeAuthModal,
        login,
        signup,
        logout,
        updateProfile,
        resetPassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
