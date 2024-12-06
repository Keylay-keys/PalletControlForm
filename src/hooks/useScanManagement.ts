// src/hooks/useScanManagement.ts
import { useState, useCallback } from 'react';
import { scan, addListener } from 'modules/scanner';
import { processImage } from 'modules/ocr';
import { PCFScanResult } from '../types';

interface ScanState {
  loading: boolean;
  scanning: boolean;
  error: string | null;
  currentGroup: {
    orderNumber: string | null;
    containerCode: string | null;
    currentPage: number;
    totalPages: number;
  };
  processedScans: Array<{
    uri: string;
    result: PCFScanResult;
  }>;
}

export function useScanManagement() {
  const [state, setState] = useState<ScanState>({
    loading: false,
    scanning: false,
    error: null,
    currentGroup: {
      orderNumber: null,
      containerCode: null,
      currentPage: 1,
      totalPages: 1
    },
    processedScans: []
  });

  const processScan = useCallback(async (uri: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const result = await processImage(uri);
      const parsedResult = JSON.parse(result) as PCFScanResult;

      setState(prev => ({
        ...prev,
        loading: false,
        currentGroup: {
          orderNumber: parsedResult.containerCode || prev.currentGroup.orderNumber,
          containerCode: parsedResult.containerCode || prev.currentGroup.containerCode,
          currentPage: parsedResult.pageInfo?.current || prev.currentGroup.currentPage,
          totalPages: parsedResult.pageInfo?.total || prev.currentGroup.totalPages
        },
        processedScans: [...prev.processedScans, { uri, result: parsedResult }]
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Error processing scan'
      }));
      throw error;
    }
  }, []);

  const startNewGroup = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentGroup: {
        orderNumber: null,
        containerCode: null,
        currentPage: 1,
        totalPages: 1
      },
      processedScans: []
    }));
  }, []);

  const updatePageInfo = useCallback((current: number, total: number) => {
    setState(prev => ({
      ...prev,
      currentGroup: {
        ...prev.currentGroup,
        currentPage: current,
        totalPages: total
      }
    }));
  }, []);

  const resetError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    processScan,
    startNewGroup,
    updatePageInfo,
    resetError
  };
}