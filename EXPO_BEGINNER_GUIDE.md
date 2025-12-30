# 🚀 Expo Beginner Guide - Getting Started with AURA

## What is Expo?

Expo is a platform that makes it easy to build and deploy React Native apps. Think of it like:
- **Local Development**: Test your app on your computer (simulator) or phone
- **EAS Build**: Create production-ready app files for the App Store
- **EAS Update**: Push updates to your app without going through the App Store

## Step 1: Test Your App Locally (Right Now!)

### Option A: iOS Simulator (Easiest)

1. **Open Terminal** (in Cursor or your Mac terminal)
2. **Navigate to your project**:
   ```bash
   cd /Users/quintenharsveld/Downloads/AURA
   ```
3. **Start Expo**:
   ```bash
   npx expo start
   ```
4. **When you see the QR code**, press `i` on your keyboard
5. **iOS Simulator will open** and show your app!

### Option B: On Your iPhone

1. **Install Expo Go** from the App Store (free)
2. **Start Expo** (same as above)
3. **Scan the QR code** with your iPhone camera
4. **App opens in Expo Go**

### What You Should See

- ✅ Intro screen ("You're never alone")
- ✅ Onboarding screens (4 screens)
- ✅ Navigation working
- ⚠️ Some features won't work yet (need Firebase - that's OK!)

## Step 2: Set Up Firebase (Required for Full Features)

Your app needs Firebase for:
- User login (Phone, Apple Sign-In)
- Location tracking
- SOS button
- Helper matching
- Push notifications

### Quick Setup:

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Click "Add project"**
3. **Name it**: "AURA"
4. **Enable Google Analytics** (optional, but recommended)
5. **Click "Create project"**

### Add iOS App:

1. **Click "Add app"** > iOS icon
2. **Bundle ID**: `com.pixelcmd.aura` (already set in your app)
3. **App nickname**: "AURA iOS"
4. **Click "Register app"**

### Download Configuration:

1. **Download** `GoogleService-Info.plist`
2. **Open Xcode**
3. **Drag the file** into your project (left sidebar)
4. **Make sure** "Copy items if needed" is checked
5. **Click "Finish"**

### Get Firebase Config:

1. In Firebase Console, click the **gear icon** (⚙️) > **Project Settings**
2. Scroll to **"Your apps"** section
3. Find your iOS app
4. Copy these values:
   - API Key
   - Auth Domain
   - Project ID
   - Storage Bucket
   - Messaging Sender ID
   - App ID

### Create .env File:

1. **In Terminal**, run:
   ```bash
   cd /Users/quintenharsveld/Downloads/AURA
   ```
2. **Create .env file**:
   ```bash
   cat > .env << 'EOF'
   EXPO_PUBLIC_FIREBASE_API_KEY=your-api-key-here
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   EXPO_PUBLIC_FIREBASE_APP_ID=your-app-id
   EOF
   ```
3. **Edit the file** and replace the placeholder values with your actual Firebase values

### Enable Firebase Services:

1. **Authentication**:
   - Go to Firebase Console > Authentication
   - Click "Get started"
   - Enable "Phone" provider
   - Enable "Apple" provider

2. **Firestore Database**:
   - Go to Firebase Console > Firestore Database
   - Click "Create database"
   - Start in "Production mode"
   - Choose location (closest to your users)

3. **Cloud Messaging** (FCM):
   - Already enabled automatically!

## Step 3: Test Again

After Firebase setup:

1. **Restart Expo**:
   - Stop current Expo (Ctrl+C in terminal)
   - Run: `npx expo start --clear`

2. **Test in Simulator**:
   - Press `i` to open iOS simulator
   - App should now work with Firebase!

## Step 4: Build for App Store (Later)

Once everything works:

1. **Create a build**:
   ```bash
   npx eas-cli build --platform ios --profile production
   ```

2. **This will**:
   - Create an `.ipa` file (iOS app file)
   - Upload it to Expo
   - You can download it or submit to App Store

3. **Submit to App Store**:
   ```bash
   npx eas-cli submit --platform ios
   ```

## Common Commands

```bash
# Start development server
npx expo start

# Start with iOS simulator
npx expo start --ios

# Clear cache and start
npx expo start --clear

# Build for iOS (development)
npx eas-cli build --platform ios --profile development

# Build for iOS (production)
npx eas-cli build --platform ios --profile production

# Check EAS status
npx eas-cli whoami
```

## Troubleshooting

### App won't start?
- Make sure you're in the project directory: `cd /Users/quintenharsveld/Downloads/AURA`
- Try: `npx expo start --clear`

### Firebase errors?
- Check that `.env` file exists and has correct values
- Make sure `GoogleService-Info.plist` is in Xcode project
- Restart Expo after adding Firebase config

### Simulator won't open?
- Make sure Xcode is installed
- Try: `xcode-select --switch /Applications/Xcode.app/Contents/Developer`

## What's Next?

1. ✅ **Test locally** - See your app running
2. ✅ **Set up Firebase** - Enable full features
3. ✅ **Test features** - Login, location, SOS
4. ✅ **Build for App Store** - Create production build
5. ✅ **Submit to App Store** - Get your app published!

---

**Need Help?** Check:
- `firebase/FIREBASE_SETUP.md` - Detailed Firebase guide
- `QUICK_ACTION_PLAN.md` - Quick reference
- Expo Docs: https://docs.expo.dev/

