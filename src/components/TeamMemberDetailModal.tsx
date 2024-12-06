// src/components/modals/TeamMemberDetailModal.tsx
import React from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { TeamMember } from '../types/firestore';
import { useTheme } from '../hooks/useTheme';

interface TeamMemberDetailModalProps {
  visible: boolean;
  onClose: () => void;
  member: TeamMember | null;
}

export default function TeamMemberDetailModal({
  visible,
  onClose,
  member,
}: TeamMemberDetailModalProps) {
  const { colors } = useTheme();

  if (!member) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: colors.cardBg }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>{member.name}</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={{ color: colors.textPrimary }}>Close</Text>
            </TouchableOpacity>
          </View>
          <ScrollView>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Assigned Routes</Text>
            {member.assignedRoutes.map(route => (
              <Text key={route} style={{ color: colors.textSecondary }}>
                Route {route}
              </Text>
            ))}
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Activity</Text>
            <Text style={{ color: colors.textSecondary }}>Pending Stales: {member.pendingStales}</Text>
            <Text style={{ color: colors.textSecondary }}>Pending Credits: {member.pendingCredits}</Text>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center' },
  modalContent: { padding: 20, borderRadius: 10 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  modalTitle: { fontSize: 20, fontWeight: 'bold' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginVertical: 10 },
});
