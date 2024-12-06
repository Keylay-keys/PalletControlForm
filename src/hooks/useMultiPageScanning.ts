// src/hooks/useMultiPageScanning.ts
import { useState, useCallback } from 'react';
import { ProcessedItem } from '../interfaces';

interface PageData {
  uri: string;
  processed: boolean;
  items?: ProcessedItem[];
  error?: string;
}

export function useMultiPageScanning() {
  const [pages, setPages] = useState<PageData[]>([]);
  const [currentPage, setCurrentPage] = useState(0);

  const addPage = useCallback((uri: string) => {
    setPages((prev) => [...prev, { uri, processed: false }]);
    setCurrentPage((prev) => prev + 1);
  }, []);

  const deletePage = useCallback((index: number) => {
    setPages((prev) => {
      const updatedPages = prev.filter((_, i) => i !== index);
      setCurrentPage((prevCurrent) => Math.min(prevCurrent, updatedPages.length - 1));
      return updatedPages;
    });
  }, []);

  const updatePageProcessing = useCallback(
    (index: number, success: boolean, items?: ProcessedItem[], error?: string) => {
      setPages((prev) => {
        const updated = [...prev];
        updated[index] = {
          ...updated[index],
          processed: true,
          items,
          error,
        };
        return updated;
      });
    },
    []
  );

  return {
    pages,
    currentPage,
    addPage,
    deletePage,
    updatePageProcessing,
    setCurrentPage,
  };
}
