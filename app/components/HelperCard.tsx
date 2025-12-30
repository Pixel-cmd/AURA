import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/Colors';
import { FirestoreUser } from '../../types/firebase';
import { locationService } from '../../services/location/locationService';
import { useTranslation } from 'react-i18next';

interface HelperCardProps {
  user: FirestoreUser;
  distance: number;
  status: string;
  onPress?: () => void;
}

export default function HelperCard({ user, distance, status, onPress }: HelperCardProps) {
  const { t, i18n } = useTranslation();
  const formattedDistance = locationService.formatDistance(distance, i18n.language);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {user.firstName?.[0] || '?'}
        </Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>
          {user.firstName || 'Helper'}
        </Text>
        <Text style={styles.status}>
          {status === 'on_way' ? 'On the way' : 
           status === 'arrived' ? 'Arrived' : 
           'Responding'}
        </Text>
      </View>
      <Text style={styles.distance}>{formattedDistance}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundLight,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  status: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  distance: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
});

