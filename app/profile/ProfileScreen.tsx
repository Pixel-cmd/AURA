import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { Colors } from '../../constants/Colors';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../stores/authStore';
import { useReputationStore } from '../../stores/reputationStore';

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Profile'>;

export default function ProfileScreen() {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const { t } = useTranslation();
  const { user, profile } = useAuthStore();
  const { reputation, subscribeToReputation } = useReputationStore();

  useEffect(() => {
    if (user) {
      const unsubscribe = subscribeToReputation(user.uid, () => {});
      return unsubscribe;
    }
  }, [user, subscribeToReputation]);

  const getActiveStreak = () => {
    if (!reputation?.streaks) return 0;
    return reputation.streaks.current || 0;
  };

  const getPresenceScore = () => {
    if (!reputation) return 0;
    return reputation.points || 0;
  };

  const badges = reputation?.badges || [];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('profile.title')}</Text>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => navigation.navigate('Profile')}
        >
          <Text style={styles.settingsIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {profile?.firstName?.[0] || '?'}
            </Text>
          </View>
          <Text style={styles.name}>
            {profile?.firstName || 'User'} {profile?.lastName || ''}
          </Text>
          <Text style={styles.role}>Community Helper</Text>

          {getActiveStreak() > 0 && (
            <View style={styles.streakContainer}>
              <Text style={styles.streakIcon}>🏃</Text>
              <Text style={styles.streakText}>
                {t('profile.activeStreak', { days: getActiveStreak() })}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.scoreSection}>
          <Text style={styles.scoreLabel}>{t('profile.presenceScore')}</Text>
          <Text style={styles.scoreValue}>{getPresenceScore()}</Text>
          <View style={styles.trustLevel}>
            <Text style={styles.trustIcon}>✓</Text>
            <Text style={styles.trustText}>{t('profile.trustLevel')}</Text>
          </View>
          <Text style={styles.description}>
            {t('profile.description')}
          </Text>
        </View>

        {badges.length > 0 && (
          <View style={styles.badgesSection}>
            <View style={styles.badgesHeader}>
              <Text style={styles.badgesTitle}>{t('profile.reputation')}</Text>
              <TouchableOpacity>
                <Text style={styles.viewAll}>{t('profile.viewAll')}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.badgesGrid}>
              {badges.slice(0, 4).map((badge, index) => (
                <View key={index} style={styles.badge}>
                  <Text style={styles.badgeIcon}>
                    {badge.name === 'Night Guardian' ? '🌙' :
                     badge.name === 'Quick Responder' ? '⚡' :
                     badge.name === 'Trusted Helper' ? '🛡️' :
                     badge.name === 'First Responder' ? '🔒' : '🏅'}
                  </Text>
                  <Text style={styles.badgeName}>{badge.name}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <TouchableOpacity
          style={styles.editButton}
          onPress={() => {}}
        >
          <Text style={styles.editButtonText}>{t('profile.editProfile')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
  },
  settingsButton: {
    padding: 10,
  },
  settingsIcon: {
    fontSize: 24,
  },
  content: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  role: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundLight,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  streakIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  streakText: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '600',
  },
  scoreSection: {
    backgroundColor: Colors.backgroundLight,
    padding: 24,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 8,
    letterSpacing: 1,
  },
  scoreValue: {
    fontSize: 64,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 12,
  },
  trustLevel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  trustIcon: {
    fontSize: 16,
    color: Colors.success,
    marginRight: 6,
  },
  trustText: {
    fontSize: 16,
    color: Colors.success,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  badgesSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  badgesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  badgesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  viewAll: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  badge: {
    width: '48%',
    backgroundColor: Colors.backgroundLight,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  badgeIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  badgeName: {
    fontSize: 12,
    color: Colors.text,
    fontWeight: '600',
    textAlign: 'center',
  },
  editButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 40,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});

