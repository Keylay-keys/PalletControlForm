// src/components/Scanner/OCRResults/LineItem.tsx
import { View, Text, StyleSheet } from 'react-native';
import { PCFLineItem } from '../../../types';

interface LineItemProps {
  item: PCFLineItem;
}

export const LineItem = ({ item }: LineItemProps) => (
  <View style={[styles.lineItemContainer, item.isShortCoded && styles.asteriskContainer]}>
    <View style={styles.lineItemHeader}>
      <Text style={styles.productText}>{item.product}</Text>
      <Text style={styles.daysText}>Days: {item.days}</Text>
    </View>
    <Text style={styles.descriptionText}>{item.description}</Text>
    <Text style={styles.dateText}>Best Before: {item.bestBefore}</Text>
  </View>
);

const styles = StyleSheet.create({
  lineItemContainer: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  asteriskContainer: {
    borderColor: '#ff4444',
    borderWidth: 1,
  },
  lineItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  productText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  daysText: {
    fontSize: 14,
    color: '#2563eb',
    fontWeight: '500',
  },
  descriptionText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 13,
    color: '#666',
  },
});