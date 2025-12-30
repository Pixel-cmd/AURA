import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { initializeAuth, getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getFunctions, Functions } from 'firebase/functions';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Create a custom persistence adapter for React Native
// Firebase v12 doesn't have getReactNativePersistence, so we create our own
const createReactNativePersistence = (storage: typeof ReactNativeAsyncStorage) => {
  return {
    type: 'LOCAL' as const,
    _isAvailable: async () => {
      try {
        await storage.getItem('__test__');
        return true;
      } catch {
        return false;
      }
    },
    _set: async (key: string, value: string) => {
      await storage.setItem(key, value);
    },
    _get: async (key: string) => {
      return await storage.getItem(key);
    },
    _remove: async (key: string) => {
      await storage.removeItem(key);
    },
  };
};

// Firebase configuration
// TODO: Replace with your actual Firebase config
// Get this from Firebase Console > Project Settings > Your apps > Firebase SDK snippet
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "your-api-key",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "your-project.firebaseapp.com",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "your-project-id",
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "your-project.appspot.com",
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "your-sender-id",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "your-app-id",
};

// Initialize Firebase
let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let functions: Functions | null = null;

// Check if Firebase config is valid (not placeholder values)
const isFirebaseConfigured = 
  firebaseConfig.apiKey !== "your-api-key" &&
  firebaseConfig.projectId !== "your-project-id" &&
  firebaseConfig.apiKey?.startsWith("AIza");

if (isFirebaseConfigured) {
  try {
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApps()[0];
    }

    // Initialize Auth with AsyncStorage persistence for React Native
    try {
      // Use custom persistence adapter for React Native
      // Firebase v12.7.0 doesn't have getReactNativePersistence, so we use a custom adapter
      auth = initializeAuth(app, {
        // @ts-ignore - Custom persistence adapter for React Native
        persistence: createReactNativePersistence(ReactNativeAsyncStorage),
      });
    } catch (error: any) {
      // If auth is already initialized, get the existing instance
      if (error.code === 'auth/already-initialized') {
        auth = getAuth(app);
      } else {
        // Fallback to getAuth if initializeAuth fails
        console.warn('Failed to initialize auth with persistence, using default:', error.message);
        auth = getAuth(app);
      }
    }

    db = getFirestore(app);
    functions = getFunctions(app);
  } catch (error) {
    console.warn("Firebase initialization error:", error);
    console.warn("Please configure Firebase in .env file. See firebase/FIREBASE_SETUP.md");
  }
} else {
  console.warn("⚠️ Firebase not configured. Please set up Firebase config in .env file.");
  console.warn("See firebase/FIREBASE_SETUP.md for instructions.");
}

export { app, auth, db, functions };
export default app;

