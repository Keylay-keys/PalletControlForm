// src/utils/scanSession.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ScanSessionData {
  orderNumber: string | null;
  containerCode: string | null;
  currentPage: number;
  totalPages: number;
  scannedPages: string[];  // URIs of scanned pages
  timestamp: number;
}

class ScanSessionManager {
  private static readonly SESSION_KEY = 'active_scan_session';
  private static readonly SESSION_TIMEOUT = 1000 * 60 * 60 * 24; // 24 hours

  static async createSession(): Promise<ScanSessionData> {
    const session: ScanSessionData = {
      orderNumber: null,
      containerCode: null,
      currentPage: 1,
      totalPages: 1,
      scannedPages: [],
      timestamp: Date.now()
    };
    await this.saveSession(session);
    return session;
  }

  static async getActiveSession(): Promise<ScanSessionData | null> {
    try {
      const sessionData = await AsyncStorage.getItem(this.SESSION_KEY);
      if (!sessionData) return null;

      const session: ScanSessionData = JSON.parse(sessionData);
      
      // Check if session has expired
      if (Date.now() - session.timestamp > this.SESSION_TIMEOUT) {
        await this.clearSession();
        return null;
      }

      return session;
    } catch (error) {
      console.error('Failed to get active session:', error);
      return null;
    }
  }

  static async updateSession(
    updates: Partial<ScanSessionData>
  ): Promise<ScanSessionData> {
    const currentSession = await this.getActiveSession();
    if (!currentSession) {
      throw new Error('No active session found');
    }

    const updatedSession = {
      ...currentSession,
      ...updates,
      timestamp: Date.now() // Reset timeout
    };

    await this.saveSession(updatedSession);
    return updatedSession;
  }

  static async addScannedPage(uri: string): Promise<ScanSessionData> {
    const session = await this.getActiveSession();
    if (!session) {
      throw new Error('No active session found');
    }

    return this.updateSession({
      scannedPages: [...session.scannedPages, uri],
      currentPage: session.currentPage + 1
    });
  }

  private static async saveSession(session: ScanSessionData): Promise<void> {
    try {
      await AsyncStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
    } catch (error) {
      console.error('Failed to save session:', error);
      throw error;
    }
  }

  static async clearSession(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.SESSION_KEY);
    } catch (error) {
      console.error('Failed to clear session:', error);
      throw error;
    }
  }
}

export default ScanSessionManager;