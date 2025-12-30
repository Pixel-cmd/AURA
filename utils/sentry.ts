/**
 * Sentry initialization - Only loads in development builds
 * Completely excluded from Expo Go to avoid bundling issues
 */

import Constants from 'expo-constants';

let Sentry: any = null;
let isInitialized = false;

/**
 * Initialize Sentry only if:
 * 1. Not in Expo Go (development build)
 * 2. DSN is configured
 * 3. Sentry package is available
 */
export function initSentry() {
  // Don't initialize in Expo Go
  const isExpoGo = !Constants?.executionEnvironment || Constants.executionEnvironment === 'storeClient';
  
  if (isExpoGo) {
    return false; // Sentry not available in Expo Go
  }

  // Don't initialize if already initialized
  if (isInitialized) {
    return true;
  }

  // Don't initialize if DSN not configured
  if (!process.env.EXPO_PUBLIC_SENTRY_DSN) {
    return false;
  }

  // Try to load Sentry dynamically
  try {
    Sentry = require('@sentry/react-native');
    
    Sentry.init({
      dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
      debug: __DEV__,
      environment: __DEV__ ? 'development' : 'production',
      tracesSampleRate: __DEV__ ? 1.0 : 0.1,
      beforeSend(event: any, hint: any) {
        // Filter out known non-critical errors
        if (event.exception) {
          const error = hint.originalException;
          if (error && typeof error === 'object' && 'message' in error) {
            const errorMessage = String(error.message);
            // Don't send Expo Go limitation warnings
            if (errorMessage.includes('expo-notifications') && errorMessage.includes('Expo Go')) {
              return null;
            }
          }
        }
        return event;
      },
    });

    isInitialized = true;
    return true;
  } catch (error) {
    // Sentry not available (likely in Expo Go or not installed)
    console.log('Sentry not available:', error);
    return false;
  }
}

/**
 * Get Sentry instance (null if not initialized)
 */
export function getSentry() {
  return Sentry;
}

/**
 * Check if Sentry is available
 */
export function isSentryAvailable() {
  return Sentry !== null && isInitialized;
}

