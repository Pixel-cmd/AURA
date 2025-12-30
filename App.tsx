import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants';
import AppNavigator from './navigation/AppNavigator';
import { ErrorBoundary } from './app/components/ErrorBoundary';
import './utils/i18n'; // Initialize i18n
import { notificationService } from './services/notifications/notificationService';
import { logger } from './utils/logger';

// Only load Sentry initialization if not in Expo Go
// This prevents bundling Sentry in Expo Go (which causes the promise/setimmediate/done error)
const isExpoGo = !Constants?.executionEnvironment || Constants.executionEnvironment === 'storeClient';

export default function App() {
  useEffect(() => {
    // Initialize Sentry (only in development builds, not Expo Go)
    // Use dynamic require to prevent bundling in Expo Go
    if (!isExpoGo) {
      try {
        const { initSentry } = require('./utils/sentry');
        initSentry();
        // Initialize logger with Sentry
        if (process.env.EXPO_PUBLIC_SENTRY_DSN) {
          logger.initSentry();
        }
      } catch (e) {
        // Sentry not available (this is fine in Expo Go)
        console.log('Sentry initialization skipped (not available in Expo Go)');
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

