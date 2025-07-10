import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  profile: any | null;
  isAdmin: boolean;
  setUser: (user: User | null) => void;
  setProfile: (profile: any | null) => void;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string, metadata?: any) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  isAdmin: false,

  setUser: (user) => set({ user }),

  setProfile: (profile) => {
    const isAdmin = profile?.role === 'admin' && profile?.is_owner === true;
    set({ profile, isAdmin });

    if (isAdmin) {
      localStorage.setItem('isAdmin', 'true');
    } else {
      localStorage.removeItem('isAdmin');
      localStorage.removeItem('adminLoggedIn');
    }
  },

  signOut: async () => {
    try {
      set({ user: null, profile: null, isAdmin: false });
      localStorage.removeItem('isAdmin');
      localStorage.removeItem('adminLoggedIn');
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      window.localStorage.removeItem('supabase.auth.token');
      window.sessionStorage.clear();
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  },

  signUp: async (email, password, metadata = {}) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });

    if (data.user) set({ user: data.user });
    return { error };
  },

  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (data.user) set({ user: data.user });
    return { error };
  },
}));
