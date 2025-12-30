import { create } from 'zustand';
import { User as FirebaseUser } from 'firebase/auth';
import { FirestoreUser } from '../types/firebase';
import { authService } from '../services/auth/authService';
import { resetOnboarding } from '../utils/onboardingStorage';

interface AuthState {
  user: FirebaseUser | null;
  profile: FirestoreUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: FirebaseUser | null) => void;
  setProfile: (profile: FirestoreUser | null) => void;
  setLoading: (loading: boolean) => void;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  isLoading: false,
  isAuthenticated: false,

  setUser: (user) => {
    set({ user, isAuthenticated: !!user });
  },

  setProfile: (profile) => {
    set({ profile });
  },

  setLoading: (isLoading) => {
    set({ isLoading });
  },

  signOut: async () => {
    try {
      await authService.signOut();
      await resetOnboarding(); // Reset onboarding on sign out
      set({ user: null, profile: null, isAuthenticated: false });
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  },

  refreshProfile: async () => {
    const { user } = get();
    if (!user) return;

    try {
      const profile = await authService.getUserProfile(user.uid);
      set({ profile });
    } catch (error) {
      console.error('Error refreshing profile:', error);
    }
  },
}));

