// Cloud Functions for AURA
// This file contains the Cloud Functions code that should be deployed to Firebase
// To deploy: firebase deploy --only functions

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin (if not already initialized)
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

/**
 * Find nearby helpers using geohash
 * Called when SOS is created
 */
export const findNearbyHelpers = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { latitude, longitude, radiusMeters = 2000, maxResults = 10 } = data;

  try {
    // Simple geohash-based search (for MVP)
    // In production, use a proper geohash library
    const helpersRef = db.collection('users');
    const snapshot = await helpersRef
      .where('isHelper', '==', true)
      .where('location', '!=', null)
      .limit(50) // Limit initial query
      .get();

    const helpers: Array<{ user: any; distance: number }> = [];

    snapshot.forEach((doc) => {
      const user = { id: doc.id, ...doc.data() };
      if (user.location) {
        const distance = calculateDistance(
          latitude,
          longitude,
          user.location.lat,
          user.location.lng
        );

        if (distance <= radiusMeters) {
          helpers.push({ user, distance });
        }
      }
    });

    // Sort by distance
    helpers.sort((a, b) => a.distance - b.distance);

    // Filter by reputation (new users have limited access)
    const filteredHelpers = helpers.filter((h) => {
      // New users (reputation < 10) can only help within 500m
      if (h.user.reputation < 10 && h.distance > 500) {
        return false;
      }
      return true;
    });

    return {
      helpers: filteredHelpers.slice(0, maxResults),
    };
  } catch (error: any) {
    throw new functions.https.HttpsError('internal', error.message);
  }
});

/**
 * Calculate and award points after SOS closure
 */
export const calculatePoints = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { sosId, userId } = data;

  try {
    const sosRef = db.collection('sosRequests').doc(sosId);
    const sosDoc = await sosRef.get();

    if (!sosDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'SOS request not found');
    }

    const sosData = sosDoc.data();
    const helpers = sosData?.helpers || [];

    // Find helper who responded
    const helper = helpers.find((h: any) => h.userId === userId && h.status === 'arrived');
    if (!helper) {
      return { points: 0 };
    }

    // Calculate points
    let points = 50; // Base points

    // Bonus for quick response (< 2 minutes)
    const responseTime = helper.respondedAt ? (Date.now() - helper.respondedAt) / 1000 : 0;
    if (responseTime < 120) {
      points += 25; // Quick response bonus
    }

    // Bonus for close distance (< 500m)
    if (helper.distance < 500) {
      points += 25; // Close distance bonus
    }

    // Daily cap: max 200 points per day
    const today = new Date().toISOString().split('T')[0];
    const repRef = db.collection('reputation').doc(userId);
    const repDoc = await repRef.get();
    const repData = repDoc.data();

    const dailyPoints = repData?.dailyPoints || [];
    const todayPoints = dailyPoints.find((p: any) => p.date === today);
    const todayTotal = (todayPoints?.points || 0) + points;

    if (todayTotal > 200) {
      points = Math.max(0, 200 - (todayPoints?.points || 0));
    }

    // Update reputation
    const newDailyPoints = dailyPoints.filter((p: any) => p.date !== today);
    newDailyPoints.push({ date: today, points: (todayPoints?.points || 0) + points });

    await repRef.set(
      {
        userId,
        points: admin.firestore.FieldValue.increment(points),
        totalHelps: admin.firestore.FieldValue.increment(1),
        dailyPoints: newDailyPoints,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    // Check for badges and streaks
    await checkBadgesAndStreaks(userId, repData);

    return { points };
  } catch (error: any) {
    throw new functions.https.HttpsError('internal', error.message);
  }
});

/**
 * Check and award badges/streaks
 */
async function checkBadgesAndStreaks(userId: string, currentRep: any) {
  const repRef = db.collection('reputation').doc(userId);
  const badges = currentRep?.badges || [];
  const today = new Date().toISOString().split('T')[0];

  // Check for Night Guardian badge (responded after 8 PM)
  const now = new Date();
  if (now.getHours() >= 20 && !badges.find((b: any) => b.name === 'Night Guardian')) {
    badges.push({
      id: 'night-guardian',
      name: 'Night Guardian',
      earnedAt: Date.now(),
    });
  }

  // Check for Quick Responder badge (response time < 1 minute)
  // This would need to be tracked per response

  // Check for First Responder badge (helped 5 people)
  if (currentRep?.totalHelps >= 5 && !badges.find((b: any) => b.name === 'First Responder')) {
    badges.push({
      id: 'first-responder',
      name: 'First Responder',
      earnedAt: Date.now(),
    });
  }

  // Update streaks
  const lastActiveDate = currentRep?.streaks?.lastActiveDate || '';
  const streaks = currentRep?.streaks || { current: 0, longest: 0, lastActiveDate: '' };

  if (lastActiveDate === today) {
    // Already active today, no change
  } else if (lastActiveDate === getYesterday()) {
    // Consecutive day
    streaks.current = (streaks.current || 0) + 1;
    streaks.longest = Math.max(streaks.longest, streaks.current);
  } else {
    // Streak broken
    streaks.current = 1;
  }

  streaks.lastActiveDate = today;

  await repRef.update({
    badges,
    streaks,
  });
}

function getYesterday(): string {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().split('T')[0];
}

/**
 * Calculate distance between two points (Haversine formula)
 */
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

/**
 * Rate limit check (called before creating SOS)
 */
export const rateLimitCheck = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const userId = context.auth.uid;
  const MAX_SOS_PER_HOUR = 3;
  const MAX_SOS_PER_DAY = 10;

  try {
    const now = Date.now();
    const oneHourAgo = now - 60 * 60 * 1000;
    const oneDayAgo = now - 24 * 60 * 60 * 1000;

    const sosRef = db.collection('sosRequests');
    const snapshot = await sosRef
      .where('userId', '==', userId)
      .where('createdAt', '>=', admin.firestore.Timestamp.fromMillis(oneDayAgo))
      .orderBy('createdAt', 'desc')
      .get();

    const recentSOS = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        createdAt: data.createdAt?.toMillis?.() || data.createdAt || 0,
      };
    });

    const last24Hours = recentSOS.filter((sos) => sos.createdAt >= oneDayAgo);
    if (last24Hours.length >= MAX_SOS_PER_DAY) {
      return {
        allowed: false,
        reason: `Maximum ${MAX_SOS_PER_DAY} SOS requests per day.`,
      };
    }

    const lastHour = recentSOS.filter((sos) => sos.createdAt >= oneHourAgo);
    if (lastHour.length >= MAX_SOS_PER_HOUR) {
      return {
        allowed: false,
        reason: `Maximum ${MAX_SOS_PER_HOUR} SOS requests per hour.`,
      };
    }

    return { allowed: true };
  } catch (error: any) {
    throw new functions.https.HttpsError('internal', error.message);
  }
});

/**
 * Send push notifications to helpers when SOS is created
 * Triggered by Firestore onCreate trigger
 */
export const sendSOSNotifications = functions.firestore
  .document('sosRequests/{sosId}')
  .onCreate(async (snap, context) => {
    const sosData = snap.data();
    const sosId = context.params.sosId;

    // Find nearby helpers (reuse findNearbyHelpers logic)
    const helpersRef = db.collection('users');
    const snapshot = await helpersRef
      .where('isHelper', '==', true)
      .where('location', '!=', null)
      .limit(20)
      .get();

    const notifications: Promise<void>[] = [];

    snapshot.forEach((doc) => {
      const helper = doc.data();
      if (helper.location && helper.fcmToken) {
        const distance = calculateDistance(
          sosData.location.lat,
          sosData.location.lng,
          helper.location.lat,
          helper.location.lng
        );

        if (distance <= 2000) {
          // Send notification
          const message = {
            notification: {
              title: 'Someone nearby needs help',
              body: `${Math.round(distance)}m away`,
            },
            data: {
              type: 'sos_alert',
              sosId,
              distance: distance.toString(),
            },
            token: helper.fcmToken,
          };

          notifications.push(
            admin.messaging().send(message).catch((error) => {
              console.error('Error sending notification:', error);
            })
          );
        }
      }
    });

    await Promise.all(notifications);
  });

