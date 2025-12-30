# 🔥 Firebase Setup - Step by Step Guide

## ✅ Step 1: Project Created
- Firebase project "AURA" is ready!

## 📱 Step 2: Add iOS App

1. **Click the "+ Add app" button** (or iOS icon if visible)

2. **Select iOS** (Apple icon)

3. **Enter iOS bundle ID:**
   ```
   com.pixelcmd.aura
   ```
   (This matches your app.json configuration)

4. **App nickname (optional):**
   ```
   AURA iOS
   ```

5. **App Store ID:** Leave blank for now

6. **Click "Register app"**

## 📥 Step 3: Download Configuration File

1. **Download `GoogleService-Info.plist`**
   - Click the download button
   - Save it somewhere you can find it (Downloads folder is fine)

2. **Add to Xcode:**
   - Open Xcode
   - Open your AURA project
   - Drag `GoogleService-Info.plist` into the project navigator (left sidebar)
   - Make sure "Copy items if needed" is checked
   - Target: AURA
   - Click "Finish"

## 🔑 Step 4: Get Firebase Config Values

1. **In Firebase Console**, you should see your iOS app listed

2. **Click the gear icon (⚙️)** next to "Project Overview" → **Project Settings**

3. **Scroll down to "Your apps"** section

4. **Find your iOS app** and click on it

5. **Copy these values:**
   - API Key
   - Auth Domain
   - Project ID
   - Storage Bucket
   - Messaging Sender ID
   - App ID

## 📝 Step 5: Create .env File

Once you have the config values, I'll help you create the `.env` file!

---

**Current Step:** Add iOS app to Firebase project
**Next:** Download GoogleService-Info.plist and get config values

