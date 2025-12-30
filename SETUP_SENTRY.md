# 🔧 Setting Up Sentry (Error Tracking)

## Step 1: Create Sentry Account

1. Go to https://sentry.io/signup/
2. Sign up (free tier is fine for MVP)
3. Create a new **Organization** (if prompted)

## Step 2: Create React Native Project

1. In Sentry dashboard, click **"Create Project"**
2. Select **"React Native"** as platform
3. Name it: **"AURA"**
4. Click **"Create Project"**

## Step 3: Get Your DSN

1. After creating project, you'll see a **DSN** (Data Source Name)
2. It looks like: `https://xxxxx@xxxxx.ingest.sentry.io/xxxxx`
3. **Copy this DSN** - you'll need it next

## Step 4: Add DSN to Environment

1. Open `.env` file in project root
2. Add your Sentry DSN:
   ```
   EXPO_PUBLIC_SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
   ```
3. Save the file

## Step 5: Initialize Sentry in App

Sentry is already installed! Now we need to initialize it.

### Option A: Using Expo (Recommended for Expo projects)

Since we're using Expo, we need to use `@sentry/react-native` with Expo compatibility:

1. **Update `App.tsx`** to initialize Sentry at the very top (before any other imports):

```typescript
// Add at the very top of App.tsx, before other imports
import * as Sentry from '@sentry/react-native';

// Initialize Sentry
if (process.env.EXPO_PUBLIC_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
    enableInExpoDevelopment: false, // Disable in Expo Go
    debug: __DEV__, // Enable debug mode in development
    environment: __DEV__ ? 'development' : 'production',
    tracesSampleRate: 1.0, // 100% in dev, lower in production
  });
}
```

### Option B: Using Sentry CLI (For Development Builds)

For development builds, you can use the Sentry CLI:

```bash
npx @sentry/react-native init
```

This will:
- Update `App.tsx` automatically
- Create `sentry.properties` file
- Configure native projects

**Note:** This requires a development build (not Expo Go).

## Step 6: Test Sentry

1. **Add a test error** to verify it works:

```typescript
// In App.tsx, add a test button or in a screen:
import * as Sentry from '@sentry/react-native';

// Test error
Sentry.captureException(new Error('Test error from AURA'));
```

2. **Check Sentry dashboard** - you should see the error appear within seconds

## Step 7: Integrate with Logger

The logger is already set up to use Sentry! Just make sure Sentry is initialized before using the logger.

## Troubleshooting

### "Sentry is not initialized"

- Make sure `EXPO_PUBLIC_SENTRY_DSN` is set in `.env`
- Make sure Sentry.init() is called before any logger calls
- Restart Expo after adding DSN to `.env`

### "Sentry doesn't work in Expo Go"

- Sentry requires a development build for full functionality
- In Expo Go, errors will be logged but may not appear in Sentry dashboard
- Create a development build for full Sentry support

### "No errors appearing in Sentry"

- Check that DSN is correct in `.env`
- Verify Sentry.init() is being called
- Check Sentry dashboard filters (might be filtering out errors)
- Try sending a test error manually

## Next Steps

After Sentry is set up:
1. ✅ Test that errors appear in Sentry dashboard
2. ✅ Integrate with logger (already done)
3. ✅ Set up error alerts in Sentry dashboard
4. ✅ Configure release tracking
5. ✅ Set up performance monitoring

---

**Status:** Ready to configure
**Time Required:** 15-30 minutes
**Next:** Set up Firebase Analytics

