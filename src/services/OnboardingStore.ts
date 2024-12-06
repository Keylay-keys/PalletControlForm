// src\services\OnboardingStore.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

interface OnboardingData {
  email: string;
  password: string;
  routeNumber: string;
  hasRoute: boolean; // Add this
  emailVerified?: boolean;
  pcfVerified?: boolean;
}

export const OnboardingStore = {
  async save(data: Partial<OnboardingData>) {
    try {
      const existing = await this.get();
      await AsyncStorage.setItem('onboarding', 
        JSON.stringify({ ...existing, ...data }));
    } catch (error) {
      console.error('Error saving onboarding data:', error);
      throw error;
    }
  },

  async get(): Promise<OnboardingData | null> {
    try {
      const data = await AsyncStorage.getItem('onboarding');
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting onboarding data:', error);
      throw error;
    }
  },

  async clear() {
    try {
      await AsyncStorage.removeItem('onboarding');
    } catch (error) {
      console.error('Error clearing onboarding data:', error);
      throw error;
    }
  }
};