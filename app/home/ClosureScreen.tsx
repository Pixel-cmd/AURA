import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { Colors } from '../../constants/Colors';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../stores/authStore';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../../firebase/config';

type ClosureScreenRouteProp = RouteProp<RootStackParamList, 'Closure'>;
type ClosureScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Closure'>;

export default function ClosureScreen() {
  const navigation = useNavigation<ClosureScreenNavigationProp>();
  const route = useRoute<ClosureScreenRouteProp>();
  const { t } = useTranslation();
  const { sosId, points } = route.params;
  const { user } = useAuthStore();
  const [awardedPoints, setAwardedPoints] = useState(points || 0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Calculate and award points via Cloud Function
    if (sosId && user && !points) {
      calculatePoints();
    }
  }, [sosId, user]);

  const calculatePoints = async () => {
    if (!user || !sosId) return;

    setIsLoading(true);
    try {
      const calculatePointsFn = httpsCallable(functions, 'calculatePoints');
      const result = await calculatePointsFn({ sosId, userId: user.uid });
      const data = result.data as any;
      setAwardedPoints(data.points || 0);
    } catch (error) {
      console.error('Error calculating points:', error);
      // Fallback: award base points
      setAwardedPoints(50);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToHome = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <View style={styles.checkmarkCircle}>
            <Text style={styles.checkmark}>✓</Text>
          </View>
          <View style={styles.shieldIcon}>
            <Text style={styles.shieldText}>🛡️</Text>
          </View>
        </View>

        <Text style={styles.title}>{t('sos.closure.title')}</Text>
        <Text style={styles.subtitle}>{t('sos.closure.subtitle')}</Text>

        <View style={styles.pointsContainer}>
          <Text style={styles.pointsLabel}>{t('sos.closure.points')}</Text>
          <View style={styles.pointsDisplay}>
            <Text style={styles.pointsIcon}>👤</Text>
            <Text style={styles.pointsValue}>
              {t('sos.closure.pointsAwarded', { points: awardedPoints })}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.homeButton}
          onPress={handleBackToHome}
        >
          <Text style={styles.homeButtonText}>
            {t('sos.closure.backToHome')} →
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
  iconContainer: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    position: 'relative',
  },
  shieldIcon: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shieldText: {
    fontSize: 100,
  },
  checkmarkCircle: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: Colors.background,
  },
  checkmark: {
    fontSize: 32,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: Colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 40,
    marginBottom: 40,
    lineHeight: 26,
  },
  pointsContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  pointsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 12,
    letterSpacing: 1,
  },
  pointsDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundLight,
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 30,
  },
  pointsIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  pointsValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  homeButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 50,
    paddingVertical: 18,
    borderRadius: 30,
    minWidth: 250,
    alignItems: 'center',
  },
  homeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});

