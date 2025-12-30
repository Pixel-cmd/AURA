import { create } from 'zustand';
import { LocationWithGeohash } from '../services/location/locationService';
import { locationService } from '../services/location/locationService';

interface LocationState {
  currentLocation: LocationWithGeohash | null;
  hasPermission: boolean;
  isLoading: boolean;
  error: string | null;
  updateLocation: () => Promise<void>;
  requestPermission: () => Promise<boolean>;
  clearError: () => void;
}

export const useLocationStore = create<LocationState>((set, get) => ({
  currentLocation: null,
  hasPermission: false,
  isLoading: false,
  error: null,

  updateLocation: async () => {
    set({ isLoading: true, error: null });
    try {
      const hasPermission = await locationService.hasPermissions();
      if (!hasPermission) {
        const granted = await get().requestPermission();
        if (!granted) {
          set({ error: 'Location permission denied', isLoading: false });
          return;
        }
      }

      const location = await locationService.getCurrentLocation();
      if (location) {
        set({
          currentLocation: location,
          hasPermission: true,
          isLoading: false,
        });
      } else {
        set({ error: 'Failed to get location', isLoading: false });
      }
    } catch (error: any) {
      set({ error: error.message || 'Failed to update location', isLoading: false });
    }
  },

  requestPermission: async () => {
    try {
      const granted = await locationService.requestPermissions();
      set({ hasPermission: granted });
      return granted;
    } catch (error: any) {
      set({ error: error.message || 'Failed to request permission' });
      return false;
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));

