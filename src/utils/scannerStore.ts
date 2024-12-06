// src/utils/scannerStore.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ScannerSession {
 orderNumber: string | null;
 containerCode: string | null;
 currentPage: number;
 totalPages: number;
 timestamp: number;
}

export const scannerStore = {
 async saveSession(session: ScannerSession) {
   try {
     await AsyncStorage.setItem('scanner_session', JSON.stringify(session));
   } catch (error) {
     console.error('Failed to save scanner session:', error);
   }
 },

 async loadSession(): Promise<ScannerSession | null> {
   try {
     const data = await AsyncStorage.getItem('scanner_session');
     if (data) {
       const session = JSON.parse(data);
       // Check if session is still valid (within 24 hours)
       if (Date.now() - session.timestamp < 24 * 60 * 60 * 1000) {
         return session;
       }
     }
     return null;
   } catch (error) {
     console.error('Failed to load scanner session:', error);
     return null;
   }
 },

 async clearSession() {
   try {
     await AsyncStorage.removeItem('scanner_session');
   } catch (error) {
     console.error('Failed to clear scanner session:', error);
   }
 }
};