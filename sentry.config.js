/**
 * Sentry Configuration
 * 
 * To set up Sentry:
 * 1. Create account at https://sentry.io/signup/
 * 2. Create a new React Native project
 * 3. Copy your DSN (Data Source Name)
 * 4. Add to .env: EXPO_PUBLIC_SENTRY_DSN=your-dsn-here
 * 5. Run: npx @sentry/react-native init
 */

module.exports = {
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN || null,
  
  // Enable in production, disable in development
  enabled: process.env.NODE_ENV === 'production' || !!process.env.EXPO_PUBLIC_SENTRY_DSN,
  
  // Environment
  environment: process.env.NODE_ENV || 'development',
  
  // Release tracking
  release: process.env.EXPO_PUBLIC_APP_VERSION || '1.0.0',
  
  // Performance monitoring
  tracesSampleRate: 1.0, // 100% in development, lower in production (0.1 = 10%)
  
  // Error filtering
  beforeSend(event, hint) {
    // Filter out known non-critical errors
    if (event.exception) {
      const error = hint.originalException;
      if (error && error.message) {
        // Don't send Expo Go limitation warnings
        if (error.message.includes('expo-notifications') && error.message.includes('Expo Go')) {
          return null;
        }
      }
    }
    return event;
  },
  
  // Integrations
  integrations: [
    // Add integrations as needed
  ],
};

