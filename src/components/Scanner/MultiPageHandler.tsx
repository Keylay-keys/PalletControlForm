// src/components/Scanner/MultiPageHandler.tsx
import React from 'react';
import {
  ScrollView,
  TouchableOpacity,
  Image,
  Text,
  Alert,
  StyleSheet,
  View,
} from 'react-native';
import { BlurView } from '@react-native-community/blur';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import { ProcessedItem } from '../../interfaces';

interface PageData {
  uri: string;
  processed: boolean;
  items?: ProcessedItem[];
  error?: string;
}

interface MultiPageHandlerProps {
  pages: PageData[];
  currentPage: number;
  onPageSelect: (index: number) => void;
  onDeletePage: (index: number) => void;
  onNewScan: () => void; // Added missing prop
}

export const MultiPageHandler: React.FC<MultiPageHandlerProps> = ({
  pages,
  currentPage,
  onPageSelect,
  onDeletePage,
  onNewScan,
}) => {
  return (
    <MotiView
      style={styles.container}
      from={{ translateY: 100 }}
      animate={{ translateY: 0 }}
      transition={{ type: 'spring', damping: 20 }}
    >
      <BlurView style={styles.content} blurType="dark" blurAmount={10}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.pageList}
        >
          {pages.map((page, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.pageItem,
                currentPage === index && styles.selectedPage,
              ]}
              onPress={() => onPageSelect(index)}
              onLongPress={() =>
                Alert.alert('Delete Page', 'Are you sure you want to delete this page?', [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Delete',
                    onPress: () => onDeletePage(index),
                    style: 'destructive',
                  },
                ])
              }
            >
              <Image source={{ uri: page.uri }} style={styles.thumbnail} />
              {page.processed && (
                <View style={styles.badge}>
                  <Ionicons
                    name={page.error ? 'alert-circle' : 'checkmark-circle'}
                    size={16}
                    color={page.error ? '#EF4444' : '#10B981'}
                  />
                </View>
              )}
              <Text style={styles.pageNumber}>Page {index + 1}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={[styles.pageItem, styles.addButton]}
            onPress={onNewScan}
          >
            <Ionicons name="add" size={32} color="#4F46E5" />
            <Text style={styles.addText}>Add Page</Text>
          </TouchableOpacity>
        </ScrollView>
      </BlurView>
    </MotiView>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  content: {
    paddingVertical: 16,
  },
  pageList: {
    paddingHorizontal: 16,
    gap: 12,
  },
  pageItem: {
    width: 100,
    alignItems: 'center',
  },
  selectedPage: {
    borderColor: '#4F46E5',
    borderWidth: 2,
  },
  thumbnail: {
    width: 100,
    height: 140,
    borderRadius: 8,
    backgroundColor: '#1F2937',
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 10,
    padding: 4,
  },
  pageNumber: {
    color: '#FFFFFF',
    fontSize: 12,
    marginTop: 4,
  },
  addButton: {
    backgroundColor: 'rgba(79, 70, 229, 0.1)',
    borderRadius: 8,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addText: {
    color: '#4F46E5',
    fontSize: 12,
    marginTop: 4,
  },
});
