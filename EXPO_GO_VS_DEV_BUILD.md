# 📱 Expo Go vs Development Build

## Quick Answer

**For now, use Expo Go** - The app should work in Expo Go for basic testing.

**For full features, use Development Build** - Background location, push notifications, and Sentry require a development build.

---

## Expo Go (Current - For Basic Testing)

### ✅ What Works
- ✅ Basic app functionality
- ✅ Navigation
- ✅ Firebase Auth
- ✅ Firestore database
- ✅ Foreground location
- ✅ UI/UX testing
- ✅ Onboarding flow

### ❌ Limitations
- ❌ Background location (limited)
- ❌ Push notifications (limited)
- ❌ Sentry error tracking (not available)
- ❌ Some native modules

### When to Use
- **Development:** Quick testing, UI changes
- **Prototyping:** Testing new features
- **Basic Testing:** Core functionality

### How to Use
```bash
npx expo start
# Scan QR code with Expo Go app
```

---

## Development Build (Recommended - For Full Features)

### ✅ What Works
- ✅ **Everything** from Expo Go
- ✅ **Full background location**
- ✅ **Full push notifications**
- ✅ **Sentry error tracking**
- ✅ **All native modules**
- ✅ **Production-like performance**

### When to Use
- **Production Testing:** Full feature testing
- **Beta Testing:** TestFlight distribution
- **Performance Testing:** Real-world scenarios
- **Before Launch:** Final testing

### How to Create
```bash
# 1. Install EAS CLI
npm install -g eas-cli

# 2. Login
eas login

# 3. Configure
eas build:configure

# 4. Create build
eas build --profile development --platform ios

# 5. Install on device
# Download from EAS dashboard and install

# 6. Run dev server
npx expo start --dev-client
```

**Time:** ~30-60 minutes (first build)
**Cost:** Free (EAS) + $99/year (Apple Developer)

---

## Current Status

### App in Expo Go
- ✅ **Should work** for basic testing
- ✅ **Sentry is disabled** (won't break Expo Go)
- ✅ **Notifications are graceful** (won't error)
- ✅ **All core features work**

### App in Development Build
- ✅ **Full features enabled**
- ✅ **Sentry works** (if DSN configured)
- ✅ **Notifications work** (full support)
- ✅ **Background location works**

---

## Recommendation

### For Now (Today)
1. **Use Expo Go** for quick testing
2. **Test auth persistence** (should work)
3. **Test basic features** (navigation, UI)

### This Week
1. **Create development build** (1 hour)
2. **Test full features** (location, notifications)
3. **Set up Sentry** (works in dev build)

### Before Launch
1. **Use development build** for all testing
2. **Set up TestFlight** for beta testers
3. **Create production build** for App Store

---

## Troubleshooting

### "App not starting in Expo Go"
- Check for errors in terminal
- Make sure port 8081 is free: `lsof -ti:8081 | xargs kill -9`
- Clear cache: `npx expo start --clear`
- Check that Sentry is optional (should be fixed now)

### "Sentry errors in Expo Go"
- This is expected - Sentry doesn't work in Expo Go
- It's now disabled automatically in Expo Go
- Use development build for Sentry

### "Notifications not working"
- Expected in Expo Go (limited support)
- Use development build for full notifications

---

## Summary

| Feature | Expo Go | Development Build |
|---------|---------|-------------------|
| Basic App | ✅ | ✅ |
| Firebase | ✅ | ✅ |
| Foreground Location | ✅ | ✅ |
| Background Location | ❌ | ✅ |
| Push Notifications | ⚠️ Limited | ✅ |
| Sentry | ❌ | ✅ |
| Performance | ⚠️ | ✅ |
| Production Testing | ❌ | ✅ |

**Bottom Line:** Use Expo Go for quick testing, Development Build for serious testing and production.

---

**Status:** App should work in Expo Go now (Sentry is optional)
**Next:** Test in Expo Go, then create development build for full features

