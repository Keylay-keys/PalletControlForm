// src/components/Scanner/DataValidationView.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from '@react-native-community/blur';
import { MotiView } from 'moti';
import { ProcessedItem } from '../../interfaces';

interface DataValidationViewProps {
  orderNumber: string | null;
  containerCode: string | null;
  items: ProcessedItem[];
  onConfirm: () => void;
  onEdit: () => void;
}

export const DataValidationView: React.FC<DataValidationViewProps> = ({
  orderNumber,
  containerCode,
  items,
  onConfirm,
  onEdit,
}) => {
  const shortCodedItems = items.filter((item) => item.days?.includes('*'));

  return (
    <MotiView
      style={styles.container}
      from={{ opacity: 0, translateY: 50 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'spring', damping: 20 }}
    >
      <BlurView style={styles.content} blurType="dark" blurAmount={10}>
        <View style={styles.header}>
          <Text style={styles.title}>Verify Data</Text>
          <Text style={styles.subtitle}>Please verify the extracted information</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Document Info</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Order Number:</Text>
            <Text style={styles.value}>{orderNumber || 'Not detected'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Container Code:</Text>
            <Text style={styles.value}>{containerCode || 'Not detected'}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Line Items</Text>
          <Text style={styles.itemCount}>{items.length} items detected</Text>
          {shortCodedItems.length > 0 && (
            <View style={styles.warningBox}>
              <Ionicons name="warning" size={20} color="#F59E0B" />
              <Text style={styles.warningText}>
                {shortCodedItems.length} short-coded items found
              </Text>
            </View>
          )}
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.button, styles.editButton]}
            onPress={onEdit}
          >
            <Ionicons name="create" size={20} color="#FFFFFF" />
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.confirmButton]}
            onPress={onConfirm}
          >
            <Ionicons name="checkmark" size={20} color="#FFFFFF" />
            <Text style={styles.buttonText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </BlurView>
    </MotiView>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  content: {
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#94A3B8',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    color: '#94A3B8',
    fontSize: 14,
  },
  value: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  itemCount: {
    color: '#94A3B8',
    fontSize: 14,
    marginBottom: 8,
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    padding: 12,
    borderRadius: 8,
  },
  warningText: {
    color: '#F59E0B',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  editButton: {
    backgroundColor: '#4B5563',
  },
  confirmButton: {
    backgroundColor: '#10B981',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
});
