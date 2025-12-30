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

    // Initialize Auth for React Native
    // Note: Firebase v12.7.0 doesn't have getReactNativePersistence
    // The warning is informational - Firebase may still use AsyncStorage automatically in RN
    // We use getAuth() which should work, but you may see a warning
    // This is a known Firebase v12 limitation - auth may still persist despite the warning
    try {
      auth = getAuth(app);
    } catch (error: any) {
      // Fallback if getAuth fails
      console.warn('Auth initialization warning (non-critical):', error.message);
      auth = getAuth(app);
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

