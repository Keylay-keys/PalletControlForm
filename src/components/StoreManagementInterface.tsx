// src/components/StoreManagementInterface.tsx
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet 
} from 'react-native';
import { useTheme } from '../hooks/useTheme';
import TeamMemberSelectionModal from './TeamMemberSelectionModal';

interface Store {
  id: string;
  name: string;
  assigned: boolean;
  assignedTo?: string;
}

interface StoreManagementInterfaceProps {
  route: string;
  stores: Store[];
  onAssignStore: (storeId: string, teamMemberId: string) => Promise<void>;
  onUnassignStore: (storeId: string) => Promise<void>;
}

export default function StoreManagementInterface({
  route,
  stores,
  onAssignStore,
  onUnassignStore
}: StoreManagementInterfaceProps) {
  const { colors } = useTheme();
  const [selectedStore, setSelectedStore] = useState<string | null>(null);
  const [isTeamMemberModalVisible, setIsTeamMemberModalVisible] = useState(false);

  const handleStoreAssignment = async (teamMemberId: string) => {
    if (selectedStore) {
      await onAssignStore(selectedStore, teamMemberId);
      setSelectedStore(null);
      setIsTeamMemberModalVisible(false);
    }
  };

  const StoreItem = ({ item }: { item: Store }) => (
    <View style={[styles.storeItem, { backgroundColor: colors.cardBg }]}>
      <View>
        <Text style={[styles.storeName, { color: colors.textPrimary }]}>
          {item.name}
        </Text>
        {item.assigned && (
          <Text style={[styles.assignedTo, { color: colors.textSecondary }]}>
            Assigned to: {item.assignedTo}
          </Text>
        )}
      </View>
      
      <TouchableOpacity
        style={[styles.actionButton, { 
          backgroundColor: item.assigned ? colors.border : colors.primary 
        }]}
        onPress={() => {
          if (item.assigned) {
            onUnassignStore(item.id);
          } else {
            setSelectedStore(item.id);
            setIsTeamMemberModalVisible(true);
          }
        }}
      >
        <Text style={[styles.buttonText, { color: colors.textPrimary }]}>
          {item.assigned ? 'Unassign' : 'Assign'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.textPrimary }]}>
        Stores - Route {route}
      </Text>
      
      <FlatList
        data={stores}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <StoreItem item={item} />}
        contentContainerStyle={styles.listContent}
      />

      <TeamMemberSelectionModal
        visible={isTeamMemberModalVisible}
        onClose={() => {
          setIsTeamMemberModalVisible(false);
          setSelectedStore(null);
        }}
        onSelect={handleStoreAssignment}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 16,
  },
  storeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  storeName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  assignedTo: {
    fontSize: 14,
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
  },
});