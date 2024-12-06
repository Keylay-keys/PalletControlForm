// src/types/scan.ts
export interface ScanConfig {
    enableHaptics: boolean;
    scanTimeout: number;
    maxRetries: number;
    autoProcess: boolean;
  }
  
  export interface ScanResult {
    success: boolean;
    message?: string;
    uri?: string;
    orderNumber?: string;
    containerCode?: string;
    pageInfo?: {
      current: number;
      total: number;
    };
  }
  
  export interface ScanState {
    scanning: boolean;
    processing: boolean;
    error: string | null;
    result: ScanResult | null;
  }
  
  export type ScanAction = 
    | { type: 'START_SCAN' }
    | { type: 'SCAN_SUCCESS'; payload: ScanResult }
    | { type: 'SCAN_ERROR'; payload: string }
    | { type: 'START_PROCESSING' }
    | { type: 'PROCESSING_SUCCESS'; payload: ScanResult }
    | { type: 'PROCESSING_ERROR'; payload: string }
    | { type: 'RESET' };