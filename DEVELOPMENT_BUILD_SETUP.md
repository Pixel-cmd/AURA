# 🚀 Development Build Setup - Complete!

## ✅ What's Been Installed

1. **expo-dev-client** - Installed ✅
   - This enables development builds (customizable version of Expo Go)
   - Allows you to use any native library, including Firebase

2. **EAS Configuration** - Already set up ✅
   - Project linked to EAS
   - `eas.json` configured with development profile

## 🎯 Next Steps

### Step 1: Restart Expo (Important!)

Since we just installed `expo-dev-client`, you need to restart Expo:

1. **Stop current Expo** (if running):
   - In the terminal where Expo is running, press `Ctrl+C`

2. **Start Expo again**:
   ```bash
   cd /Users/quintenharsveld/Downloads/AURA
   npx expo start
   ```

3. **You should now see**:
   - QR code for development build
   - Manifest URL with `expo-development-client` in it
   - Options to open simulator or scan QR code

### Step 2: Test the Development Build

**Option A: iOS Simulator**
- Press `i` in the Expo terminal
- Simulator will open with your app

**Option B: Physical iPhone**
- Install a development build first (see Step 3)
- Then scan QR code

### Step 3: Create Development Build (For Physical Device)

To test on your actual iPhone, you need to create a development build:

```bash
npx eas-cli build --platform ios --profile development
```

This will:
- Create a custom build with `expo-dev-client`
- Upload it to Expo servers
- Give you a download link or install link

**Note**: For simulator, you can use `npx expo run:ios` instead (faster, local build).

## 🔍 What Changed?

### Before (Expo Go):
- Limited to Expo SDK libraries
- QR code worked immediately
- Can't use custom native code (like Firebase)

### After (Development Build):
- ✅ Can use ANY native library
- ✅ Full Firebase support
- ✅ Custom native code
- ✅ Production-ready setup
- ⚠️ Need to build first (one time)

## 📱 Using Development Build

Once you have a development build installed:

1. **Start Expo**: `npx expo start`
2. **Scan QR code** or **press `i` for simulator**
3. **App opens** with development tools
4. **Make code changes** → App updates automatically!

## 🛠️ Troubleshooting

### QR Code Not Showing?
- Make sure you restarted Expo after installing `expo-dev-client`
- Check that you see `expo-development-client` in the manifest URL

### Can't Install on Device?
- You need to create a development build first
- Run: `npx eas-cli build --platform ios --profile development`

### Xcode Path Error?
- Run: `sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer`
- Then: `cd ios && pod install`

## 📚 Reference

Based on: https://docs.expo.dev/tutorial/eas/configure-development-build/

---

**Status**: ✅ `expo-dev-client` installed and ready!
**Next**: Restart Expo to see the development build QR code!

