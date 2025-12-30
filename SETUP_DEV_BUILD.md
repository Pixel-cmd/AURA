# 🏗️ Creating Development Build

## Why Development Build?

Expo Go has limitations:
- ❌ No background location
- ❌ Limited push notifications
- ❌ No custom native modules
- ❌ Limited performance monitoring

Development builds give you:
- ✅ Full native features
- ✅ Background location
- ✅ Push notifications
- ✅ Custom native code
- ✅ Production-like performance

## Prerequisites

1. ✅ EAS CLI installed
2. ✅ Expo account (free tier is fine)
3. ✅ Apple Developer account ($99/year) - **Required for iOS**
4. ✅ Xcode installed (for local builds, optional)

## Step 1: Install EAS CLI

```bash
npm install -g eas-cli
```

## Step 2: Login to Expo

```bash
eas login
```

Enter your Expo credentials (same as expo.dev account).

## Step 3: Configure EAS Build

```bash
eas build:configure
```

This will:
- Create/update `eas.json`
- Set up build profiles
- Configure iOS and Android settings

## Step 4: Configure Apple Developer

### Option A: Automatic (EAS Managed)

EAS can manage your certificates automatically:

1. **Add Apple Developer credentials:**
   ```bash
   eas credentials
   ```

2. **Select iOS platform**
3. **Choose "Set up credentials automatically"**
4. **Enter Apple ID** (your Apple Developer account email)
5. **EAS will handle certificates** - this is the easiest way!

### Option B: Manual (Advanced)

If you prefer to manage certificates yourself:
1. Go to [Apple Developer Portal](https://developer.apple.com/)
2. Create certificates and provisioning profiles
3. Upload to EAS

## Step 5: Create Development Build

### For iOS Simulator (Fastest, for testing)

```bash
eas build --profile development --platform ios --local
```

**Note:** `--local` requires Xcode installed. For cloud builds, remove `--local`.

### For Physical Device (Recommended)

```bash
eas build --profile development --platform ios
```

This will:
1. Upload your code to EAS servers
2. Build the app in the cloud
3. Provide a download link
4. Take ~15-30 minutes

## Step 6: Install Development Build

### Option A: Direct Install (Easiest)

1. **Download the build** from EAS dashboard
2. **Install on device:**
   - iOS: Open `.ipa` file (may need to trust developer)
   - Or use TestFlight (see below)

### Option B: TestFlight (Recommended for Beta Testing)

1. **Submit to TestFlight:**
   ```bash
   eas build --profile preview --platform ios
   ```

2. **After build completes:**
   ```bash
   eas submit --platform ios
   ```

3. **Add testers** in App Store Connect
4. **Testers install** via TestFlight app

## Step 7: Run Development Server

After installing development build:

```bash
npx expo start --dev-client
```

This starts the development server that connects to your development build.

## Step 8: Test Full Features

Now you can test:
- ✅ Background location tracking
- ✅ Push notifications
- ✅ Full Firebase features
- ✅ Sentry error tracking
- ✅ Analytics

## Build Profiles Explained

### Development Profile
- **Purpose:** Testing during development
- **Features:** Full debugging, hot reload
- **Distribution:** Internal (your devices)
- **Use:** `eas build --profile development`

### Preview Profile
- **Purpose:** Beta testing
- **Features:** Production-like, some debugging
- **Distribution:** TestFlight
- **Use:** `eas build --profile preview`

### Production Profile
- **Purpose:** App Store release
- **Features:** Optimized, no debugging
- **Distribution:** App Store
- **Use:** `eas build --profile production`

## Troubleshooting

### "EAS not found"
```bash
npm install -g eas-cli
```

### "Not logged in"
```bash
eas login
```

### "Apple Developer account required"
- Sign up at https://developer.apple.com/
- $99/year fee
- Required for iOS builds

### "Build failed"
- Check build logs in EAS dashboard
- Common issues:
  - Missing certificates
  - Invalid bundle identifier
  - Code signing errors

### "Can't install on device"
- iOS: Trust developer in Settings > General > Device Management
- Check device UDID is registered
- Verify provisioning profile includes your device

## Cost Considerations

### EAS Build (Free Tier)
- ✅ 30 builds/month free
- ✅ Unlimited for paid plans
- ✅ Sufficient for MVP

### Apple Developer
- ✅ $99/year (required for iOS)
- ✅ Includes TestFlight
- ✅ App Store distribution

## Next Steps

After development build is created:
1. ✅ Test all features (location, notifications)
2. ✅ Set up TestFlight for beta testers
3. ✅ Configure automated builds
4. ✅ Set up CI/CD for builds

---

**Status:** Ready to build
**Time Required:** 30-60 minutes (first build)
**Cost:** Free (EAS) + $99/year (Apple Developer)

