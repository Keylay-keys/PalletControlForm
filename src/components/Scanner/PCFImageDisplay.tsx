// src/components/Scanner/PCFImageDisplay.tsx
import React from 'react';
import { View, Image, StyleSheet, Dimensions, Text } from 'react-native';
import { MotiView } from 'moti';
import { BlurView } from '@react-native-community/blur';
import { ProcessedItem } from '../../interfaces';

const { width } = Dimensions.get('window');

interface PCFImageDisplayProps {
  uri: string;
  processedItems?: ProcessedItem[];
  showOverlay: boolean;
}

export const PCFImageDisplay: React.FC<PCFImageDisplayProps> = ({
  uri,
  processedItems = [],
  showOverlay,
}) => {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri }}
        style={styles.image}
        resizeMode="contain"
      />

      {showOverlay && processedItems.length > 0 && (
        <BlurView
          style={StyleSheet.absoluteFill}
          blurType="dark"
          blurAmount={10}
        >
          {processedItems.map((item, index) => (
            <MotiView
              key={index}
              from={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                type: 'spring',
                damping: 20,
                delay: index * 100,
              }}
              style={[
                styles.overlay,
                item.days?.includes('*') && styles.shortCodedOverlay,
              ]}
            >
              <Text style={styles.productCode}>{item.product}</Text>
              <Text style={styles.description} numberOfLines={1}>
                {item.description}
              </Text>
            </MotiView>
          ))}
        </BlurView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width - 32,
    aspectRatio: 0.7,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#1F2937',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    left: 16,
    right: 16,
    padding: 12,
    backgroundColor: 'rgba(31, 41, 55, 0.9)',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#4F46E5',
  },
  shortCodedOverlay: {
    borderLeftColor: '#EF4444',
  },
  productCode: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  description: {
    color: '#94A3B8',
    fontSize: 14,
    marginTop: 4,
  },
});
