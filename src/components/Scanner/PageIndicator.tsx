// src/components/Scanner/PageIndicator.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface PageIndicatorProps {
  currentPage: number;
  totalPages: number;
}

export const PageIndicator: React.FC<PageIndicatorProps> = ({ currentPage, totalPages }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Page {currentPage} of {totalPages}
      </Text>
      <View style={styles.dotsContainer}>
        {Array.from({ length: totalPages }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              currentPage === index + 1 && styles.activeDot
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 16,
  },
  text: {
    color: '#94A3B8',
    fontSize: 14,
    marginBottom: 8,
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  activeDot: {
    backgroundColor: '#4F46E5',
  },
});