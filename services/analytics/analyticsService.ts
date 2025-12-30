/**
 * Firebase Analytics Service
 * 
 * Provides analytics tracking for key events in the app
 * Essential for understanding user behavior and app performance
 */

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
  /**
   * Track custom events
   */
  logEvent: (eventName: string, params?: Record<string, any>) => {
    if (analytics) {
      try {
        logEvent(analytics, eventName, params);
      } catch (error) {
        console.warn('Failed to log analytics event:', error);
      }
    }
  },
  
  /**
   * Track SOS activation
   */
  logSOSActivation: (userId: string, location?: { lat: number; lng: number }) => {
    analyticsService.logEvent('sos_activated', {
      user_id: userId,
      timestamp: new Date().toISOString(),
      ...(location && { 
        latitude: location.lat,
        longitude: location.lng,
      }),
    });
  },
  
  /**
   * Track helper response
   */
  logHelperResponse: (helperId: string, sosId: string, distance: number) => {
    analyticsService.logEvent('helper_responded', {
      helper_id: helperId,
      sos_id: sosId,
      distance_meters: distance,
      timestamp: new Date().toISOString(),
    });
  },
  
  /**
   * Track SOS resolution
   */
  logSOSResolved: (sosId: string, resolvedBy: 'user' | 'helper' | 'timeout', pointsEarned?: number) => {
    analyticsService.logEvent('sos_resolved', {
      sos_id: sosId,
      resolved_by: resolvedBy,
      ...(pointsEarned && { points_earned: pointsEarned }),
      timestamp: new Date().toISOString(),
    });
  },
  
  /**
   * Track app screen views
   */
  logScreenView: (screenName: string, screenClass?: string) => {
    analyticsService.logEvent('screen_view', {
      screen_name: screenName,
      screen_class: screenClass || screenName,
    });
  },
  
  /**
   * Track user sign up
   */
  logSignUp: (method: 'apple' | 'google' | 'phone' | 'email') => {
    analyticsService.logEvent('sign_up', {
      method,
    });
  },
  
  /**
   * Track user login
   */
  logLogin: (method: 'apple' | 'google' | 'phone' | 'email') => {
    analyticsService.logEvent('login', {
      method,
    });
  },
  
  /**
   * Track helper mode toggle
   */
  logHelperModeToggle: (enabled: boolean) => {
    analyticsService.logEvent('helper_mode_toggled', {
      enabled,
    });
  },
  
  /**
   * Track permission granted
   */
  logPermissionGranted: (permission: 'location' | 'notifications') => {
    analyticsService.logEvent('permission_granted', {
      permission_type: permission,
    });
  },
  
  /**
   * Track user report
   */
  logUserReport: (reportedUserId: string, reason: string) => {
    analyticsService.logEvent('user_reported', {
      reported_user_id: reportedUserId,
      reason,
    });
  },
  
  /**
   * Track points earned
   */
  logPointsEarned: (userId: string, points: number, reason: string) => {
    analyticsService.logEvent('points_earned', {
      user_id: userId,
      points,
      reason,
    });
  },
};

