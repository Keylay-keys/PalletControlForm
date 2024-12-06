import React from 'react';
import { StyleSheet, ScrollView, Text, View, TouchableOpacity } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import { ProcessedItem } from '../../interfaces';

interface SummaryViewProps {
  items: ProcessedItem[];
  containerCode: string;
  orderNumber: string;
  onSave: () => void;
  onShare: () => void;
  actionButtonColor?: string; // Optional customization for button colors
  animate?: boolean; // Control animation
}

export const SummaryView: React.FC<SummaryViewProps> = ({
  items,
  containerCode,
  orderNumber,
  onSave,
  onShare,
  actionButtonColor = '#4F46E5',
  animate = true,
}) => {
  const shortCodedItems = items.filter((item) => item.days?.includes('*'));

  return (
    <MotiView
      from={{ opacity: 0, translateY: animate ? 50 : 0 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'spring', damping: 20 }}
      style={styles.container}
      accessibilityLabel="Summary of scanned items"
    >
      <BlurView style={styles.content} blurType="dark" blurAmount={10}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.title}>Scan Summary</Text>
          <View style={styles.actions}>
            <TouchableOpacity
              onPress={onShare}
              style={[styles.actionButton, { backgroundColor: actionButtonColor }]}
              accessibilityRole="button"
              accessibilityLabel="Share scan summary"
            >
              <Ionicons name="share-outline" size={24} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onSave}
              style={[styles.actionButton, { backgroundColor: actionButtonColor }]}
              accessibilityRole="button"
              accessibilityLabel="Save scan summary"
            >
              <Ionicons name="save-outline" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Info Section */}
        <View style={styles.infoSection} accessibilityLabel="Order and container details">
          <View style={styles.infoRow}>
            <Text style={styles.label}>Order Number:</Text>
            <Text style={styles.value}>{orderNumber || 'N/A'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Container Code:</Text>
            <Text style={styles.value}>{containerCode || 'N/A'}</Text>
          </View>
        </View>

        {/* Short-Coded Section */}
        {shortCodedItems.length > 0 && (
          <View style={styles.shortCodedSection} accessibilityLabel="Short-coded items section">
            <Text style={styles.sectionTitle}>Short-Coded Items</Text>
            <ScrollView
              style={styles.itemsList}
              removeClippedSubviews
              contentContainerStyle={{ gap: 8 }}
            >
              {shortCodedItems.map((item, index) => (
                <View key={index} style={styles.shortCodedItem}>
                  <Text style={styles.itemProduct}>{item.product}</Text>
                  <Text style={styles.itemDays}>{item.days}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Stats Section */}
        <View style={styles.statsSection} accessibilityLabel="Summary statistics">
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Total Items</Text>
            <Text style={styles.statValue}>{items.length}</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Short-Coded</Text>
            <Text style={styles.statValue}>{shortCodedItems.length}</Text>
          </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
  },
  infoSection: {
    backgroundColor: 'rgba(31, 41, 55, 0.6)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  infoRow: {
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
  shortCodedSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  itemsList: {
    maxHeight: 200,
  },
  shortCodedItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 8,
  },
  itemProduct: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  itemDays: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '500',
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  stat: {
    alignItems: 'center',
  },
  statLabel: {
    color: '#94A3B8',
    fontSize: 12,
    marginBottom: 4,
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '600',
  },
});
