import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Switch,
  Linking,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { Colors } from '../../constants/Colors';
import { useTranslation } from 'react-i18next';
import { useSOSStore } from '../../stores/sosStore';
import { useLocationStore } from '../../stores/locationStore';
import { useAuthStore } from '../../stores/authStore';
import { matchingService } from '../../services/matching/matchingService';
import { getEmergencyNumberForLocale } from '../../constants/emergencyNumbers';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const { activeSOS, createSOS } = useSOSStore();
  const { currentLocation, updateLocation } = useLocationStore();
  const [helperMode, setHelperMode] = useState(false);
  const [emergencyNumber, setEmergencyNumber] = useState('112');

  useEffect(() => {
    // Get emergency number for locale
    getEmergencyNumberForLocale().then(setEmergencyNumber);
    
    // Update location on mount
    updateLocation();
  }, []);

  useEffect(() => {
    // Update helper mode in Firestore
    if (user) {
      const userRef = doc(db, 'users', user.uid);
      updateDoc(userRef, { isHelper: helperMode });
    }
  }, [helperMode, user]);

  useEffect(() => {
    // Navigate to SOS active screen if there's an active SOS
    if (activeSOS) {
      navigation.navigate('SOSActive', { sosId: activeSOS.id });
    }
  }, [activeSOS, navigation]);

  const handleSOSPress = async () => {
    if (!user) {
      Alert.alert('Authentication Required', 'Please sign in to use SOS.');
      return;
    }

    if (!currentLocation) {
      Alert.alert(
        'Location Required',
        'Please enable location services to send SOS.'
      );
      await updateLocation();
      return;
    }

    try {
      // Check rate limit
      const { rateLimitService } = await import('../../services/abuse/rateLimitService');
      const rateLimit = await rateLimitService.canSendSOS(user.uid);
      
      if (!rateLimit.allowed) {
        Alert.alert('Rate Limit', rateLimit.reason || 'Please wait before sending another SOS.');
        return;
      }

      // Create SOS request
      const sosId = await createSOS(user.uid, {
        lat: currentLocation.latitude,
        lng: currentLocation.longitude,
        geohash: currentLocation.geohash,
      });

      if (sosId) {
        // Find nearby helpers (Cloud Function will handle this and send notifications)
        // The findNearbyHelpers Cloud Function is triggered when SOS is created
        
        navigation.navigate('SOSActive', { sosId });
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to send SOS request');
    }
  };

  const handleCallEmergency = () => {
    Linking.openURL(`tel:${emergencyNumber}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.appTitle}>{t('home.title')}</Text>

        <View style={styles.sosContainer}>
          <TouchableOpacity
            style={styles.sosButton}
            onPress={handleSOSPress}
            activeOpacity={0.8}
          >
            <View style={styles.sosButtonInner}>
              <Text style={styles.sosIcon}>🛡️</Text>
            </View>
          </TouchableOpacity>
          <Text style={styles.sosInstruction}>
            {t('home.sosButton')}
          </Text>
          <Text style={styles.sosSubtitle}>
            {t('home.sosSubtitle')}
          </Text>
        </View>

        <View style={styles.controlsContainer}>
          <View style={styles.helperModeContainer}>
            <Text style={styles.helperModeLabel}>
              {t('home.helperMode')}
            </Text>
            <Switch
              value={helperMode}
              onValueChange={setHelperMode}
              trackColor={{ false: Colors.border, true: Colors.primaryLight }}
              thumbColor={helperMode ? Colors.primary : Colors.textLight}
            />
          </View>

          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => navigation.navigate('Profile')}
          >
            <Text style={styles.settingsIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.emergencyButton}
          onPress={handleCallEmergency}
        >
          <Text style={styles.emergencyButtonText}>
            {t('home.callEmergency')} ({emergencyNumber})
          </Text>
        </TouchableOpacity>
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
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 60,
  },
  sosContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  sosButton: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
    marginBottom: 24,
  },
  sosButtonInner: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: Colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sosIcon: {
    fontSize: 80,
  },
  sosInstruction: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  sosSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  helperModeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  helperModeLabel: {
    fontSize: 16,
    color: Colors.text,
    marginRight: 12,
  },
  settingsButton: {
    padding: 10,
  },
  settingsIcon: {
    fontSize: 24,
  },
  emergencyButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  emergencyButtonText: {
    fontSize: 16,
    color: Colors.error,
    fontWeight: '600',
  },
});

