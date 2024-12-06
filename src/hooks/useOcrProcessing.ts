// src/hooks/useOcrProcessing.ts
import { useState, useCallback } from 'react';
import { processImage } from '../../modules/ocr';

interface ProcessingResult {
  lineItems: Array<{
    product: string;
    description: string;
    batch?: string;
    bestBefore?: string;
    days: string;
  }>;
  headerY: number;
  footerY: number;
}

export function useOcrProcessing() {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processScannedImage = useCallback(async (uri: string) => {
    setProcessing(true);
    setError(null);

    try {
      // Use your existing OCR module
      const result = await processImage(uri);
      const parsedResult = JSON.parse(result);
      
      return parsedResult;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Processing failed');
      throw error;
    } finally {
      setProcessing(false);
    }
  }, []);

  return {
    processing,
    error,
    processScannedImage
  };
}