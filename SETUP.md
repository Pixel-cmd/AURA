# AURA Setup Guide

## Prerequisites

Before you can start building the AURA app, you need to install the following:

### 1. Node.js and npm

**For macOS:**
- Download and install from [nodejs.org](https://nodejs.org/)
- Or use Homebrew: `brew install node`

**Verify installation:**
```bash
node --version  # Should show v18.x or higher
npm --version    # Should show 9.x or higher
```

### 2. Expo CLI

Once Node.js is installed, install Expo CLI globally:
```bash
npm install -g expo-cli
```

Or use npx (recommended, no global install needed):
```bash
npx create-expo-app@latest
```

### 3. iOS Development Tools

**For iOS development:**
- **Xcode** (from Mac App Store) - Required for iOS simulator
- **Xcode Command Line Tools:**
  ```bash
  xcode-select --install
  ```

**For physical device testing:**
- Install **Expo Go** app from the App Store on your iPhone

### 4. Git (Already installed on macOS)

Verify:
```bash
git --version
```

## Initial Project Setup

Once prerequisites are installed, run these commands in the project directory:

```bash
# Navigate to project directory
cd /Users/quintenharsveld/Downloads/AURA

# Initialize Expo project (if not already done)
npx create-expo-app@latest . --template blank-typescript

# Install core dependencies
npm install

# Install navigation
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context

# Install location services
npx expo install expo-location expo-task-manager

# Install authentication (we'll set this up later)
npx expo install expo-auth-session expo-crypto

# Install notifications
npx expo install expo-notifications expo-device

# Install gesture and animation libraries
npx expo install react-native-gesture-handler react-native-reanimated
```

## Running the App

### Development Mode

```bash
# Start the Expo development server
npx expo start

# Or use the Expo CLI
expo start
```

**Options:**
- Press `i` to open iOS simulator
- Scan QR code with Expo Go app on your iPhone
- Press `a` for Android (when ready)

### iOS Simulator

```bash
# Start iOS simulator
npx expo start --ios

# Or open Xcode and run simulator manually
open -a Simulator
```

## Project Structure

After setup, your project should have:

```
AURA/
├── app.json              # Expo configuration
├── package.json          # Dependencies
├── tsconfig.json         # TypeScript config
├── App.tsx              # Main app entry point
├── README.md            # Project documentation
├── SETUP.md             # This file
└── (folders to be created)
    ├── app/             # Screen components
    ├── services/        # Business logic
    ├── navigation/      # Navigation setup
    └── types/           # TypeScript types
```

## Next Steps

1. ✅ Install Node.js and npm
2. ✅ Install Expo CLI
3. ✅ Install Xcode (for iOS)
4. ✅ Run initial setup commands
5. ⏭️ Start building screens (onboarding first)

## Troubleshooting

### "command not found: npx"
- Make sure Node.js is installed and in your PATH
- Restart terminal after installing Node.js

### "Expo CLI not found"
- Use `npx expo` instead of `expo` (no global install needed)
- Or install globally: `npm install -g expo-cli`

### iOS Simulator Issues
- Make sure Xcode is installed
- Run `xcode-select --install` if needed
- Check Xcode license: `sudo xcodebuild -license accept`

### Permission Errors
- For location services, you'll need to configure permissions in `app.json`
- For push notifications, configure in Expo dashboard

## Development Workflow

1. **Make changes** to code
2. **Save file** - Expo will auto-reload
3. **Test on device/simulator**
4. **Commit changes** to git
5. **Push to GitHub** when ready

## Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Docs](https://reactnative.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

**Ready to start?** Once Node.js is installed, come back and we'll initialize the project!

