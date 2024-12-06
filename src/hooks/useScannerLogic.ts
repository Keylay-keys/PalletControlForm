// src/hooks/useScannerLogic.ts
import { useState, useCallback, useEffect } from 'react';
import { scan, addListener } from 'modules/scanner';
import { processImage } from 'modules/ocr';
import * as Haptics from 'expo-haptics';

interface ScanState {
  scanning: boolean;
  processing: boolean;
  progress: number;
  uri: string | null;
  orderNumber: string | null;
  containerCode: string | null;
  currentPage: number;
  totalPages: number;
  error: string | null;
}

interface ListenerEvent {
  type?: 'cancelled' | 'error';
  value?: string | null;  // Updated to match potential null value
  message?: string;
}

export const useScannerLogic = () => {
  const [scanState, setScanState] = useState<ScanState>({
    scanning: false,
    processing: false,
    progress: 0,
    uri: null,
    orderNumber: null,
    containerCode: null,
    currentPage: 1,
    totalPages: 1,
    error: null,
  });

  useEffect(() => {
    const subscription = addListener('onChange', async (event: ListenerEvent) => {
      if (event.type === 'cancelled') {
        setScanState(prev => ({ ...prev, scanning: false, progress: 0 }));
        return;
      }

      if (event.type === 'error') {
        setScanState(prev => ({
          ...prev,
          scanning: false,
          progress: 0,
          error: event.message || 'Scan failed'
        }));
        return;
      }

      // Handle null or undefined value
      if (!event.value) {
        setScanState(prev => ({
          ...prev,
          scanning: false,
          progress: 0,
          error: 'No scan data received'
        }));
        return;
      }

      try {
        setScanState((prev) => ({
          ...prev,
          scanning: false,
          processing: true,
          progress: 0.3,
          uri: event.value || null,  // Ensure null if value is undefined
        }));

        const result = await processImage(event.value);
        setScanState(prev => ({ ...prev, progress: 0.6 }));

        const parsedResult = JSON.parse(result);
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        setScanState((prev) => ({
          ...prev,
          processing: false,
          progress: 1,
          orderNumber: parsedResult.orderNumber || prev.orderNumber,
          containerCode: parsedResult.containerCode || prev.containerCode,
          currentPage: parsedResult.pageInfo?.current || prev.currentPage,
          totalPages: parsedResult.pageInfo?.total || prev.totalPages,
        }));
      } catch (error) {
        setScanState((prev) => ({
          ...prev,
          processing: false,
          progress: 0,
          error: 'Error processing scan. Please try again.',
        }));
      }
    });

    return () => subscription.remove();
  }, []);

  const startScan = useCallback(async () => {
    try {
      setScanState((prev) => ({ 
        ...prev, 
        scanning: true, 
        error: null,
        progress: 0
      }));
      await scan();
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (error) {
      setScanState((prev) => ({
        ...prev,
        scanning: false,
        progress: 0,
        error: 'Failed to initialize scanner',
      }));
    }
  }, []);

  const resetScan = useCallback(() => {
    setScanState({
      scanning: false,
      processing: false,
      progress: 0,
      uri: null,
      orderNumber: null,
      containerCode: null,
      currentPage: 1,
      totalPages: 1,
      error: null,
    });
  }, []);

  return {
    ...scanState,
    startScan,
    resetScan,
  };
};