import React, { useState } from 'react';
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
import { doc, updateDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuthStore } from '../../stores/authStore';
import { locationService } from '../../services/location/locationService';
import { useLocationStore } from '../../stores/locationStore';

type HelperAlertScreenRouteProp = RouteProp<RootStackParamList, 'HelperAlert'>;
type HelperAlertScreenNavigationProp = StackNavigationProp<RootStackParamList, 'HelperAlert'>;

export default function HelperAlertScreen() {
  const navigation = useNavigation<HelperAlertScreenNavigationProp>();
  const route = useRoute<HelperAlertScreenRouteProp>();
  const { t } = useTranslation();
  const { sosId, distance } = route.params;
  const { user } = useAuthStore();
  const { currentLocation } = useLocationStore();
  const [isResponding, setIsResponding] = useState(false);

  const handleImGoing = async () => {
    if (!user || !sosId) return;

    setIsResponding(true);
    try {
      // Update SOS request with helper response
      const sosRef = doc(db, 'sosRequests', sosId);
      const sosDoc = await sosRef.get();
      const sosData = sosDoc.data();

      if (sosData) {
        const helpers = sosData.helpers || [];
        const helperIndex = helpers.findIndex((h: any) => h.userId === user.uid);

        if (helperIndex >= 0) {
          helpers[helperIndex].status = 'responding';
          helpers[helperIndex].respondedAt = Date.now();
        } else {
          helpers.push({
            userId: user.uid,
            distance: distance || 0,
            status: 'responding',
            respondedAt: Date.now(),
          });
        }

        await updateDoc(sosRef, { helpers });

        // Create helper response document
        await addDoc(collection(db, 'helperResponses'), {
          sosRequestId: sosId,
          helperId: user.uid,
          status: 'accepted',
          distance: distance || 0,
          respondedAt: serverTimestamp(),
        });

        // Navigate to "on the way" screen
        navigation.replace('HelperOnWay', { sosId, userId: sosData.userId });
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to respond');
      setIsResponding(false);
    }
  };

  const handleICant = async () => {
    if (!user || !sosId) return;

    try {
      // Create declined response
      await addDoc(collection(db, 'helperResponses'), {
        sosRequestId: sosId,
        helperId: user.uid,
        status: 'declined',
        distance: distance || 0,
        respondedAt: serverTimestamp(),
      });

      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to respond');
    }
  };

  const getDirection = () => {
    if (!currentLocation) return 'North';
    // This would need the SOS location from Firestore
    // For now, return a placeholder
    return 'North-East';
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

        <Text style={styles.title}>{t('sos.helper.alert.title')}</Text>
        <Text style={styles.distance}>
          {t('sos.helper.alert.distance', { distance: Math.round(distance) })}
        </Text>

        <View style={styles.compassContainer}>
          <Text style={styles.compassText}>N</Text>
          <View style={styles.compassNeedle} />
        </View>

        <Text style={styles.direction}>
          {t('sos.helper.onWay.direction', { direction: getDirection() })}
        </Text>

        <Text style={styles.privacy}>
          {t('sos.helper.onWay.privacy')}
        </Text>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.goingButton]}
            onPress={handleImGoing}
            disabled={isResponding}
          >
            <Text style={styles.actionButtonText}>
              ✈️ {t('sos.helper.alert.imGoing')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.cantButton]}
            onPress={handleICant}
          >
            <Text style={styles.cantButtonText}>
              {t('sos.helper.alert.iCant')}
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
    marginBottom: 40,
  },
  shieldIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shieldText: {
    fontSize: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  distance: {
    fontSize: 48,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 40,
  },
  compassContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: Colors.backgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  compassText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    position: 'absolute',
    top: 10,
  },
  compassNeedle: {
    width: 4,
    height: 60,
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
  actionButton: {
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 16,
  },
  goingButton: {
    backgroundColor: Colors.primary,
  },
  cantButton: {
    backgroundColor: 'transparent',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  cantButtonText: {
    color: Colors.textSecondary,
    fontSize: 16,
  },
});

