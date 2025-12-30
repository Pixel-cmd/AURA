# 🔧 Fix Xcode Command Line Tools - Do This Now!

## The Problem

Your Xcode command line tools are pointing to the basic CommandLineTools instead of the full Xcode app. This prevents the iOS simulator from working.

## Quick Fix (Run in Terminal)

**Open a NEW terminal window** (or use the one in Cursor) and run:

```bash
sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer
```

You'll be asked for your password - enter it and press Enter.

## Verify It Worked

After running the command, verify it worked:

```bash
xcode-select -p
```

You should see:
```
/Applications/Xcode.app/Contents/Developer
```

(Not `/Library/Developer/CommandLineTools`)

## Then Try Again

After fixing Xcode, go back to your Expo terminal and:

1. **Press `i`** to open iOS simulator
2. Or run: `npx expo run:ios` to build and run locally

## Alternative: Use Development Build

If you want to use the QR code instead, you need to create a development build first:

```bash
npx eas-cli build --platform ios --profile development
```

This will create a build you can install on simulator or device.

---

**Do this first**: Run the `sudo xcode-select --switch` command above!

