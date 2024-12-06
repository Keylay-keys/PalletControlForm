// src/components/Scanner/PreviewSection/index.tsx
import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import { MotiView } from 'moti';
import { SharedElement } from 'react-navigation-shared-element';
import { PCFLineItem } from '@/types';

export interface PreviewSectionProps {
  uri: string;
  result?: {
    lineItems: PCFLineItem[];
  };
}

export const PreviewSection: React.FC<PreviewSectionProps> = ({
  uri,
  result
}) => (
  <MotiView
    from={{ 
      translateY: Dimensions.get('window').height,
      opacity: 0 
    }}
    animate={{ 
      translateY: 0,
      opacity: 1
    }}
    transition={{
      type: 'spring',
      damping: 20
    }}
    style={styles.container}
  >
    <SharedElement id="preview">
      <Image 
        source={{ uri }} 
        style={styles.preview}
        resizeMode="contain"
      />
    </SharedElement>
  </MotiView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1F2937',
    borderRadius: 12,
    overflow: 'hidden',
    margin: 16,
  },
  preview: {
    width: '100%',
    height: '100%',
  },
});