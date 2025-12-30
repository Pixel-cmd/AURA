import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/Colors';
import { useTranslation } from 'react-i18next';

interface PointsDisplayProps {
  points: number;
  label?: string;
}

export default function PointsDisplay({ points, label }: PointsDisplayProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.pointsContainer}>
        <Text style={styles.icon}>👤</Text>
        <Text style={styles.points}>
          +{points} {t('sos.closure.pointsAwarded', { points }).includes('pts') ? 'pts' : 'punten'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 12,
    letterSpacing: 1,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundLight,
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 30,
  },
  icon: {
    fontSize: 20,
    marginRight: 8,
  },
  points: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
  },
});

