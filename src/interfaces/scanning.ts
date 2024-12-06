// src/interfaces/scanning.ts (suggested new location)
export interface ProcessedItem {
    product: string;
    description: string;
    batch?: string;
    bestBefore?: string;
    days: string;
    y: number;
    isShortCoded?: boolean;
  }