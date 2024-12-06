// src/utils/scanProcessor.ts
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ProcessedResult {
  orderNumber: string | null;
  containerCode: string | null;
  lineItems: Array<{
    product: string;
    description: string;
    batch?: string;
    bestBefore?: string;
    days: string;
    isShortCoded: boolean;
  }>;
  pageInfo: {
    current: number;
    total: number;
  };
}

export class ScanProcessor {
  static async validateImage(uri: string): Promise<boolean> {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      return blob.type.startsWith('image/');
    } catch (error) {
      console.error('Image validation failed. URI:', uri, 'Error:', error);
      return false;
    }
  }

  static getLocalPath(uri: string): string {
    return Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
  }

  static normalizeOCRResult(rawResult: unknown): ProcessedResult {
    const result: ProcessedResult = {
      orderNumber: null,
      containerCode: null,
      lineItems: [],
      pageInfo: { current: 1, total: 1 },
    };

    if (typeof rawResult === 'string') {
      try {
        rawResult = JSON.parse(rawResult);
      } catch (error) {
        console.error('Failed to parse OCR result:', error);
        return result;
      }
    }

    // Type assertion for safety
    if (typeof rawResult === 'object' && rawResult !== null) {
      const raw = rawResult as Record<string, any>;

      result.orderNumber = raw.orderNumber || null;
      result.containerCode = raw.containerCode || null;

      if (Array.isArray(raw.lineItems)) {
        result.lineItems = raw.lineItems.map((item) => ({
          product: item.product || '',
          description: item.description || '',
          batch: item.batch,
          bestBefore: item.bestBefore,
          days: item.days || '',
          isShortCoded: item.days?.includes('*') || false,
        }));
      }

      if (raw.pageInfo) {
        result.pageInfo = {
          current: Number(raw.pageInfo.current) || 1,
          total: Number(raw.pageInfo.total) || 1,
        };
      }
    }

    return result;
  }

  static validateLineItem(item: Partial<ProcessedResult['lineItems'][number]>): boolean {
    return (
      typeof item.product === 'string' &&
      item.product.length > 0 &&
      typeof item.description === 'string' &&
      item.description.length > 0 &&
      typeof item.days === 'string' &&
      item.days.length > 0
    );
  }

  static async saveProcessedResult(result: ProcessedResult): Promise<void> {
    try {
      // Example using AsyncStorage (can replace with your own storage mechanism)
      const key = `${result.orderNumber}_${result.containerCode}`;
      const jsonValue = JSON.stringify(result);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error('Failed to save processed result. Error:', error);
      throw error;
    }
  }
}
