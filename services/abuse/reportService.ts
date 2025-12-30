import { collection, addDoc, doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Report } from '../../types/firebase';

class ReportService {
  /**
   * Report a user
   */
  async reportUser(
    reporterId: string,
    reportedUserId: string,
    reason: 'abuse' | 'spam' | 'inappropriate' | 'other',
    description?: string,
    sosRequestId?: string
  ): Promise<string | null> {
    try {
      const reportRef = await addDoc(collection(db, 'reports'), {
        reporterId,
        reportedUserId,
        sosRequestId,
        reason,
        description,
        status: 'pending',
        createdAt: serverTimestamp(),
      } as Omit<Report, 'id'>);

      return reportRef.id;
    } catch (error) {
      console.error('Error reporting user:', error);
      return null;
    }
  }

  /**
   * Block a user (stored in user's blocked list)
   */
  async blockUser(userId: string, blockedUserId: string): Promise<void> {
    try {
      const userDoc = doc(db, 'users', userId);
      
      // Get current blocked list
      const userSnap = await getDoc(userDoc);
      const blockedUsers = userSnap.data()?.blockedUsers || [];
      
      if (!blockedUsers.includes(blockedUserId)) {
        await updateDoc(userDoc, {
          blockedUsers: [...blockedUsers, blockedUserId],
        });
      }
    } catch (error) {
      console.error('Error blocking user:', error);
      throw error;
    }
  }

  /**
   * Check if user is blocked
   */
  async isUserBlocked(userId: string, otherUserId: string): Promise<boolean> {
    try {
      const userDoc = doc(db, 'users', userId);
      const userSnap = await getDoc(userDoc);
      const blockedUsers = userSnap.data()?.blockedUsers || [];
      return blockedUsers.includes(otherUserId);
    } catch (error) {
      console.error('Error checking if user is blocked:', error);
      return false;
    }
  }
}

export const reportService = new ReportService();

