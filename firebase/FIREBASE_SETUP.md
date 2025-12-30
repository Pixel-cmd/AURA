# Firebase Setup Instructions

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: "AURA" (or your preferred name)
4. Enable Google Analytics (optional, recommended)
5. Click "Create project"

## Step 2: Add iOS App

1. In Firebase Console, click "Add app" > iOS
2. Enter iOS bundle ID: `com.pixelcmd.aura`
3. Enter app nickname: "AURA iOS"
4. App Store ID: (leave blank for now)
5. Click "Register app"

## Step 3: Download Configuration File

1. Download `GoogleService-Info.plist`
2. Place it in `/Users/quintenharsveld/Downloads/AURA/ios/AURA/`
3. Add to Xcode project (drag into project navigator)

## Step 4: Get Firebase Config

1. In Firebase Console, go to Project Settings (gear icon)
2. Scroll to "Your apps" section
3. Find your iOS app
4. Copy the Firebase SDK configuration values

## Step 5: Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your Firebase config values in `.env`:
   ```
   EXPO_PUBLIC_FIREBASE_API_KEY=AIza...
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=aura-project.firebaseapp.com
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=aura-project
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=aura-project.appspot.com
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
   EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:ios:abc123
   ```

## Step 6: Enable Firebase Services

### Authentication
1. Go to Firebase Console > Authentication
2. Click "Get started"
3. Enable "Phone" provider
4. Enable "Apple" provider (for iOS)

### Firestore Database
1. Go to Firebase Console > Firestore Database
2. Click "Create database"
3. Start in "Production mode" (we'll add security rules later)
4. Choose location (closest to your users)

### Cloud Functions
1. Go to Firebase Console > Functions
2. Click "Get started"
3. Follow setup instructions (requires Firebase CLI)

### Cloud Messaging (FCM)
1. Go to Firebase Console > Cloud Messaging
2. FCM is automatically enabled
3. For iOS, you'll need to upload APNs certificate (later)

## Step 7: Firestore Security Rules

After creating Firestore, update security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read their own profile
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // SOS requests visible to helpers in radius (enforced by Cloud Function)
    match /sosRequests/{requestId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow update: if request.auth != null;
    }
    
    // Helper responses
    match /helperResponses/{responseId} {
      allow read, write: if request.auth != null;
    }
    
    // Reputation (read-only, updated by Cloud Functions)
    match /reputation/{userId} {
      allow read: if request.auth != null;
      allow write: if false; // Only Cloud Functions can write
    }
    
    // Reports (users can create, admins can read)
    match /reports/{reportId} {
      allow create: if request.auth != null;
      allow read: if false; // Admin only
    }
  }
}
```

## Step 8: Install Firebase CLI (for Cloud Functions)

```bash
npm install -g firebase-tools
firebase login
firebase init functions
```

## Next Steps

After completing setup:
1. Update `firebase/config.ts` with your actual config
2. Test Firebase connection in the app
3. Proceed with authentication implementation

