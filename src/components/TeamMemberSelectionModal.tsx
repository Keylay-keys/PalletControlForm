// src/components/TeamMemberSelectionModal.tsx
import React, { useEffect, useState } from 'react';
import { 
  Modal, 
  View, 
  Text, 
  TouchableOpacity, 
  FlatList,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

interface TeamMember {
  id: string;
  name: string;
  email: string;
}

interface TeamMemberSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (teamMemberId: string) => void;
}

export default function TeamMemberSelectionModal({
  visible,
  onClose,
  onSelect
}: TeamMemberSelectionModalProps) {
  const { colors } = useTheme();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (visible) {
      fetchTeamMembers();
    }
  }, [visible]);

  const fetchTeamMembers = async () => {
    const db = getFirestore();
    try {
      const querySnapshot = await getDocs(collection(db, 'teamMembers'));
      const members: TeamMember[] = [];
      querySnapshot.forEach((doc) => {
        members.push({
          id: doc.id,
          name: doc.data().name || 'Unknown',
          email: doc.data().email || ''
        });
      });
      setTeamMembers(members);
    } catch (error) {
      console.error('Error fetching team members:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.content, { backgroundColor: colors.cardBg }]}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            Select Team Member
          </Text>

          {loading ? (
            <ActivityIndicator size="large" color={colors.primary} />
          ) : (
            <>
              <FlatList
                data={teamMembers}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[styles.memberItem, { borderBottomColor: colors.border }]}
                    onPress={() => onSelect(item.id)}
                  >
                    <Text style={[styles.memberName, { color: colors.textPrimary }]}>
                      {item.name}
                    </Text>
                    <Text style={[styles.memberEmail, { color: colors.textSecondary }]}>
                      {item.email}
                    </Text>
                  </TouchableOpacity>
                )}
                contentContainerStyle={styles.list}
              />

              <TouchableOpacity
                style={[styles.cancelButton, { borderTopColor: colors.border }]}
                onPress={onClose}
              >
                <Text style={[styles.cancelText, { color: colors.primary }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  content: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '80%'
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 16,
    textAlign: 'center'
  },
  list: {
    paddingBottom: 16
  },
  memberItem: {
    padding: 16,
    borderBottomWidth: 1
  },
  memberName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4
  },
  memberEmail: {
    fontSize: 14
  },
  cancelButton: {
    padding: 16,
    alignItems: 'center',
    borderTopWidth: 1
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '500'
  }
});