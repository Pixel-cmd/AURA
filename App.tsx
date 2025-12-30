import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants';
import AppNavigator from './navigation/AppNavigator';
import { ErrorBoundary } from './app/components/ErrorBoundary';
import './utils/i18n'; // Initialize i18n
import { notificationService } from './services/notifications/notificationService';
import { logger } from './utils/logger';
import { initSentry } from './utils/sentry';

export default function App() {
  useEffect(() => {
    // Initialize Sentry (only in development builds, not Expo Go)
    initSentry();
    
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

