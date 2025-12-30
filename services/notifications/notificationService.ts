import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';

// Check if running in Expo Go (notifications have limitations)
const isExpoGo = Constants.executionEnvironment === 'storeClient';

// Lazy load expo-notifications to avoid warnings in Expo Go
let Notifications: typeof import('expo-notifications') | null = null;

// Only import expo-notifications if not in Expo Go
if (!isExpoGo) {
  try {
    Notifications = require('expo-notifications');
    // Configure notification handler
    if (Notifications) {
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: true,
          shouldShowBanner: true,
          shouldShowList: true,
        }),
      });
    }
  } catch (error) {
    // Silently fail - notifications not available
  }
}

class NotificationService {
  /**
   * Request notification permissions
   */
  async requestPermissions(): Promise<boolean> {
    // In Expo Go, notifications have limitations - skip silently
    if (isExpoGo || !Notifications) {
      return false;
    }

    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        return false;
      }

      // For iOS, also request critical alerts
      if (Platform.OS === 'ios') {
        const { status: criticalStatus } = await Notifications.getPermissionsAsync();
        // Critical alerts require special permission
      }

      return true;
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  }

  /**
   * Check if notification permissions are granted
   */
  async hasPermissions(): Promise<boolean> {
    if (isExpoGo || !Notifications) {
      return false;
    }

    try {
      const { status } = await Notifications.getPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      return false;
    }
  }

  /**
   * Get FCM token for push notifications
   */
  async getFCMToken(): Promise<string | null> {
    // In Expo Go, FCM tokens are not fully supported
    if (isExpoGo || !Notifications) {
      return null;
    }

    try {
      // For Expo, we use Expo's notification token
      const token = await Notifications.getExpoPushTokenAsync({
        projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
      });
      return token.data;
    } catch (error) {
      console.error('Error getting FCM token:', error);
      return null;
    }
  }

  /**
   * Save FCM token to user profile
   */
  async saveTokenToProfile(userId: string, token: string): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        fcmToken: token,
        tokenUpdatedAt: new Date(),
      });
    } catch (error) {
      console.error('Error saving FCM token:', error);
    }
  }

  /**
   * Setup notification listeners
   */
  setupListeners(
    onNotificationReceived: (notification: any) => void,
    onNotificationTapped: (response: any) => void
  ): () => void {
    // In Expo Go, notification listeners have limitations
    if (isExpoGo || !Notifications) {
      // Return empty cleanup function
      return () => {};
    }

    // Foreground notification listener
    const receivedListener = Notifications.addNotificationReceivedListener(
      onNotificationReceived
    );

    // Background/quit notification listener
    const responseListener = Notifications.addNotificationResponseReceivedListener(
      onNotificationTapped
    );

    // Return cleanup function
    return () => {
      receivedListener.remove();
      responseListener.remove();
    };
  }

  /**
   * Schedule local notification (for testing or fallback)
   */
  async scheduleLocalNotification(
    title: string,
    body: string,
    data?: any
  ): Promise<string> {
    if (isExpoGo || !Notifications) {
      throw new Error('Notifications not available in Expo Go');
    }

    try {
      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data: data || {},
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: null, // Show immediately
      });
      return identifier;
    } catch (error) {
      console.error('Error scheduling notification:', error);
      throw error;
    }
  }

  /**
   * Cancel notification
   */
  async cancelNotification(identifier: string): Promise<void> {
    if (isExpoGo || !Notifications) {
      return;
    }

    try {
      await Notifications.cancelScheduledNotificationAsync(identifier);
    } catch (error) {
      console.error('Error canceling notification:', error);
    }
  }

  /**
   * Cancel all notifications
   */
  async cancelAllNotifications(): Promise<void> {
    if (isExpoGo || !Notifications) {
      return;
    }

    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Error canceling all notifications:', error);
    }
  }
}

export const notificationService = new NotificationService();

