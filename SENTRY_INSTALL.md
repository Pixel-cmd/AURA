# 📦 Installing Sentry for Development Builds

## Current Status

**Sentry is NOT installed** - This is intentional to make the app work in Expo Go.

## When to Install Sentry

Install Sentry **only when creating a development build**. It doesn't work in Expo Go anyway.

## Installation Steps

### Step 1: Create Development Build First

```bash
# Create your development build first
eas build --profile development --platform ios
```

### Step 2: Install Sentry

After your development build is created, install Sentry:

```bash
npm install @sentry/react-native
```

### Step 3: Update App.tsx

Uncomment the Sentry initialization code in `App.tsx`:

```typescript
// In App.tsx, uncomment this section:
if (!isExpoGo && process.env.EXPO_PUBLIC_SENTRY_DSN) {
  try {
    const Sentry = require('@sentry/react-native');
    Sentry.init({
      dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
      debug: __DEV__,
      environment: __DEV__ ? 'development' : 'production',
      tracesSampleRate: __DEV__ ? 1.0 : 0.1,
    });
    logger.initSentry();
  } catch (e) {
    console.log('Sentry initialization skipped');
  }
}
```

### Step 4: Update Logger

In `utils/logger.ts`, update `initSentry()`:

```typescript
initSentry() {
  try {
    const Constants = require('expo-constants');
    const isExpoGo = !Constants?.executionEnvironment || Constants.executionEnvironment === 'storeClient';
    
    if (isExpoGo) {
      return false;
    }
    
    this.Sentry = require('@sentry/react-native');
    return true;
  } catch (e) {
    return false;
  }
}
```

## Why This Approach?

- **Expo Go:** Works without Sentry (Sentry doesn't work in Expo Go anyway)
- **Dev Build:** Install Sentry when you need it
- **No Errors:** No bundling errors in Expo Go

## Summary

1. ✅ **For Expo Go:** Don't install Sentry (current state)
2. ✅ **For Dev Build:** Install Sentry after creating the build
3. ✅ **For Production:** Sentry will be included in production builds

---

**Status:** Sentry removed for Expo Go compatibility
**Next:** Install Sentry when creating development build

