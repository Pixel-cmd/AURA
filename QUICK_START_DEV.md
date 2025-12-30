# 🚀 Quick Start - Development

## Start Development Server

```bash
npx expo start
```

Then press `i` for iOS simulator or scan QR code with Expo Go app.

## Before First Run

### 1. Configure Firebase

1. Create Firebase project at https://console.firebase.google.com/
2. Add iOS app with bundle ID: `com.pixelcmd.aura`
3. Download `GoogleService-Info.plist`
4. Place it in `ios/AURA/` folder
5. Copy `.env.example` to `.env`
6. Fill in your Firebase config values

### 2. Install iOS Dependencies

```bash
cd ios
pod install
cd ..
```

### 3. Run the App

```bash
npx expo start --ios
```

## Project Structure

- `app/` - All screens and components
- `services/` - Business logic (auth, location, matching, notifications)
- `stores/` - Zustand state management
- `navigation/` - React Navigation setup
- `firebase/` - Firebase config and Cloud Functions
- `constants/` - Colors, translations, emergency numbers

## Key Features

- ✅ SOS activation with location sharing
- ✅ Helper matching (500m-2km radius)
- ✅ Push notifications
- ✅ Points and reputation system
- ✅ Rate limiting (anti-abuse)
- ✅ Report/Block functionality
- ✅ Multi-language (NL/EN)

## Testing Flow

1. **Onboarding:** Intro → How It Works → Privacy → Permissions
2. **Home:** Tap SOS button → See active SOS screen
3. **Helper:** Receive notification → Respond → Navigate to user
4. **Closure:** Confirm safety → Receive points

## Troubleshooting

- **Firebase errors:** Check `.env` file and Firebase project setup
- **Location not working:** Check permissions in Settings
- **Notifications not working:** Check notification permissions
- **Build errors:** Run `npx expo install --fix`

---

**Ready to build!** 🎉

