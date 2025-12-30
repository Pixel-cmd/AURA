import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { Colors } from '../../constants/Colors';
import { useTranslation } from 'react-i18next';
import { locationService } from '../../services/location/locationService';
import { notificationService } from '../../services/notifications/notificationService';
import { setOnboardingComplete } from '../../utils/onboardingStorage';

type PermissionsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Permissions'>;

export default function PermissionsScreen() {
  const navigation = useNavigation<PermissionsScreenNavigationProp>();
  const { t } = useTranslation();
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const handleLocationToggle = async (value: boolean) => {
    if (value) {
      const granted = await locationService.requestPermissions();
      if (granted) {
        setLocationEnabled(true);
      } else {
        Alert.alert(
          t('errors.locationDenied'),
          'Location permission is required for AURA to work properly.'
        );
        setLocationEnabled(false);
      }
    } else {
      setLocationEnabled(false);
    }
  };

  const handleNotificationsToggle = async (value: boolean) => {
    if (value) {
      const granted = await notificationService.requestPermissions();
      if (granted) {
        setNotificationsEnabled(true);
      } else {
        Alert.alert(
          t('errors.notificationDenied'),
          'Notifications are required to receive help alerts.'
        );
        setNotificationsEnabled(false);
      }
    } else {
      setNotificationsEnabled(false);
    }
  };

  const handleGrantPermissions = async () => {
    // Request both permissions
    const locationGranted = await locationService.requestPermissions();
    const notificationsGranted = await notificationService.requestPermissions();

    setLocationEnabled(locationGranted);
    setNotificationsEnabled(notificationsGranted);

    if (locationGranted && notificationsGranted) {
      // Mark onboarding as complete
      await setOnboardingComplete();
      navigation.navigate('Home');
    } else {
      Alert.alert(
        'Permissions Required',
        'Both location and notification permissions are required for AURA to work.'
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <Text style={styles.iconText}>🛡️</Text>
          </View>
        </View>

        <Text style={styles.title}>{t('onboarding.permissions.title')}</Text>
        <Text style={styles.subtitle}>{t('onboarding.permissions.subtitle')}</Text>

        <View style={styles.permissionsContainer}>
          <View style={styles.permissionItem}>
            <View style={styles.permissionIcon}>
              <Text style={styles.permissionIconText}>📍</Text>
            </View>
            <View style={styles.permissionContent}>
              <Text style={styles.permissionTitle}>
                {t('onboarding.permissions.location.title')}
              </Text>
              <Text style={styles.permissionDescription}>
                {t('onboarding.permissions.location.description')}
              </Text>
            </View>
            <Switch
              value={locationEnabled}
              onValueChange={handleLocationToggle}
              trackColor={{ false: Colors.border, true: Colors.primaryLight }}
              thumbColor={locationEnabled ? Colors.primary : Colors.textLight}
            />
          </View>

          <View style={styles.permissionItem}>
            <View style={styles.permissionIcon}>
              <Text style={styles.permissionIconText}>🔔</Text>
            </View>
            <View style={styles.permissionContent}>
              <Text style={styles.permissionTitle}>
                {t('onboarding.permissions.notifications.title')}
              </Text>
              <Text style={styles.permissionDescription}>
                {t('onboarding.permissions.notifications.description')}
              </Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={handleNotificationsToggle}
              trackColor={{ false: Colors.border, true: Colors.primaryLight }}
              thumbColor={notificationsEnabled ? Colors.primary : Colors.textLight}
            />
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.grantButton,
            (!locationEnabled || !notificationsEnabled) && styles.grantButtonDisabled,
          ]}
          onPress={handleGrantPermissions}
          disabled={!locationEnabled || !notificationsEnabled}
        >
          <Text style={styles.grantButtonText}>
            {t('common.next')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.setupLaterButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.setupLaterText}>
            {t('common.skip')}
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
    padding: 20,
    paddingTop: 40,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  permissionsContainer: {
    marginBottom: 40,
  },
  permissionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundLight,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  permissionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  permissionIconText: {
    fontSize: 24,
  },
  permissionContent: {
    flex: 1,
  },
  permissionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  permissionDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  grantButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 16,
  },
  grantButtonDisabled: {
    backgroundColor: Colors.border,
    opacity: 0.5,
  },
  grantButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  setupLaterButton: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  setupLaterText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
});

