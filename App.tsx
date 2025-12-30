// Initialize Sentry only in development builds (not Expo Go)
// Sentry requires native modules that aren't available in Expo Go
let Sentry: any = null;
const isExpoGo = !Constants?.executionEnvironment || Constants.executionEnvironment === 'storeClient';

if (!isExpoGo && process.env.EXPO_PUBLIC_SENTRY_DSN) {
  try {
    Sentry = require('@sentry/react-native');
    Sentry.init({
      dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
      debug: __DEV__, // Enable debug mode in development
      environment: __DEV__ ? 'development' : 'production',
      tracesSampleRate: __DEV__ ? 1.0 : 0.1, // 100% in dev, 10% in production
      beforeSend(event, hint) {
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
  } catch (error) {
    // Sentry not available (likely in Expo Go)
    console.log('Sentry not available (running in Expo Go or not configured)');
  }
}

import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants';
import AppNavigator from './navigation/AppNavigator';
import { ErrorBoundary } from './app/components/ErrorBoundary';
import './utils/i18n'; // Initialize i18n
import { notificationService } from './services/notifications/notificationService';
import { logger } from './utils/logger';

export default function App() {
  useEffect(() => {
    // Initialize logger with Sentry
    if (process.env.EXPO_PUBLIC_SENTRY_DSN) {
      logger.initSentry();
    }

    // Setup notification handlers (gracefully handles Expo Go limitations)
    const cleanup = notificationService.setupListeners(
      (notification) => {
        logger.debug('Notification received', { notification });
      },
      (response) => {
        logger.debug('Notification tapped', { response });
        // Handle deep linking here
        const data = response.notification.request.content.data;
        if (data?.type === 'sos_alert' && data?.sosId) {
          // Navigate to helper alert screen
          // This will be handled by navigation
        }
      }
    );

    // Request notification permissions (silently fails in Expo Go)
    notificationService.requestPermissions().catch((error) => {
      logger.warn('Notification permissions failed', { error: error.message });
    });

    logger.info('App initialized', { 
      environment: __DEV__ ? 'development' : 'production',
      sentryEnabled: !!process.env.EXPO_PUBLIC_SENTRY_DSN,
    });

    return cleanup;
  }, []);

  return (
    <ErrorBoundary>
      <StatusBar style="light" />
      <AppNavigator />
    </ErrorBoundary>
  );
}

