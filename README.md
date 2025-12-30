# AURA - Safety App

A personal safety app that connects users with nearby trusted community members when they need help. Built with React Native and Expo for iOS (with future Android support).

## 📱 Project Overview

AURA is a community-based safety app that allows users to:
- Activate "presence" to signal need for help without alarm
- Get notified when nearby trusted community members are available
- Maintain full control over privacy and connections
- Build reputation through helping others

## 🎨 Design Reference

Based on Figma designs with the following screens:
1. **Onboarding Flow:**
   - Intro screen ("You're never alone")
   - How It Works (3-step explanation)
   - Privacy & Control
   - Permissions Setup

2. **Main Screens:**
   - Home/Idle Mode (tap to activate presence)
   - Active Aura (Safety Mode) - shows nearby helpers
   - Helper Mode - navigation to person in need
   - End/Safe Confirmation - with presence points

3. **Profile & Settings:**
   - Profile & Reputation (presence score, badges)
   - Settings (helper mode toggle, emergency number)
   - Legal & Info

## 🛠 Tech Stack

- **Framework:** Expo SDK 51.0.0 ✅
- **Language:** TypeScript 5.3.3 ✅
- **Navigation:** React Navigation 7.x ✅
- **State Management:** Zustand 5.0.9 ✅
- **Styling:** StyleSheet (React Native) ✅
- **Platform:** iOS (POC) → Android (future)

## 🔐 Authentication

Multiple login options for easy user access:
- ✅ Google Sign-In
- ✅ Apple Sign-In
- ✅ Phone Number Authentication
- ✅ Email/Password

**Implementation:** Using Expo AuthSession and Firebase Auth (or Supabase - TBD)

## 📍 Location Services

**Required Features:**
- ✅ Background location updates
- ✅ Geofencing capabilities
- ✅ Distance calculations for "nearby" helpers
- ✅ Real-time location tracking during active sessions

**Implementation:** Using `expo-location` with background location permissions

## 🎯 Core Features

### Helper Matching System
- **Proximity-based:** Find helpers based on distance
- **Reputation-based:** Prioritize helpers with higher presence scores
- **Combined algorithm:** Balance proximity and reputation for best matches

### Presence Score System
- **Storage:** Full database tracking of user scores
- **UI Display:** Real-time score updates in profile
- **Scoring Factors:**
  - Response rate
  - Verification status
  - Community participation
  - Time-based badges (Night Guardian, etc.)

### Real-time Features
- Location tracking and sharing
- Push notifications for helper requests
- Live presence status updates
- Distance calculations

## 📂 Project Structure

```
AURA/
├── app/                    # Screen components
│   ├── onboarding/        # Onboarding flow screens
│   ├── home/              # Main app screens
│   ├── profile/           # Profile and settings
│   └── components/        # Reusable UI components
├── services/              # Business logic
│   ├── auth/             # Authentication services
│   ├── location/         # Location tracking
│   ├── matching/         # Helper matching algorithm
│   └── notifications/    # Push notifications
├── navigation/            # Navigation setup
├── types/                 # TypeScript types
├── constants/             # App constants
├── hooks/                 # Custom React hooks
└── utils/                 # Utility functions
```

## 🚀 Development Approach

**Build Strategy:** Page by page, connecting screens as we go
- Start with onboarding flow
- Connect to authentication
- Build main screens
- Add location services
- Implement matching algorithm
- Add profile and settings

**POC Focus:**
- iOS only for initial build
- Core functionality first
- Polish and Android expansion later

## 📋 Implementation Checklist

### Phase 1: Setup & Onboarding
- [x] Initialize Expo project with TypeScript ✅
- [x] Set up navigation structure ✅
- [ ] Build onboarding screens (4 screens)
- [ ] Implement skip/next navigation

### Phase 2: Authentication
- [ ] Set up authentication providers
- [ ] Google Sign-In integration
- [ ] Apple Sign-In integration
- [ ] Phone authentication
- [ ] Email/Password authentication
- [ ] Auth state management

### Phase 3: Core Features
- [ ] Location services setup
- [ ] Background location tracking
- [ ] Home/Idle screen
- [ ] Active Aura (Safety Mode) screen
- [ ] Helper Mode screen
- [ ] Presence activation system

### Phase 4: Matching & Notifications
- [ ] Helper matching algorithm
- [ ] Proximity calculations
- [ ] Reputation scoring system
- [ ] Push notifications setup
- [ ] Real-time updates

### Phase 5: Profile & Settings
- [ ] Profile screen with presence score
- [ ] Reputation badges system
- [ ] Settings screen
- [ ] Helper Mode toggle
- [ ] Emergency number configuration

### Phase 6: Polish & Testing
- [ ] UI/UX refinements
- [ ] Icon and asset integration (when available)
- [ ] Custom fonts (when available)
- [ ] iOS testing
- [ ] Bug fixes and optimization

## 🔧 Dependencies (Installed ✅)

### Core
- ✅ `expo@51.0.0` - Expo SDK
- ✅ `react-native@0.74.5` - React Native core
- ✅ `typescript@5.3.3` - TypeScript support

### Navigation
- ✅ `@react-navigation/native@7.1.26` - Navigation core
- ✅ `@react-navigation/stack@7.6.13` - Stack navigator
- ✅ `@react-navigation/bottom-tabs@7.9.0` - Tab navigator
- ✅ `react-native-screens@3.31.1` - Native screens
- ✅ `react-native-safe-area-context@4.10.5` - Safe areas

### Authentication
- ✅ `expo-auth-session@5.5.2` - OAuth providers
- ✅ `expo-crypto@13.0.2` - Crypto utilities
- ✅ `expo-web-browser@13.0.3` - Web browser
- ⏭️ Backend: Firebase or Supabase (to be decided)

### Location
- ✅ `expo-location@17.0.1` - Location services
- ✅ `expo-task-manager@11.8.2` - Background tasks

### Notifications
- ✅ `expo-notifications@0.28.19` - Push notifications
- ✅ `expo-device@6.0.2` - Device info

### UI/State
- ✅ `zustand@5.0.9` - State management
- ✅ `react-native-reanimated@3.10.1` - Animations
- ✅ `react-native-gesture-handler@2.16.1` - Gestures
- ✅ `@react-native-async-storage/async-storage@1.23.1` - Local storage

## 🎨 Design System

**Color Palette:**
- Primary: Purple shades (from Figma designs)
- Background: White/Light Grey
- Accent: Various purple tones

**Typography:**
- System fonts initially
- Custom fonts to be added later

**Icons:**
- Placeholder icons initially
- Final assets to be integrated later

## 📝 Notes for Future Development

- **Backend:** Need to decide on backend solution (Firebase, Supabase, or custom API)
- **Database:** User profiles, presence scores, location data, reputation badges
- **Real-time:** WebSocket or Firebase Realtime Database for live updates
- **Testing:** iOS simulator and physical device testing
- **Deployment:** Expo EAS Build for iOS App Store submission

## 🖥️ Development Environment

### System Requirements ✅
- **macOS:** 15.5 Sequoia (Latest)
- **Node.js:** v20.11.0 (LTS)
- **npm:** 10.2.4
- **Homebrew:** 5.0.8
- **CocoaPods:** 1.16.2
- **Git:** 2.39.5
- **Expo CLI:** 0.18.31

### Project Status ✅
- ✅ Expo SDK 51.0.0 configured
- ✅ iOS native project generated
- ✅ All dependencies installed
- ✅ TypeScript configured
- ✅ Project structure created
- ✅ Git connected to GitHub
- ✅ Ready for development

See [INSTALLATION_LIST.md](./INSTALLATION_LIST.md) for complete installation details.

## 🔄 Version History

- **v1.0.0** - Complete setup, all dependencies installed, iOS project ready
- **v0.1.0** - Initial setup and README documentation
- **POC** - Proof of Concept for iOS

## 📞 Support

For questions or issues during development, refer to:
- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation Docs](https://reactnavigation.org/)
- Project-specific notes in code comments

---

**Status:** ✅ **READY FOR DEVELOPMENT**
**Platform:** iOS (Primary) → Android (Future)
**Last Updated:** December 30, 2025
**Health Check:** 100% Complete ✅
