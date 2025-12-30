import { collection, query, where, getDocs, orderBy, limit, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { SOSRequest } from '../../types/firebase';

class RateLimitService {
  private readonly MAX_SOS_PER_HOUR = 3;
  private readonly MAX_SOS_PER_DAY = 10;

  /**
   * Check if user can send SOS (rate limit check)
   */
  async canSendSOS(userId: string): Promise<{ allowed: boolean; reason?: string }> {
    try {
      const now = Date.now();
      const oneHourAgo = now - 60 * 60 * 1000;
      const oneDayAgo = now - 24 * 60 * 60 * 1000;

      // Get recent SOS requests
      const sosRef = collection(db, 'sosRequests');
      const q = query(
        sosRef,
        where('userId', '==', userId),
        where('createdAt', '>=', Timestamp.fromMillis(oneDayAgo)),
        orderBy('createdAt', 'desc')
      );

      const snapshot = await getDocs(q);
      const recentSOS: SOSRequest[] = [];
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        const createdAt = data.createdAt?.toMillis?.() || data.createdAt || 0;
        recentSOS.push({
          id: doc.id,
          ...data,
          createdAt,
        } as SOSRequest);
      });

      // Check daily limit
      const last24Hours = recentSOS.filter((sos) => sos.createdAt >= oneDayAgo);
      if (last24Hours.length >= this.MAX_SOS_PER_DAY) {
        return {
          allowed: false,
          reason: `Maximum ${this.MAX_SOS_PER_DAY} SOS requests per day. Please wait before sending another.`,
        };
      }

      // Check hourly limit
      const lastHour = recentSOS.filter((sos) => sos.createdAt >= oneHourAgo);
      if (lastHour.length >= this.MAX_SOS_PER_HOUR) {
        return {
          allowed: false,
          reason: `Maximum ${this.MAX_SOS_PER_HOUR} SOS requests per hour. Please wait before sending another.`,
        };
      }

      return { allowed: true };
    } catch (error) {
      console.error('Error checking rate limit:', error);
      // On error, allow (fail open for safety)
      return { allowed: true };
    }
  }

  /**
   * Get time until next SOS allowed (in seconds)
   */
  async getTimeUntilNextSOS(userId: string): Promise<number> {
    try {
      const now = Date.now();
      const oneHourAgo = now - 60 * 60 * 1000;

      const sosRef = collection(db, 'sosRequests');
      const q = query(
        sosRef,
        where('userId', '==', userId),
        where('createdAt', '>=', Timestamp.fromMillis(oneHourAgo)),
        orderBy('createdAt', 'desc'),
        limit(1)
      );

      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        return 0;
      }

      const lastSOS = snapshot.docs[0].data();
      const createdAt = lastSOS.createdAt?.toMillis?.() || lastSOS.createdAt || 0;
      const timeSinceLastSOS = now - createdAt;
      const timeUntilNext = 60 * 60 * 1000 - timeSinceLastSOS; // 1 hour

      return Math.max(0, Math.floor(timeUntilNext / 1000));
    } catch (error) {
      console.error('Error getting time until next SOS:', error);
      return 0;
    }
  }
}

export const rateLimitService = new RateLimitService();

