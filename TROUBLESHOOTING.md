# 🔧 Troubleshooting Guide

## Issue: "Unable to resolve promise/setimmediate/done" Error

### Problem
Sentry is trying to import `promise/setimmediate/done` which doesn't exist in Expo Go.

### Solution ✅
Sentry is now completely excluded from Expo Go. The code:
- Only loads Sentry in development builds (not Expo Go)
- Never requires Sentry modules in Expo Go
- Gracefully handles Sentry being unavailable

### How to Verify
1. **Clear cache:**
   ```bash
   rm -rf node_modules/.cache .expo
   ```

2. **Kill any running Expo processes:**
   ```bash
   lsof -ti:8081 | xargs kill -9
   ```

3. **Start fresh:**
   ```bash
   npx expo start --clear
   ```

4. **The app should start in Expo Go** without Sentry errors

---

## Issue: Port Already in Use

### Problem
Port 8081 (or 8082) is already running another Expo instance.

### Solution
```bash
# Kill process on port 8081
lsof -ti:8081 | xargs kill -9

# Or kill on port 8082
lsof -ti:8082 | xargs kill -9

# Then restart
npx expo start --clear
```

---

## Issue: App Not Starting in Expo Go

### Check These:

1. **Clear cache:**
   ```bash
   rm -rf node_modules/.cache .expo
   npx expo start --clear
   ```

2. **Check for errors in terminal:**
   - Look for red error messages
   - Check if any modules are missing

3. **Verify dependencies:**
   ```bash
   npm install
   ```

4. **Check Metro bundler:**
   - Make sure Metro is running
   - Check for bundling errors

---

## Issue: Sentry Not Working

### Expected Behavior
- **In Expo Go:** Sentry is disabled (this is normal)
- **In Development Build:** Sentry works if DSN is configured

### To Enable Sentry:
1. Create development build (Sentry doesn't work in Expo Go)
2. Add DSN to `.env`: `EXPO_PUBLIC_SENTRY_DSN=your-dsn`
3. Restart app

---

## Issue: Firebase Auth Persistence Warning

### Problem
Warning: "Auth state will default to memory persistence"

### Solution
This should be fixed. If you still see it:
1. Check `firebase/config.ts` has the persistence adapter
2. Verify `@react-native-async-storage/async-storage` is installed
3. Clear app data and restart

---

## Issue: Notifications Not Working

### Expected Behavior
- **In Expo Go:** Limited notification support (this is normal)
- **In Development Build:** Full notification support

### Solution
Create a development build for full notification support.

---

## Quick Fixes

### Clear Everything and Restart
```bash
# Kill all Expo processes
lsof -ti:8081 | xargs kill -9
lsof -ti:8082 | xargs kill -9

# Clear caches
rm -rf node_modules/.cache .expo

# Reinstall dependencies (if needed)
npm install

# Start fresh
npx expo start --clear
```

### Reset Metro Bundler
```bash
# Stop Expo
# Press Ctrl+C

# Clear Metro cache
rm -rf node_modules/.cache

# Restart
npx expo start --clear
```

### Check for TypeScript Errors
```bash
npx tsc --noEmit
```

---

## Still Having Issues?

1. **Check the error message** - It usually tells you what's wrong
2. **Clear cache** - This fixes 90% of issues
3. **Restart everything** - Kill processes, clear cache, restart
4. **Check documentation** - See setup guides for each service

---

**Last Updated:** December 30, 2025

