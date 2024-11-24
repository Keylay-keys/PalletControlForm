// src/components/Scanner/OCRResults/index.tsx
import React from 'react';
import { ScrollView, Text, View, StyleSheet } from 'react-native';
import { PCFScanResult } from '../../../types';
import { LineItem } from './LineItem';


interface OCRResultsProps {
  result: PCFScanResult;
}

export const OCRResults = ({ result }: OCRResultsProps) => (
  <ScrollView style={styles.container}>
    {result.pageInfo && (
      <View style={styles.pageInfoContainer}>
        <Text style={styles.pageInfoText}>
          Page {result.pageInfo.current} of {result.pageInfo.total}
        </Text>
      </View>
    )}
    <Text style={styles.containerCodeText}>
      Container Code: {result.containerCode}
    </Text>
    <Text style={styles.resultText}>Scanned Items:</Text>
    {result.lineItems.map((item, index) => (
      <LineItem key={index} item={item} />
    ))}
  </ScrollView>
);

const styles = StyleSheet.create({
  container: {
    maxHeight: 300,
    width: '100%',
    padding: 16,
    backgroundColor: '#ffffff',
  },
  pageInfoContainer: {
    backgroundColor: '#e8f4ff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  pageInfoText: {
    fontSize: 14,
    color: '#2563eb',
    fontWeight: '500',
  },
  containerCodeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  resultText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
});