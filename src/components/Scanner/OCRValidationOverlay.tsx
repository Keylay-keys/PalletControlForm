// src/components/Scanner/OCRValidationOverlay.tsx
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { MotiView } from 'moti';
import { ProcessedItem } from '../../interfaces';

interface OCRValidationOverlayProps {
  item: ProcessedItem;
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export const OCRValidationOverlay: React.FC<OCRValidationOverlayProps> = ({
  item,
  boundingBox,
}) => {
  return (
    <MotiView
      style={[
        styles.container,
        {
          left: boundingBox.x,
          top: boundingBox.y,
          width: boundingBox.width,
          height: boundingBox.height,
        },
      ]}
      from={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
    >
      <View style={styles.outline}>
        <Text style={styles.label}>{item.product}</Text>
      </View>
    </MotiView>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
  },
  outline: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#4F46E5',
    borderRadius: 4,
  },
  label: {
    position: 'absolute',
    top: -24,
    left: 0,
    backgroundColor: '#4F46E5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    color: '#FFFFFF',
    fontSize: 12,
  },
});
