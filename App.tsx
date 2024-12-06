// App.tsx
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { User } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './src/config/firebase';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import AppNavigator from './src/navigation';
import { ScanProvider } from './src/context/ScanContext'; // Add this import
import { RootParamList } from './src/types';
import { OnboardingStore } from './src/services/OnboardingStore';

interface UserState {
  emailVerified: boolean;
  hasRoleSelected: boolean;
  hasTeam: boolean;
  onboardingComplete: boolean;
  verifiedPCF: boolean;
  isOwnerOnly: boolean;
  businessName?: string;
  email: string;
  role?: 'owner' | 'ownerWithTeam' | 'ownerOnly';
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

function AppContent() {
  const { colors } = useTheme();
  const [isInitialized, setIsInitialized] = useState(false);
  const [initialRoute, setInitialRoute] = useState<keyof RootParamList>('Auth');

  const determineInitialRoute = async (user: User, userData: Partial<UserState> | null): Promise<keyof RootParamList> => {
    if (!user) {
      console.log('[Navigation] No user, routing to Auth');
      return 'Auth';
    }

    const onboardingData = await OnboardingStore.get();
    if (onboardingData) {
      console.log('[Navigation] Found onboarding data, continuing onboarding flow');
      if (!user.emailVerified) {
        return 'OnboardingVerification';
      }
      return 'OnboardingPCF';
    }

    if (!userData) {
      console.log('[Navigation] No user data found, routing to Auth');
      return 'Auth';
    }

    if (!userData.onboardingComplete) {
      if (!user.emailVerified) {
        console.log('[Navigation] User not verified, routing to OnboardingVerification');
        return 'OnboardingVerification';
      }

      if (userData.verifiedPCF === false && userData.isOwnerOnly === false) {
        console.log('[Navigation] PCF not verified, routing to OnboardingPCF');
        return 'OnboardingPCF';
      }

      if (userData.hasRoleSelected === false) {
        console.log('[Navigation] Role not selected, routing to OnboardingRole');
        return 'OnboardingRole';
      }

      if (!userData.businessName) {
        console.log('[Navigation] Business details not complete, routing to OnboardingBusiness');
        return 'OnboardingBusiness';
      }
    }

    console.log('[Navigation] Onboarding complete, routing to Dashboard');
    return 'Dashboard';
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          console.log(`[Auth State] User authenticated: ${user.uid}`);
          const userDocRef = doc(db, 'users', user.uid);
          const userDocSnap = await getDoc(userDocRef);

          const userData = userDocSnap.exists() 
            ? userDocSnap.data() as Partial<UserState>
            : null;

          if (!userDocSnap.exists()) {
            console.log('[Firestore] No user document found - may be in onboarding');
          }

          const route = await determineInitialRoute(user, userData);
          setInitialRoute(route);
        } else {
          console.log('[Auth State] No user authenticated');
          setInitialRoute('Auth');
        }
      } catch (error) {
        console.error('[Error] Auth state change:', error);
        setInitialRoute('Auth');
      } finally {
        setIsInitialized(true);
      }
    });

    return () => unsubscribe();
  }, []);

  if (!isInitialized) {
    return (
      <View style={[styles.loader, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style="light" />
      <AppNavigator initialRouteName={initialRoute} />
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <ScanProvider> {/* Wrap the app with ScanProvider */}
          <AppContent />
        </ScanProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}