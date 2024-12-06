// src/context/ScanContext.tsx
import React, { createContext, useContext, useReducer } from 'react';
import { ProcessedResult } from '../utils/scanProcessor';

interface ScanState {
 currentSession: {
   orderNumber: string | null;
   containerCode: string | null;
   currentPage: number;
   totalPages: number;
 };
 scannedPages: Array<{
   uri: string;
   result: ProcessedResult;
 }>;
 isScanning: boolean;
 isProcessing: boolean;
 error: string | null;
}

type ScanAction =
 | { type: 'START_SCAN' }
 | { type: 'SCAN_COMPLETE'; payload: { uri: string; result: ProcessedResult } }
 | { type: 'START_PROCESSING' }
 | { type: 'PROCESSING_COMPLETE' }
 | { type: 'SET_ERROR'; payload: string }
 | { type: 'CLEAR_ERROR' }
 | { type: 'NEW_SESSION' }
 | { type: 'UPDATE_PAGE_INFO'; payload: { current: number; total: number } };

const initialState: ScanState = {
 currentSession: {
   orderNumber: null,
   containerCode: null,
   currentPage: 1,
   totalPages: 1
 },
 scannedPages: [],
 isScanning: false,
 isProcessing: false,
 error: null
};

function scanReducer(state: ScanState, action: ScanAction): ScanState {
 switch (action.type) {
   case 'START_SCAN':
     return {
       ...state,
       isScanning: true,
       error: null
     };

   case 'SCAN_COMPLETE':
     return {
       ...state,
       isScanning: false,
       scannedPages: [...state.scannedPages, {
         uri: action.payload.uri,
         result: action.payload.result
       }],
       currentSession: {
         ...state.currentSession,
         orderNumber: action.payload.result.orderNumber || state.currentSession.orderNumber,
         containerCode: action.payload.result.containerCode || state.currentSession.containerCode,
         currentPage: action.payload.result.pageInfo.current,
         totalPages: action.payload.result.pageInfo.total
       }
     };

   case 'START_PROCESSING':
     return {
       ...state,
       isProcessing: true,
       error: null
     };

   case 'PROCESSING_COMPLETE':
     return {
       ...state,
       isProcessing: false
     };

   case 'SET_ERROR':
     return {
       ...state,
       isScanning: false,
       isProcessing: false,
       error: action.payload
     };

   case 'CLEAR_ERROR':
     return {
       ...state,
       error: null
     };

   case 'NEW_SESSION':
     return {
       ...initialState
     };

   case 'UPDATE_PAGE_INFO':
     return {
       ...state,
       currentSession: {
         ...state.currentSession,
         currentPage: action.payload.current,
         totalPages: action.payload.total
       }
     };

   default:
     return state;
 }
}

const ScanContext = createContext<{
 state: ScanState;
 dispatch: React.Dispatch<ScanAction>;
} | null>(null);

export function ScanProvider({ children }: { children: React.ReactNode }) {
 const [state, dispatch] = useReducer(scanReducer, initialState);

 return (
   <ScanContext.Provider value={{ state, dispatch }}>
     {children}
   </ScanContext.Provider>
 );
}

export function useScanContext() {
 const context = useContext(ScanContext);
 if (!context) {
   throw new Error('useScanContext must be used within a ScanProvider');
 }
 return context;
}