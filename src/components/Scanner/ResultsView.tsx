// src/components/Scanner/ResultsView.tsx
import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { PCFLineItem } from '../../types';

interface ResultsViewProps {
  lineItems: PCFLineItem[];
  visible: boolean;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  lineItems,
  visible
}) => {
  return (
    <MotiView
      from={{ opacity: 0, translateY: 50 }}
      animate={{ 
        opacity: visible ? 1 : 0,
        translateY: visible ? 0 : 50
      }}
      transition={{ type: 'spring', damping: 20 }}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        {lineItems.map((item, index) => (
          <View 
            key={index} 
            style={[
              styles.itemCard,
              item.isShortCoded && styles.shortCodedCard
            ]}
          >
            <View style={styles.itemHeader}>
              <Text style={styles.productCode}>{item.product}</Text>
              {item.isShortCoded && (
                <View style={styles.shortCodedBadge}>
                  <Text style={styles.shortCodedText}>Short-Coded</Text>
                </View>
              )}
            </View>

            <Text style={styles.description}>{item.description}</Text>

            <View style={styles.itemDetails}>
              <Text style={styles.detail}>Best Before: {item.bestBefore}</Text>
              <Text style={styles.detail}>Days: {item.days}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </MotiView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 16,
  },
  scrollView: {
    flex: 1,
  },
  itemCard: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  shortCodedCard: {
    borderLeftWidth: 3,
    borderLeftColor: '#EF4444',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  productCode: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  shortCodedBadge: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  shortCodedText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '500',
  },
  description: {
    color: '#94A3B8',
    fontSize: 14,
    marginBottom: 8,
  },
  itemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detail: {
    color: '#64748B',
    fontSize: 12,
  },
});