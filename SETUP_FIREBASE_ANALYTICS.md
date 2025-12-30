# 📊 Setting Up Firebase Analytics

## Step 1: Enable Analytics in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your **AURA** project
3. In the left sidebar, click **"Analytics"** (or "Google Analytics")
4. If not enabled, click **"Enable Google Analytics"**
5. Select or create a **Google Analytics account**
6. Click **"Enable Analytics"**

## Step 2: Install Firebase Analytics

For Expo projects, we'll use `expo-firebase-analytics` or Firebase JS SDK:

```bash
# Option 1: Using Expo Firebase Analytics (Recommended for Expo)
npx expo install expo-firebase-analytics

# Option 2: Using Firebase JS SDK (Already installed)
# Firebase Analytics is included in firebase package
```

## Step 3: Initialize Analytics

### Option A: Using Expo Firebase Analytics

1. **Update `App.tsx`** to initialize analytics:

```typescript
import * as Analytics from 'expo-firebase-analytics';

// Initialize analytics
Analytics.setAnalyticsCollectionEnabled(true);
```

### Option B: Using Firebase JS SDK

1. **Create `services/analytics/analyticsService.ts`**:

```typescript
import { getAnalytics, logEvent, setAnalyticsCollectionEnabled, Analytics } from 'firebase/analytics';
import { app } from '../../firebase/config';

let analytics: Analytics | null = null;

// Initialize analytics
if (app) {
  try {
    analytics = getAnalytics(app);
    setAnalyticsCollectionEnabled(analytics, true);
  } catch (error) {
    console.warn('Analytics initialization failed:', error);
  }
}

export const analyticsService = {
  // Track custom events
  logEvent: (eventName: string, params?: Record<string, any>) => {
    if (analytics) {
      logEvent(analytics, eventName, params);
    }
  },
  
  // Track SOS activation
  logSOSActivation: (userId: string, location?: { lat: number; lng: number }) => {
    analyticsService.logEvent('sos_activated', {
      user_id: userId,
      timestamp: new Date().toISOString(),
      ...(location && { location }),
    });
  },
  
  // Track helper response
  logHelperResponse: (helperId: string, sosId: string, distance: number) => {
    analyticsService.logEvent('helper_responded', {
      helper_id: helperId,
      sos_id: sosId,
      distance_meters: distance,
      timestamp: new Date().toISOString(),
    });
  },
  
  // Track app screen views
  logScreenView: (screenName: string, screenClass?: string) => {
    analyticsService.logEvent('screen_view', {
      screen_name: screenName,
      screen_class: screenClass || screenName,
    });
  },
  
  // Track user sign up
  logSignUp: (method: string) => {
    analyticsService.logEvent('sign_up', {
      method, // 'apple', 'google', 'phone', 'email'
    });
  },
  
  // Track user login
  logLogin: (method: string) => {
    analyticsService.logEvent('login', {
      method,
    });
  },
};
```

## Step 4: Track Key Events

### Track SOS Activations

In `app/home/HomeScreen.tsx` or wherever SOS is activated:

```typescript
import { analyticsService } from '../../services/analytics/analyticsService';

// When SOS is activated
const handleSOSActivate = async () => {
  // ... your SOS activation logic ...
  
  // Track event
  analyticsService.logSOSActivation(userId, {
    lat: location.latitude,
    lng: location.longitude,
  });
};
```

### Track Helper Responses

In `app/home/HelperAlertScreen.tsx`:

```typescript
import { analyticsService } from '../../services/analytics/analyticsService';

// When helper responds
const handleHelperResponse = async (sosId: string, distance: number) => {
  // ... your helper response logic ...
  
  // Track event
  analyticsService.logHelperResponse(helperId, sosId, distance);
};
```

### Track Screen Views

In `navigation/AppNavigator.tsx`:

```typescript
import { analyticsService } from '../services/analytics/analyticsService';
import { useNavigation } from '@react-navigation/native';

// Add navigation listener to track screen views
useEffect(() => {
  const unsubscribe = navigation.addListener('state', (e) => {
    const currentRoute = navigation.getCurrentRoute();
    if (currentRoute) {
      analyticsService.logScreenView(currentRoute.name);
    }
  });
  
  return unsubscribe;
}, [navigation]);
```

## Step 5: Test Analytics

1. **Enable debug mode** in Firebase Console:
   - Go to Analytics > DebugView
   - Enable debug mode on your device

2. **Trigger events** in your app:
   - Activate SOS
   - Respond as helper
   - Navigate between screens

3. **Check DebugView** - events should appear in real-time

## Step 6: View Analytics Data

1. Go to Firebase Console > Analytics
2. View:
   - **Events** - All custom events
   - **User engagement** - Active users, retention
   - **Conversions** - Key user actions
   - **Audience** - User demographics

## Key Events to Track

### Critical Events (Must Track)
- ✅ `sos_activated` - When user activates SOS
- ✅ `helper_responded` - When helper responds to SOS
- ✅ `sos_resolved` - When SOS is resolved
- ✅ `sign_up` - User registration
- ✅ `login` - User login

### Important Events (Should Track)
- `screen_view` - Screen navigation
- `helper_mode_enabled` - Helper mode toggled on
- `location_permission_granted` - Location permission
- `notification_permission_granted` - Notification permission
- `report_submitted` - User reports another user
- `points_earned` - User earns reputation points

## Privacy & Compliance

### GDPR Compliance
- Analytics data is anonymized by default
- Users can opt-out (if required by law)
- No PII (Personally Identifiable Information) in events

### Best Practices
- Don't track sensitive data (passwords, exact addresses)
- Use user IDs, not names or emails
- Anonymize location data (use approximate coordinates)

## Troubleshooting

### "Analytics not showing data"
- Wait 24-48 hours for data to appear (real-time only in DebugView)
- Check that Analytics is enabled in Firebase Console
- Verify events are being logged (check console logs)

### "Events not appearing in DebugView"
- Enable debug mode on device
- Check that `setAnalyticsCollectionEnabled(true)` is called
- Verify Firebase is properly initialized

### "Analytics not working in Expo Go"
- Some analytics features require a development build
- Basic event tracking should work in Expo Go
- Full analytics requires native build

## Next Steps

After Analytics is set up:
1. ✅ Test that events appear in DebugView
2. ✅ Set up custom dashboards in Firebase Console
3. ✅ Configure conversion events
4. ✅ Set up audience segments
5. ✅ Create custom reports

---

**Status:** Ready to configure
**Time Required:** 15-30 minutes
**Next:** Create development build

