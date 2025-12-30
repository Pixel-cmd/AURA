# 🚀 Quick Start: Production Setup Checklist

## ✅ Step-by-Step Guide

Follow these steps in order to set up your production-ready infrastructure.

---

## Step 1: Test Firebase Auth Persistence (5 minutes)

1. **Restart Expo:**
   ```bash
   npx expo start --clear
   ```

2. **Test the flow:**
   - Login to the app
   - Close app completely (swipe away)
   - Reopen app
   - ✅ Should still be logged in (no re-login required)

3. **Check console:**
   - ✅ No Firebase Auth persistence warning
   - ✅ App loads normally

**If warning still appears:** See `TESTING_AUTH_PERSISTENCE.md` for troubleshooting.

---

## Step 2: Set Up Sentry (30 minutes)

### 2.1 Create Account
1. Go to https://sentry.io/signup/
2. Create account (free tier is fine)
3. Create new **React Native** project named "AURA"
4. Copy your **DSN** (looks like: `https://xxxxx@xxxxx.ingest.sentry.io/xxxxx`)

### 2.2 Add DSN to Environment
1. Open `.env` file
2. Add:
   ```
   EXPO_PUBLIC_SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
   ```
3. Save file

### 2.3 Test Sentry
1. Restart Expo: `npx expo start --clear`
2. Check Sentry dashboard - should see app initialization
3. Trigger a test error (optional):
   ```typescript
   import * as Sentry from '@sentry/react-native';
   Sentry.captureException(new Error('Test error'));
   ```

**Full guide:** See `SETUP_SENTRY.md`

---

## Step 3: Set Up Firebase Analytics (15 minutes)

### 3.1 Enable in Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your **AURA** project
3. Click **Analytics** in left sidebar
4. Click **"Enable Google Analytics"**
5. Select/create Google Analytics account
6. Click **"Enable Analytics"**

### 3.2 Test Analytics
1. Analytics service is already set up in code
2. Go to Firebase Console > Analytics > DebugView
3. Enable debug mode on your device
4. Use the app (navigate, activate SOS, etc.)
5. Check DebugView - events should appear in real-time

**Full guide:** See `SETUP_FIREBASE_ANALYTICS.md`

---

## Step 4: Create Development Build (1 hour)

### 4.1 Install EAS CLI
```bash
npm install -g eas-cli
```

### 4.2 Login to Expo
```bash
eas login
```

### 4.3 Configure EAS
```bash
eas build:configure
```

### 4.4 Set Up Apple Developer (Required for iOS)
1. Go to https://developer.apple.com/
2. Sign up ($99/year)
3. Or use existing Apple Developer account

### 4.5 Configure Credentials
```bash
eas credentials
```
- Select iOS
- Choose "Set up credentials automatically"
- Enter Apple ID

### 4.6 Create Build
```bash
eas build --profile development --platform ios
```

This takes ~15-30 minutes. You'll get a download link when done.

### 4.7 Install Build
1. Download the `.ipa` file
2. Install on your device
3. Trust developer in Settings if needed

### 4.8 Run Development Server
```bash
npx expo start --dev-client
```

**Full guide:** See `SETUP_DEV_BUILD.md`

---

## ✅ Verification Checklist

After completing all steps, verify:

- [ ] ✅ Firebase Auth persistence works (no re-login required)
- [ ] ✅ Sentry is receiving errors (check dashboard)
- [ ] ✅ Firebase Analytics is tracking events (check DebugView)
- [ ] ✅ Development build installed and running
- [ ] ✅ Background location works (in dev build)
- [ ] ✅ Push notifications work (in dev build)
- [ ] ✅ All features working smoothly

---

## 📊 What You've Accomplished

### Infrastructure
- ✅ Error tracking (Sentry)
- ✅ Analytics (Firebase Analytics)
- ✅ Logging infrastructure
- ✅ Development build setup
- ✅ CI/CD pipeline

### Production Ready
- ✅ Auth persistence (users stay logged in)
- ✅ Error monitoring (catch issues before users report)
- ✅ User analytics (understand behavior)
- ✅ Performance tracking (identify bottlenecks)

---

## 🎯 Next Steps

After setup is complete:

1. **Monitor Sentry** - Check for errors daily
2. **Review Analytics** - Understand user behavior
3. **Optimize** - Based on analytics data
4. **Test** - With beta testers via TestFlight
5. **Launch** - When ready!

---

## 📚 Documentation

- `TESTING_AUTH_PERSISTENCE.md` - Auth persistence testing
- `SETUP_SENTRY.md` - Complete Sentry setup guide
- `SETUP_FIREBASE_ANALYTICS.md` - Complete Analytics setup guide
- `SETUP_DEV_BUILD.md` - Complete development build guide
- `PRODUCTION_READY_PLAN.md` - Full production roadmap
- `IMMEDIATE_NEXT_STEPS.md` - Detailed action items

---

**Status:** 🟢 Ready to start
**Total Time:** ~2 hours
**Cost:** Free (Sentry free tier) + $99/year (Apple Developer)

