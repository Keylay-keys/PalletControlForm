// src/components/Scanner/ScanHistory.tsx
import React from 'react';
import { StyleSheet, FlatList, View, Text, TouchableOpacity } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import { ProcessedItem } from '../../interfaces';

interface HistoryItem {
  id: string;
  orderNumber: string;
  containerCode: string;
  timestamp: number;
  items: ProcessedItem[];
}

interface ScanHistoryProps {
  scans: HistoryItem[];
  onSelectScan: (scan: HistoryItem) => void;
}

const HistoryCard = React.memo(({ item, onPress }: { item: HistoryItem; onPress: () => void }) => {
  const shortCodedCount = item.items.filter((i) => i.days?.includes('*')).length;
  const date = new Date(item.timestamp);

  return (
    <TouchableOpacity
      style={styles.scanItem}
      onPress={onPress}
      accessibilityLabel={`Order ${item.orderNumber}, ${shortCodedCount} short-coded items`}
    >
      <View style={styles.itemHeader}>
        <Text style={styles.orderNumber}>Order #{item.orderNumber}</Text>
        <Text style={styles.timestamp}>
          {date.toLocaleDateString()} {date.toLocaleTimeString()}
        </Text>
      </View>
      <View style={styles.itemDetails}>
        <View style={styles.detail}>
          <Text style={styles.detailLabel}>Container</Text>
          <Text style={styles.detailValue}>{item.containerCode}</Text>
        </View>
        <View style={styles.detail}>
          <Text style={styles.detailLabel}>Items</Text>
          <Text style={styles.detailValue}>{item.items.length}</Text>
        </View>
        {shortCodedCount > 0 && (
          <View style={[styles.detail, styles.shortCodedDetail]}>
            <Text style={styles.detailLabel}>Short-Coded</Text>
            <Text style={[styles.detailValue, styles.shortCodedValue]}>{shortCodedCount}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
});

export const ScanHistory: React.FC<ScanHistoryProps> = ({ scans, onSelectScan }) => {
  const renderItem = ({ item }: { item: HistoryItem }) => (
    <HistoryCard item={item} onPress={() => onSelectScan(item)} />
  );

  return (
    <BlurView style={styles.container} blurType="dark" blurAmount={10}>
      {scans.length === 0 ? (
        <Text style={styles.emptyMessage}>No scan history available</Text>
      ) : (
        <FlatList
          data={scans}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          accessibilityLabel="Scan history list"
        />
      )}
    </BlurView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  list: {
    padding: 16,
  },
  scanItem: {
    backgroundColor: 'rgba(31, 41, 55, 0.6)',
    borderRadius: 12,
    padding: 16,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  orderNumber: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  timestamp: {
    color: '#94A3B8',
    fontSize: 12,
  },
  itemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detail: {
    alignItems: 'center',
  },
  detailLabel: {
    color: '#94A3B8',
    fontSize: 12,
    marginBottom: 4,
  },
  detailValue: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  shortCodedDetail: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  shortCodedValue: {
    color: '#EF4444',
  },
  separator: {
    height: 8,
  },
  emptyMessage: {
    color: '#94A3B8',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
  },
});
