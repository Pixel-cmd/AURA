import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Colors } from '../../constants/Colors';
import { useTranslation } from 'react-i18next';
import { reportService } from '../../services/abuse/reportService';
import { useAuthStore } from '../../stores/authStore';

interface ReportBlockModalProps {
  visible: boolean;
  onClose: () => void;
  reportedUserId: string;
  sosRequestId?: string;
}

export default function ReportBlockModal({
  visible,
  onClose,
  reportedUserId,
  sosRequestId,
}: ReportBlockModalProps) {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [selectedReason, setSelectedReason] = useState<'abuse' | 'spam' | 'inappropriate' | 'other' | null>(null);
  const [description, setDescription] = useState('');

  const reasons = [
    { key: 'abuse', label: 'Abuse' },
    { key: 'spam', label: 'Spam' },
    { key: 'inappropriate', label: 'Inappropriate Behavior' },
    { key: 'other', label: 'Other' },
  ] as const;

  const handleReport = async () => {
    if (!user || !selectedReason) return;

    try {
      await reportService.reportUser(
        user.uid,
        reportedUserId,
        selectedReason,
        description || undefined,
        sosRequestId
      );

      Alert.alert('Reported', 'Thank you for your report. We will review it.');
      onClose();
      setSelectedReason(null);
      setDescription('');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to submit report');
    }
  };

  const handleBlock = async () => {
    if (!user) return;

    Alert.alert(
      'Block User',
      'Are you sure you want to block this user?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Block',
          style: 'destructive',
          onPress: async () => {
            try {
              await reportService.blockUser(user.uid, reportedUserId);
              Alert.alert('Blocked', 'User has been blocked.');
              onClose();
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to block user');
            }
          },
        },
      ]
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Report or Block</Text>

          <Text style={styles.sectionTitle}>Report Reason</Text>
          {reasons.map((reason) => (
            <TouchableOpacity
              key={reason.key}
              style={[
                styles.reasonButton,
                selectedReason === reason.key && styles.reasonButtonSelected,
              ]}
              onPress={() => setSelectedReason(reason.key)}
            >
              <Text
                style={[
                  styles.reasonText,
                  selectedReason === reason.key && styles.reasonTextSelected,
                ]}
              >
                {reason.label}
              </Text>
            </TouchableOpacity>
          ))}

          {selectedReason === 'other' && (
            <TextInput
              style={styles.descriptionInput}
              placeholder="Please describe the issue..."
              multiline
              numberOfLines={4}
              value={description}
              onChangeText={setDescription}
            />
          )}

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.button, styles.reportButton]}
              onPress={handleReport}
              disabled={!selectedReason}
            >
              <Text style={styles.buttonText}>Report</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.blockButton]}
              onPress={handleBlock}
            >
              <Text style={[styles.buttonText, styles.blockButtonText]}>Block</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
    maxHeight: '80%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  reasonButton: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: Colors.backgroundLight,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  reasonButtonSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  reasonText: {
    fontSize: 16,
    color: Colors.text,
  },
  reasonTextSelected: {
    color: Colors.primary,
    fontWeight: '600',
  },
  descriptionInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
    marginBottom: 20,
    minHeight: 100,
    textAlignVertical: 'top',
    fontSize: 16,
    color: Colors.text,
  },
  actions: {
    marginTop: 20,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  reportButton: {
    backgroundColor: Colors.primary,
  },
  blockButton: {
    backgroundColor: Colors.error,
  },
  cancelButton: {
    backgroundColor: Colors.backgroundLight,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  blockButtonText: {
    color: '#FFFFFF',
  },
  cancelButtonText: {
    color: Colors.text,
  },
});

