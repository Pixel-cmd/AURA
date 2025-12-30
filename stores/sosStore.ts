import { create } from 'zustand';
import { SOSRequest } from '../types/firebase';
import { collection, doc, setDoc, updateDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

interface SOSState {
  activeSOS: SOSRequest | null;
  isLoading: boolean;
  error: string | null;
  setActiveSOS: (sos: SOSRequest | null) => void;
  createSOS: (userId: string, location: { lat: number; lng: number; geohash: string }) => Promise<string | null>;
  updateSOS: (sosId: string, updates: Partial<SOSRequest>) => Promise<void>;
  closeSOS: (sosId: string) => Promise<void>;
  subscribeToSOS: (sosId: string, callback: (sos: SOSRequest | null) => void) => () => void;
  clearError: () => void;
}

export const useSOSStore = create<SOSState>((set, get) => ({
  activeSOS: null,
  isLoading: false,
  error: null,

  setActiveSOS: (sos) => {
    set({ activeSOS: sos });
  },

  createSOS: async (userId, location) => {
    set({ isLoading: true, error: null });
    try {
      const sosRef = doc(collection(db, 'sosRequests'));
      const sosData: Omit<SOSRequest, 'id'> = {
        userId,
        location,
        status: 'active',
        helpers: [],
        createdAt: serverTimestamp() as any,
      };

      await setDoc(sosRef, sosData);
      const sosId = sosRef.id;

      // Set as active SOS
      const newSOS: SOSRequest = {
        id: sosId,
        ...sosData,
        createdAt: Date.now(),
      };
      set({ activeSOS: newSOS, isLoading: false });
      return sosId;
    } catch (error: any) {
      set({ error: error.message || 'Failed to create SOS request', isLoading: false });
      return null;
    }
  },

  updateSOS: async (sosId, updates) => {
    try {
      const sosRef = doc(db, 'sosRequests', sosId);
      await updateDoc(sosRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      } as any);

      // Update local state
      const { activeSOS } = get();
      if (activeSOS && activeSOS.id === sosId) {
        set({ activeSOS: { ...activeSOS, ...updates } });
      }
    } catch (error: any) {
      set({ error: error.message || 'Failed to update SOS request' });
      throw error;
    }
  },

  closeSOS: async (sosId) => {
    try {
      await get().updateSOS(sosId, {
        status: 'closed',
        closedAt: Date.now(),
      });
      set({ activeSOS: null });
    } catch (error: any) {
      set({ error: error.message || 'Failed to close SOS request' });
      throw error;
    }
  },

  subscribeToSOS: (sosId, callback) => {
    const sosRef = doc(db, 'sosRequests', sosId);
    const unsubscribe = onSnapshot(
      sosRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const sos = { id: snapshot.id, ...snapshot.data() } as SOSRequest;
          set({ activeSOS: sos });
          callback(sos);
        } else {
          set({ activeSOS: null });
          callback(null);
        }
      },
      (error) => {
        console.error('Error subscribing to SOS:', error);
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

