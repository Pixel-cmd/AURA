# 🔐 Testing Firebase Auth Persistence

## Step 1: Restart Expo

```bash
# Stop current Expo (Ctrl+C if running)
# Then restart with cache clear:
npx expo start --clear
```

## Step 2: Test Login Flow

1. **Open the app** in Expo Go or simulator
2. **Complete onboarding** (if first time)
3. **Login** using any method (Apple, Google, Phone, Email)
4. **Verify you're logged in** - should see home screen

## Step 3: Test Persistence

1. **Close the app completely:**
   - iOS Simulator: Swipe up and swipe away the app
   - Physical device: Swipe up from bottom, swipe away app
   - **Don't just minimize** - fully close it

2. **Reopen the app**

3. **Expected Result:**
   - ✅ You should still be logged in
   - ✅ No login screen should appear
   - ✅ Should go directly to home screen
   - ✅ No Firebase Auth persistence warning in console

## Step 4: Check Console

Look for these in the Expo console:

**✅ GOOD (No warning):**
- No Firebase Auth persistence warnings
- App loads normally
- User stays authenticated

**❌ BAD (Still has warning):**
- Warning: "Auth state will default to memory persistence"
- User needs to re-login after app restart

## Troubleshooting

### If warning still appears:
1. Check that `firebase/config.ts` has the custom persistence adapter
2. Verify `@react-native-async-storage/async-storage` is installed
3. Clear app data and try again:
   ```bash
   # iOS Simulator
   # Settings > General > Reset > Erase All Content and Settings
   ```

### If user still needs to re-login:
1. Check Firebase console for auth errors
2. Verify AsyncStorage is working:
   ```javascript
   import AsyncStorage from '@react-native-async-storage/async-storage';
   AsyncStorage.setItem('test', 'value');
   AsyncStorage.getItem('test').then(console.log);
   ```

---

**Status:** Ready to test
**Next:** After confirming auth works, proceed to Sentry setup

