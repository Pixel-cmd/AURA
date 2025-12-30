import {
  PhoneAuthProvider,
  signInWithCredential,
  signOut as firebaseSignOut,
  User as FirebaseUser,
} from 'firebase/auth';
import * as AppleAuthentication from 'expo-apple-authentication';
import { Platform } from 'react-native';
import { auth, db } from '../../firebase/config';
import { collection, doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { FirestoreUser } from '../../types/firebase';
import * as Device from 'expo-device';

class AuthService {
  /**
   * Sign in with phone number
   */
  async signInWithPhone(phoneNumber: string): Promise<{ verificationId: string } | null> {
    try {
      // For Expo, we'll use a different approach
      // Phone auth in Expo requires custom implementation
      // This is a placeholder - actual implementation depends on your setup
      const provider = new PhoneAuthProvider(auth);
      const verificationId = await provider.verifyPhoneNumber(phoneNumber);
      return { verificationId };
    } catch (error) {
      console.error('Error signing in with phone:', error);
      return null;
    }
  }

  /**
   * Verify phone code
   */
  async verifyPhoneCode(verificationId: string, code: string): Promise<FirebaseUser | null> {
    try {
      const credential = PhoneAuthProvider.credential(verificationId, code);
      const userCredential = await signInWithCredential(auth, credential);
      return userCredential.user;
    } catch (error) {
      console.error('Error verifying phone code:', error);
      return null;
    }
  }

  /**
   * Sign in with Apple (iOS only)
   */
  async signInWithApple(): Promise<FirebaseUser | null> {
    if (Platform.OS !== 'ios') {
      throw new Error('Apple Sign-In is only available on iOS');
    }

    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (!credential.identityToken) {
        throw new Error('No identity token received from Apple');
      }

      // Create Firebase credential
      // Note: This requires additional Firebase setup for Apple Sign-In
      // For now, this is a placeholder structure
      // You'll need to implement the Firebase Apple provider
      
      return null; // Placeholder
    } catch (error: any) {
      if (error.code === 'ERR_REQUEST_CANCELED') {
        // User canceled
        return null;
      }
      console.error('Error signing in with Apple:', error);
      return null;
    }
  }

  /**
   * Create or update user profile in Firestore
   */
  async createUserProfile(
    userId: string,
    data: {
      phone?: string;
      firstName: string;
      lastName?: string;
      isHelper?: boolean;
    }
  ): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      const deviceId = Device.modelName || 'unknown';

      const userData: Partial<FirestoreUser> = {
        id: userId,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        isHelper: data.isHelper || false,
        reputation: 0,
        verified: !!data.phone, // Phone verification counts as verified
        createdAt: serverTimestamp() as any,
        lastActiveAt: serverTimestamp() as any,
        deviceId,
      };

      await setDoc(userRef, userData, { merge: true });
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
  }

  /**
   * Get user profile from Firestore
   */
  async getUserProfile(userId: string): Promise<FirestoreUser | null> {
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        return { id: userSnap.id, ...userSnap.data() } as FirestoreUser;
      }
      return null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  }

  /**
   * Sign out
   */
  async signOut(): Promise<void> {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }

  /**
   * Get current user
   */
  getCurrentUser(): FirebaseUser | null {
    return auth.currentUser;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return auth.currentUser !== null;
  }
}

export const authService = new AuthService();

