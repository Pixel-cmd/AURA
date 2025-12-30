import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { initializeAuth, getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getFunctions, Functions } from 'firebase/functions';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Firebase v12.7.0 doesn't export getReactNativePersistence in TypeScript, but it exists at runtime
// We'll use a type-safe workaround that matches Firebase's expected interface
const getReactNativePersistence = (storage: typeof ReactNativeAsyncStorage) => {
  // This matches Firebase's internal persistence adapter interface
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
    // CRITICAL: This ensures auth state persists between app sessions
    // Without this, users must re-login every time (terrible UX for production)
    try {
      auth = initializeAuth(app, {
        // @ts-ignore - Custom persistence adapter matching Firebase's interface
        // Firebase v12.7.0 doesn't export getReactNativePersistence in TypeScript
        // but expects this interface for React Native persistence
        persistence: getReactNativePersistence(ReactNativeAsyncStorage),
      });
    } catch (error: any) {
      // If auth is already initialized, get the existing instance
      if (error.code === 'auth/already-initialized') {
        auth = getAuth(app);
      } else {
        // Log error but continue - auth will work but without persistence
        console.error('⚠️ CRITICAL: Failed to initialize auth with persistence:', error.message);
        console.error('⚠️ Users will need to re-login on every app restart');
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

