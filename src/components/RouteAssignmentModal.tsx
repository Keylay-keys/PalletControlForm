// src/components/modals/RouteAssignmentModal.tsx
import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  assignedRoutes: string[];
  currentRoutes: string[]; // Ensure this is included if required elsewhere
}

interface RouteAssignmentModalProps {
  visible: boolean;
  onClose: () => void;
  routeNumber: string;
  teamMembers: TeamMember[];
  onAssign: (teamMemberId: string) => Promise<void>;
}

export default function RouteAssignmentModal({
  visible,
  onClose,
  routeNumber,
  teamMembers,
  onAssign,
}: RouteAssignmentModalProps) {
  const { colors } = useTheme();
  const [loading, setLoading] = useState(false);

  const handleAssignment = async (teamMemberId: string) => {
    setLoading(true);
    try {
      await onAssign(teamMemberId);
      Alert.alert('Success', `Route ${routeNumber} assigned successfully.`);
      onClose();
    } catch (error) {
      console.error('Error assigning route:', error);
      Alert.alert('Error', 'Failed to assign the route. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: colors.cardBg }]}>
          <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
            Assign Route {routeNumber}
          </Text>

          <ScrollView>
            {teamMembers.map((member) => (
              <TouchableOpacity
                key={member.id}
                style={[styles.memberItem, { borderBottomColor: colors.border }]}
                onPress={() => handleAssignment(member.id)}
                disabled={loading}
              >
                <View>
                  <Text style={[styles.memberName, { color: colors.textPrimary }]}>
                    {member.name}
                  </Text>
                  <Text style={[styles.memberRoutes, { color: colors.textSecondary }]}>
                    Current Routes: {member.currentRoutes.join(', ') || 'None'}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={{ color: colors.textPrimary }}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  memberItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '500',
  },
  memberRoutes: {
    fontSize: 14,
    color: 'gray',
  },
  closeButton: {
    marginTop: 16,
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
});
