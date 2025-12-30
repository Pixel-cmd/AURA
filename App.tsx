import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants';
import AppNavigator from './navigation/AppNavigator';
import { ErrorBoundary } from './app/components/ErrorBoundary';
import './utils/i18n'; // Initialize i18n
import { notificationService } from './services/notifications/notificationService';
import { logger } from './utils/logger';

// Check if we're in Expo Go BEFORE any Sentry-related code
const isExpoGo = !Constants?.executionEnvironment || Constants.executionEnvironment === 'storeClient';

export default function App() {
  useEffect(() => {
    // Initialize Sentry ONLY in development builds (NOT in Expo Go)
    // We check Expo Go first and never touch Sentry code if we are
    if (!isExpoGo && process.env.EXPO_PUBLIC_SENTRY_DSN) {
      try {
        // Inline Sentry initialization - never import utils/sentry.ts
        // This prevents Metro from analyzing any Sentry code
        const Sentry = require('@sentry/react-native');
        Sentry.init({
          dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
          debug: __DEV__,
          environment: __DEV__ ? 'development' : 'production',
          tracesSampleRate: __DEV__ ? 1.0 : 0.1,
          beforeSend(event: any, hint: any) {
            if (event.exception) {
              const error = hint.originalException;
              if (error && typeof error === 'object' && 'message' in error) {
                const errorMessage = String(error.message);
                if (errorMessage.includes('expo-notifications') && errorMessage.includes('Expo Go')) {
                  return null;
                }
              }
            }
            return event;
          },
        });
        // Initialize logger with Sentry
        logger.initSentry();
      } catch (e) {
        // Sentry not available - this is fine
        console.log('Sentry initialization skipped');
      }
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

