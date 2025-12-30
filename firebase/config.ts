import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { initializeAuth, getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getFunctions, Functions } from 'firebase/functions';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

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
    // Try to use getReactNativePersistence if available (may exist at runtime)
    try {
      // Try to get getReactNativePersistence from firebase/auth
      // It might exist at runtime even if not in TypeScript definitions
      const authModule = require('firebase/auth');
      const getReactNativePersistence = authModule.getReactNativePersistence;
      
      if (getReactNativePersistence) {
        // Use getReactNativePersistence if available
        auth = initializeAuth(app, {
          // @ts-ignore - Function exists at runtime
          persistence: getReactNativePersistence(ReactNativeAsyncStorage),
        });
      } else {
        // Fallback to getAuth (should still work with persistence in RN)
        auth = getAuth(app);
      }
    } catch (error: any) {
      // If initializeAuth fails, fallback to getAuth
      if (error.code === 'auth/already-initialized') {
        auth = getAuth(app);
      } else {
        // Try getAuth as fallback
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

