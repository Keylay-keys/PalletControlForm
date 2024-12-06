// src/hooks/useDocumentScanner.ts
import { useState, useCallback, useEffect } from 'react';
import { scan, addListener } from '../../modules/scanner';
import { processImage } from '../../modules/ocr';

export function useDocumentScanner() {
  const [scanning, setScanning] = useState(false);
  const [uri, setUri] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const subscription = addListener('onChange', (data: any) => {
      if (data.type === 'cancelled') {
        setScanning(false);
        return;
      }

      if (data.type === 'error') {
        setError(data.message || 'Scan failed');
        setScanning(false);
        return;
      }

      if (data.value) {
        setUri(data.value);
        setScanning(false);
      }
    });

    return () => subscription.remove();
  }, []);

  const startScan = useCallback(async () => {
    try {
      setScanning(true);
      setError(null);
      await scan();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Scanner error');
      setScanning(false);
    }
  }, []);

  const handleProcess = useCallback(async () => {
    if (!uri) return;
    
    setProcessing(true);
    try {
      const result = await processImage(uri);
      return JSON.parse(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Processing error');
      throw err;
    } finally {
      setProcessing(false);
    }
  }, [uri]);

  const resetScan = useCallback(() => {
    setUri(null);
    setError(null);
  }, []);

  return {
    scanning,
    processing,
    uri,
    error,
    startScan,
    handleProcess,
    resetScan
  };
}