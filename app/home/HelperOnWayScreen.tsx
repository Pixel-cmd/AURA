import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { Colors } from '../../constants/Colors';
import { useTranslation } from 'react-i18next';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuthStore } from '../../stores/authStore';
import { locationService } from '../../services/location/locationService';
import { useLocationStore } from '../../stores/locationStore';
import { FirestoreUser } from '../../types/firebase';

type HelperOnWayScreenRouteProp = RouteProp<RootStackParamList, 'HelperOnWay'>;
type HelperOnWayScreenNavigationProp = StackNavigationProp<RootStackParamList, 'HelperOnWay'>;

export default function HelperOnWayScreen() {
  const navigation = useNavigation<HelperOnWayScreenNavigationProp>();
  const route = useRoute<HelperOnWayScreenRouteProp>();
  const { t } = useTranslation();
  const { sosId, userId } = route.params;
  const { user } = useAuthStore();
  const { currentLocation } = useLocationStore();
  const [userInNeed, setUserInNeed] = useState<FirestoreUser | null>(null);
  const [distance, setDistance] = useState<number>(0);
  const [direction, setDirection] = useState<string>('North');

  useEffect(() => {
    loadUserInNeed();
    updateDistance();
    const interval = setInterval(updateDistance, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, [userId, currentLocation]);

  const loadUserInNeed = async () => {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const userData = { id: userDoc.id, ...userDoc.data() } as FirestoreUser;
        setUserInNeed(userData);
      }
    } catch (error) {
      console.error('Error loading user:', error);
    }
  };

  const updateDistance = async () => {
    if (!currentLocation || !userInNeed?.location) return;

    const dist = locationService.calculateDistance(
      currentLocation.latitude,
      currentLocation.longitude,
      userInNeed.location.lat,
      userInNeed.location.lng
    );
    setDistance(dist);

    const dir = locationService.getDirection(
      currentLocation.latitude,
      currentLocation.longitude,
      userInNeed.location.lat,
      userInNeed.location.lng
    );
    setDirection(dir);
  };

  const handleImNearby = async () => {
    if (!user || !sosId) return;

    try {
      const sosRef = doc(db, 'sosRequests', sosId);
      const sosDoc = await sosRef.get();
      const sosData = sosDoc.data();

      if (sosData) {
        const helpers = sosData.helpers || [];
        const helperIndex = helpers.findIndex((h: any) => h.userId === user.uid);

        if (helperIndex >= 0) {
          helpers[helperIndex].status = 'arrived';
        }

        await updateDoc(sosRef, { helpers });

        // Navigate to closure screen
        navigation.navigate('Closure', { sosId });
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update status');
    }
  };

  const handleICant = async () => {
    if (!user || !sosId) return;

    Alert.alert(
      'Cancel Response',
      'Are you sure you can\'t make it?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          onPress: async () => {
            try {
              const sosRef = doc(db, 'sosRequests', sosId);
              const sosDoc = await sosRef.get();
              const sosData = sosDoc.data();

              if (sosData) {
                const helpers = sosData.helpers || [];
                const helperIndex = helpers.findIndex((h: any) => h.userId === user.uid);

                if (helperIndex >= 0) {
                  helpers[helperIndex].status = 'cancelled';
                  await updateDoc(sosRef, { helpers });
                }
              }

              navigation.goBack();
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to cancel');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <View style={styles.shieldIcon}>
            <Text style={styles.shieldText}>🛡️</Text>
          </View>
        </View>

        <Text style={styles.title}>{t('sos.helper.onWay.title')}</Text>

        {userInNeed && (
          <Text style={styles.userName}>
            {userInNeed.firstName || 'Someone'}
          </Text>
        )}

        <Text style={styles.distance}>
          ~{Math.round(distance)}m
        </Text>

        <View style={styles.compassContainer}>
          <Text style={styles.compassText}>N</Text>
          <View style={styles.compassNeedle} />
        </View>

        <Text style={styles.direction}>
          {t('sos.helper.onWay.direction', { direction })}
        </Text>

        <Text style={styles.privacy}>
          {t('sos.helper.onWay.privacy')}
        </Text>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.nearbyButton}
            onPress={handleImNearby}
          >
            <Text style={styles.nearbyButtonText}>
              ✈️ {t('sos.helper.onWay.imNearby')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cantButton}
            onPress={handleICant}
          >
            <Text style={styles.cantButtonText}>
              {t('sos.helper.onWay.iCant')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    padding: 10,
  },
  closeButtonText: {
    fontSize: 24,
    color: Colors.text,
  },
  header: {
    marginBottom: 30,
  },
  shieldIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shieldText: {
    fontSize: 50,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 20,
  },
  distance: {
    fontSize: 56,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 30,
  },
  compassContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.backgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  compassText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    position: 'absolute',
    top: 8,
  },
  compassNeedle: {
    width: 3,
    height: 50,
    backgroundColor: Colors.primary,
    borderRadius: 2,
    transform: [{ rotate: '45deg' }],
  },
  direction: {
    fontSize: 18,
    color: Colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  privacy: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 40,
    marginBottom: 60,
    lineHeight: 20,
  },
  actions: {
    width: '100%',
  },
  nearbyButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 16,
  },
  nearbyButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  cantButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  cantButtonText: {
    color: Colors.textSecondary,
    fontSize: 16,
  },
});

