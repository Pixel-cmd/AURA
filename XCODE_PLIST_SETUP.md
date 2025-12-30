# ✅ Xcode Setup - GoogleService-Info.plist

## Current Status
- ✅ File is in correct location: `ios/AURA/GoogleService-Info.plist`
- ⏳ Need to verify it's added to Xcode project target

## Verify in Xcode

1. **In Xcode project navigator** (left sidebar):
   - Find `GoogleService-Info.plist` in the `AURA` folder
   - It should be visible in the file tree

2. **Check if it's in the target:**
   - Click on `GoogleService-Info.plist` in Xcode
   - Look at the right sidebar (File Inspector)
   - Under "Target Membership", make sure **"AURA"** is checked ✅

3. **If it's NOT checked:**
   - Click the checkbox next to "AURA" to add it to the target

## Alternative: Add Manually

If the file isn't showing in Xcode:

1. **Right-click** on the `AURA` folder in Xcode project navigator
2. Select **"Add Files to AURA..."**
3. Navigate to: `ios/AURA/GoogleService-Info.plist`
4. Make sure:
   - ✅ "Copy items if needed" is checked
   - ✅ "Add to targets: AURA" is checked
   - Click **"Add"**

## Verify It's Working

After adding to target, restart Expo:
```bash
npx expo start --clear
```

Firebase should now initialize properly! 🎉

