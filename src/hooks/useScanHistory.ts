// src/hooks/useScanHistory.ts
import { useState, useCallback } from 'react';
import { ScanStorageManager } from '../utils/scanStorage'
import { ProcessedResult } from '../utils/scanProcessor';

interface HistoryItem {
  id: string;
  orderNumber: string;
  containerCode: string;
  timestamp: number;
  items: ProcessedResult['lineItems'];
}

export function useScanHistory() {
  const [loading, setLoading] = useState(false);
  const [scans, setScans] = useState<HistoryItem[]>([]);

  const loadHistory = useCallback(async () => {
    setLoading(true);
    try {
      const allGroups = await ScanStorageManager.getAllGroups();
      const historyItems: HistoryItem[] = allGroups.map(group => ({
        id: `${group.orderNumber}_${group.containerCode}`,
        orderNumber: group.orderNumber,
        containerCode: group.containerCode,
        timestamp: group.createdAt,
        items: group.scans.flatMap(scan => scan.result.lineItems),
      }));
      setScans(historyItems);
    } catch (error) {
      console.error('Failed to load scan history:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    scans,
    loadHistory,
  };
}
