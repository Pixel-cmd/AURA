# Enable Email/Password Authentication in Firebase

## The Error
You're seeing: `Firebase: Error (auth/operation-not-allowed)`

This means **Email/Password authentication is not enabled** in your Firebase project.

## How to Fix

### Step 1: Open Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your AURA project

### Step 2: Enable Email/Password Authentication
1. In the left sidebar, click **"Authentication"** (or "Build" → "Authentication")
2. Click the **"Sign-in method"** tab (or "Get started" if you haven't set up auth yet)
3. Find **"Email/Password"** in the list of providers
4. Click on **"Email/Password"**
5. Toggle **"Enable"** to ON
6. Click **"Save"**

### Step 3: (Optional) Enable Email Link Authentication
If you want passwordless login later:
- You can also enable "Email link (passwordless sign-in)" in the same screen
- For now, just enable the basic Email/Password

### Step 4: Test Again
1. Go back to your app
2. Try signing up again with email/password
3. It should work now! ✅

---

## Other Authentication Methods

While you're in the Sign-in method settings, you can also enable:

### Apple Sign-In (iOS)
1. Find **"Apple"** in the providers list
2. Click on it
3. Toggle **"Enable"** to ON
4. Click **"Save"**

### Google Sign-In
1. Find **"Google"** in the providers list
2. Click on it
3. Toggle **"Enable"** to ON
4. Enter your project's support email
5. Click **"Save"**

### Phone Authentication
1. Find **"Phone"** in the providers list
2. Click on it
3. Toggle **"Enable"** to ON
4. Click **"Save"**

---

## Quick Checklist
- [ ] Email/Password enabled
- [ ] Apple Sign-In enabled (for iOS)
- [ ] Google Sign-In enabled (optional)
- [ ] Phone Authentication enabled (optional)

---

**After enabling Email/Password, try signing up again!** 🚀

