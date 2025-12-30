import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Linking,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { Colors } from '../../constants/Colors';
import { useTranslation } from 'react-i18next';
import { useSOSStore } from '../../stores/sosStore';
import { getEmergencyNumberForLocale } from '../../constants/emergencyNumbers';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { FirestoreUser } from '../../types/firebase';

type SOSActiveScreenRouteProp = RouteProp<RootStackParamList, 'SOSActive'>;
type SOSActiveScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SOSActive'>;

interface HelperListItem {
  user: FirestoreUser;
  distance: number;
  status: string;
}

export default function SOSActiveScreen() {
  const navigation = useNavigation<SOSActiveScreenNavigationProp>();
  const route = useRoute<SOSActiveScreenRouteProp>();
  const { t } = useTranslation();
  const { sosId } = route.params;
  const { activeSOS, subscribeToSOS, closeSOS } = useSOSStore();
  const [helpers, setHelpers] = useState<HelperListItem[]>([]);
  const [emergencyNumber, setEmergencyNumber] = useState('112');

  useEffect(() => {
    getEmergencyNumberForLocale().then(setEmergencyNumber);
  }, []);

  useEffect(() => {
    if (!sosId) return;

    // Subscribe to SOS updates
    const unsubscribe = subscribeToSOS(sosId, async (sos) => {
      if (sos && sos.helpers.length > 0) {
        // Fetch helper details
        const helperDetails: HelperListItem[] = [];
        for (const helper of sos.helpers) {
          try {
            const userRef = collection(db, 'users');
            const q = query(userRef, where('__name__', '==', helper.userId));
            const snapshot = await getDocs(q);
            if (!snapshot.empty) {
              const userDoc = snapshot.docs[0];
              const user = { id: userDoc.id, ...userDoc.data() } as FirestoreUser;
              helperDetails.push({
                user,
                distance: helper.distance,
                status: helper.status,
              });
            }
          } catch (error) {
            console.error('Error fetching helper:', error);
          }
        }
        setHelpers(helperDetails);
      }
    });

    return unsubscribe;
  }, [sosId, subscribeToSOS]);

  const handleCallEmergency = () => {
    Linking.openURL(`tel:${emergencyNumber}`);
  };

  const handleImSafe = async () => {
    if (!sosId) return;

    Alert.alert(
      'Confirm',
      'Are you sure you want to close this SOS request?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes, I\'m safe',
          onPress: async () => {
            await closeSOS(sosId);
            navigation.navigate('Closure', { sosId });
          },
        },
      ]
    );
  };

  const respondingCount = helpers.filter(
    (h) => h.status === 'responding' || h.status === 'on_way'
  ).length;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <View style={styles.statusIndicator}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Active Mode</Text>
          </View>
        </View>

        <View style={styles.mainContent}>
          <View style={styles.circleContainer}>
            <View style={styles.circle}>
              <Text style={styles.circleIcon}>🛡️</Text>
            </View>
            {helpers.length > 0 && (
              <View style={styles.avatarContainer}>
                {helpers.slice(0, 2).map((_, index) => (
                  <View key={index} style={styles.avatar} />
                ))}
              </View>
            )}
          </View>

          <Text style={styles.title}>{t('sos.active.title')}</Text>
          <Text style={styles.subtitle}>
            {t('sos.active.subtitle', { count: helpers.length })}
          </Text>
          {respondingCount > 0 && (
            <Text style={styles.onWayText}>
              {t('sos.active.onWay', { count: respondingCount })}
            </Text>
          )}
        </View>

        {helpers.length > 0 && (
          <View style={styles.helpersList}>
            <FlatList
              data={helpers}
              keyExtractor={(item) => item.user.id}
              renderItem={({ item }) => (
                <View style={styles.helperItem}>
                  <View style={styles.helperAvatar}>
                    <Text style={styles.helperAvatarText}>
                      {item.user.firstName?.[0] || '?'}
                    </Text>
                  </View>
                  <View style={styles.helperInfo}>
                    <Text style={styles.helperName}>
                      {item.user.firstName || 'Helper'}
                    </Text>
                    <Text style={styles.helperStatus}>
                      {item.status === 'on_way' ? 'On the way' : 'Responding'}
                    </Text>
                  </View>
                  <Text style={styles.helperDistance}>
                    {Math.round(item.distance)}m
                  </Text>
                </View>
              )}
            />
          </View>
        )}

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.safeButton}
            onPress={handleImSafe}
          >
            <Text style={styles.safeButtonText}>
              ✓ {t('sos.active.imSafe')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.emergencyButton}
            onPress={handleCallEmergency}
          >
            <Text style={styles.emergencyButtonText}>
              📞 {t('sos.active.callEmergency', { number: emergencyNumber })}
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
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    padding: 10,
  },
  backButtonText: {
    fontSize: 24,
    color: Colors.text,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 20,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    marginRight: 8,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  mainContent: {
    alignItems: 'center',
    marginBottom: 40,
  },
  circleContainer: {
    width: 250,
    height: 250,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    position: 'relative',
  },
  circle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleIcon: {
    fontSize: 100,
  },
  avatarContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  avatar: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    borderWidth: 2,
    borderColor: Colors.background,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  onWayText: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '600',
  },
  helpersList: {
    flex: 1,
    marginBottom: 20,
  },
  helperItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundLight,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  helperAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  helperAvatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  helperInfo: {
    flex: 1,
  },
  helperName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  helperStatus: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  helperDistance: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
  actions: {
    marginTop: 'auto',
  },
  safeButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 12,
  },
  safeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  emergencyButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  emergencyButtonText: {
    color: Colors.error,
    fontSize: 16,
    fontWeight: '600',
  },
});

