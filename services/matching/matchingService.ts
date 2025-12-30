import { collection, query, where, getDocs, limit, orderBy } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { db, functions } from '../../firebase/config';
import { FirestoreUser, SOSRequest } from '../../types/firebase';
import { locationService } from '../location/locationService';

class MatchingService {
  /**
   * Find nearby helpers using Cloud Function
   * This calls a Cloud Function that handles geohash-based radius matching
   */
  async findNearbyHelpers(
    latitude: number,
    longitude: number,
    radiusMeters: number = 2000, // Default 2km
    maxResults: number = 10
  ): Promise<Array<{ user: FirestoreUser; distance: number }>> {
    try {
      // Call Cloud Function for efficient geohash-based matching
      const findHelpers = httpsCallable(functions, 'findNearbyHelpers');
      const result = await findHelpers({
        latitude,
        longitude,
        radiusMeters,
        maxResults,
      });

      const data = result.data as any;
      return data.helpers || [];
    } catch (error) {
      console.error('Error finding nearby helpers:', error);
      // Fallback to client-side matching if Cloud Function fails
      return this.findNearbyHelpersFallback(latitude, longitude, radiusMeters, maxResults);
    }
  }

  /**
   * Fallback: Client-side helper matching (less efficient, but works without Cloud Functions)
   */
  private async findNearbyHelpersFallback(
    latitude: number,
    longitude: number,
    radiusMeters: number,
    maxResults: number
  ): Promise<Array<{ user: FirestoreUser; distance: number }>> {
    try {
      // Query all active helpers (this is less efficient, but works)
      const usersRef = collection(db, 'users');
      const q = query(
        usersRef,
        where('isHelper', '==', true),
        where('location', '!=', null),
        limit(50) // Limit to prevent too many reads
      );

      const snapshot = await getDocs(q);
      const helpers: Array<{ user: FirestoreUser; distance: number }> = [];

      snapshot.forEach((doc) => {
        const user = { id: doc.id, ...doc.data() } as FirestoreUser;
        if (user.location) {
          const distance = locationService.calculateDistance(
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

      // Sort by distance and limit results
      helpers.sort((a, b) => a.distance - b.distance);
      return helpers.slice(0, maxResults);
    } catch (error) {
      console.error('Error in fallback helper matching:', error);
      return [];
    }
  }

  /**
   * Filter helpers by reputation
   */
  filterByReputation(
    helpers: Array<{ user: FirestoreUser; distance: number }>,
    minReputation: number = 0
  ): Array<{ user: FirestoreUser; distance: number }> {
    return helpers.filter((helper) => helper.user.reputation >= minReputation);
  }

  /**
   * Sort helpers by distance and reputation
   */
  sortHelpers(
    helpers: Array<{ user: FirestoreUser; distance: number }>
  ): Array<{ user: FirestoreUser; distance: number }> {
    return helpers.sort((a, b) => {
      // Primary sort: distance (closer is better)
      const distanceDiff = a.distance - b.distance;
      if (Math.abs(distanceDiff) > 100) {
        // If distance difference is significant (>100m), prioritize distance
        return distanceDiff;
      }
      // Secondary sort: reputation (higher is better)
      return b.user.reputation - a.user.reputation;
    });
  }
}

export const matchingService = new MatchingService();

