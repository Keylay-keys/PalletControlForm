// src/types/index.ts
// import type { LineItem } from '../modules/myocr';  // Keep this commented reference

// Basic OCR/Scanner Types
export interface PageInfo {
    current: number;
    total: number;
  }
  
  export interface PCFLineItem {
    product: string;
    description: string;
    bestBefore: string;
    days: string;
    isShortCoded: boolean;
    expirationDate?: Date;        // Calculated field
    daysUntilExpiration?: number; // Calculated field
    customAlertDays?: number;     // Override for notifications
  }
  
  export interface PCFScanResult {
    lineItems: PCFLineItem[];
    containerCode: string;
    pageInfo?: PageInfo;          // Added for multi-page support
  }
  
  // Database Types
  export interface PCFDocument {
    containerCode: string;
    currentPage: number;
    totalPages: number;
    dateScanned: Date;           // Same as createdAt
    lineItems: PCFLineItem[];
    isComplete: boolean;
    orderNumber?: string;        // Optional until we get it from scan
    imageUri: string;
    lastProcessed?: Date;
  }
  
  // Settings & Configuration
  export interface AlertSettings {
    globalAlertDays: number;     // Default days before expiration for alert
    deleteDays: number;          // Days after expiration to keep records
    notificationTime?: string;   // When to send daily notifications
  }
  
  // Search & Filtering
  export interface SearchFilters {
    productNumber?: string;
    orderNumber?: string;
    dateRange?: {
      start: Date;
      end: Date;
    };
    isShortCodedOnly?: boolean;
    expiringWithinDays?: number;
  }
  
  // Constants
  export const PCF_CONSTANTS = {
    DEFAULT_ALERT_DAYS: 3,
    DEFAULT_DELETE_DAYS: 5,
    SHORT_CODED_MARKER: '*',
    STORAGE_KEYS: {
      SETTINGS: 'pcf_settings',
      DOCUMENTS: 'pcf_documents',
      NOTIFICATIONS: 'pcf_notifications'
    }
  } as const;
  
  // Error Types
  export interface PCFError extends Error {
    code: string;
    details?: any;
  }