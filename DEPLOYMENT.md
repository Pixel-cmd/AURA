# AURA Deployment Guide

## Pre-Deployment Checklist

### 1. Firebase Setup
- [ ] Create Firebase project
- [ ] Add iOS app with bundle ID: `com.pixelcmd.aura`
- [ ] Download `GoogleService-Info.plist` and place in `ios/AURA/`
- [ ] Configure environment variables in `.env`
- [ ] Set up Firestore database
- [ ] Configure Firestore security rules
- [ ] Deploy Cloud Functions
- [ ] Set up FCM/APNs for push notifications

### 2. App Configuration
- [ ] Update `app.json` with proper bundle ID
- [ ] Add app icons and splash screens
- [ ] Configure privacy policy URL
- [ ] Set up Terms of Service URL
- [ ] Test all screens and flows

### 3. Testing
- [ ] Test SOS flow end-to-end
- [ ] Test helper response flow
- [ ] Test rate limiting
- [ ] Test push notifications
- [ ] Test location permissions
- [ ] Test on physical iOS device
- [ ] Test error handling

### 4. App Store Preparation
- [ ] Prepare app screenshots
- [ ] Write app description
- [ ] Prepare privacy policy (host online)
- [ ] Prepare terms of service (host online)
- [ ] Set up App Store Connect account
- [ ] Create app listing

## Firebase Cloud Functions Deployment

```bash
cd firebase/functions
npm install
npm run build
firebase deploy --only functions
```

## Building for iOS

### Development Build
```bash
npx expo start --ios
```

### Production Build
```bash
# Install EAS CLI
npm install -g eas-cli

# Login
eas login

# Configure
eas build:configure

# Build for iOS
eas build --platform ios
```

## App Store Submission

1. Build app using EAS Build
2. Download .ipa file
3. Upload to App Store Connect
4. Fill in app information
5. Submit for review

## Important Notes

- **Privacy Policy:** Must be hosted online and linked in App Store listing
- **Terms of Service:** Must be hosted online
- **Emergency Disclaimer:** Must be clearly stated in app and listing
- **Permissions:** Location and notifications must be clearly explained

## Post-Deployment

- Monitor Firebase usage
- Monitor error logs
- Review user reports
- Update app as needed

