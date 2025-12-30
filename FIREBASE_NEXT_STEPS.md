# 🔥 Firebase Setup - Next Steps

## ✅ Completed
- ✅ Firebase project created
- ✅ iOS app registered (bundle ID: com.pixelcmd.aura)
- ✅ GoogleService-Info.plist downloaded and moved to project
- ✅ .env file created with Firebase config

## 📱 Next: Add to Xcode

1. **Open Xcode** with your AURA project

2. **In Xcode project navigator** (left sidebar), find the `AURA` folder

3. **Drag `GoogleService-Info.plist`** from `ios/AURA/` into Xcode:
   - Right-click in Xcode project navigator
   - Select "Add Files to AURA..."
   - Navigate to `ios/AURA/GoogleService-Info.plist`
   - OR simply drag the file from Finder into Xcode

4. **Important:** Make sure:
   - ✅ "Copy items if needed" is checked
   - ✅ Target "AURA" is selected
   - ✅ Click "Finish"

## 🔧 Enable Firebase Services

### 1. Authentication
1. Go to Firebase Console → Authentication
2. Click "Get started"
3. Enable **Phone** provider
4. Enable **Apple** provider (for iOS)

### 2. Firestore Database
1. Go to Firebase Console → Firestore Database
2. Click "Create database"
3. Start in **Production mode** (we'll add security rules later)
4. Choose location (closest to your users, e.g., `europe-west` for Netherlands)

### 3. Cloud Messaging (FCM)
- Already enabled automatically! ✅

## 🧪 Test Firebase Connection

After adding to Xcode and enabling services:

1. **Restart Expo:**
   ```bash
   npx expo start --clear
   ```

2. **Check terminal** - Firebase warnings should be gone!

3. **Test authentication** - Try logging in

## 📝 Security Rules (Later)

After testing, we'll add Firestore security rules. For now, Production mode is fine for development.

---

**Current Status:** 
- ✅ Config files ready
- ⏳ Need to add to Xcode
- ⏳ Need to enable Firebase services

**Next:** Add GoogleService-Info.plist to Xcode project!

