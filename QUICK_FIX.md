# 🚨 Quick Fix - Xcode Simulator Not Working

## The Problem

You're seeing: `Error: xcrun simctl help exited with non-zero code: 72`

This means Xcode command line tools aren't pointing to the full Xcode installation.

## Solution: Run This Command

**Open a NEW terminal window** (in Cursor or your Mac) and run:

```bash
sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer
```

**Enter your Mac password** when prompted.

## Verify It Worked

After running, check:

```bash
xcode-select -p
```

Should show: `/Applications/Xcode.app/Contents/Developer`

## Then Restart Expo

1. **Stop Expo** in your current terminal (Ctrl+C)
2. **Start again**:
   ```bash
   npx expo start --clear
   ```
3. **Press `i`** - Simulator should open now!

## Alternative: Use Expo Go (Temporary)

If you want to test the app RIGHT NOW without fixing Xcode:

1. In Expo terminal, **press `s`** to switch to Expo Go
2. **Press `i`** again - This will use Expo Go instead of development build
3. Simulator should open!

**Note**: Expo Go has limitations (can't use Firebase), but you can see the UI working.

---

**Recommended**: Fix Xcode first (run the `sudo xcode-select` command), then use development builds for full features.

