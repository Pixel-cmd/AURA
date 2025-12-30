import { create } from 'zustand';
import { ReputationData } from '../types/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';

interface ReputationState {
  reputation: ReputationData | null;
  isLoading: boolean;
  error: string | null;
  setReputation: (reputation: ReputationData | null) => void;
  subscribeToReputation: (userId: string, callback: (reputation: ReputationData | null) => void) => () => void;
  clearError: () => void;
}

export const useReputationStore = create<ReputationState>((set) => ({
  reputation: null,
  isLoading: false,
  error: null,

  setReputation: (reputation) => {
    set({ reputation });
  },

  subscribeToReputation: (userId, callback) => {
    const repRef = doc(db, 'reputation', userId);
    const unsubscribe = onSnapshot(
      repRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const reputation = { userId, ...snapshot.data() } as ReputationData;
          set({ reputation });
          callback(reputation);
        } else {
          set({ reputation: null });
          callback(null);
        }
      },
      (error) => {
        console.error('Error subscribing to reputation:', error);
        set({ error: error.message });
        callback(null);
      }
    );

    return unsubscribe;
  },

  clearError: () => {
    set({ error: null });
  },
}));

