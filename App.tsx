import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationProvider, useNavigation } from './src/navigation';
import {
  DashboardScreen,
  ScanScreen,
  SearchScreen,
  SettingsScreen,
  LoginScreen,
  IntroScreen,
} from './src/screens';

function AppContent() {
  const { currentScreen, navigate } = useNavigation();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [hasSeenIntro, setHasSeenIntro] = useState<boolean | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Handle initial app state
  useEffect(() => {
    const initializeApp = async () => {
      try {
        const loggedIn = await simulateFetchLoginState();
        const seenIntro = await simulateFetchIntroState();

        setIsLoggedIn(loggedIn);
        setHasSeenIntro(seenIntro);
        setIsInitialized(true);

        // Only navigate on initial load
        if (!isInitialized) {
          if (!loggedIn) {
            navigate('Login');
          } else if (!seenIntro) {
            navigate('Intro');
          } else {
            navigate('Dashboard');
          }
        }
      } catch (error) {
        console.error('Error initializing app:', error);
        setIsInitialized(true);
        navigate('Login');
      }
    };

    if (!isInitialized) {
      initializeApp();
    }
  }, [navigate, isInitialized]);

  // Handle successful login
  const handleLoginSuccess = (userData: any) => {
    setIsLoggedIn(true);
    // You might want to store the user data in a context or state management solution
    if (!hasSeenIntro) {
      navigate('Intro');
    } else {
      navigate('Dashboard');
    }
  };

  const simulateFetchLoginState = async () => {
    return false; // Replace with real fetch logic
  };

  const simulateFetchIntroState = async () => {
    return false; // Replace with real fetch logic
  };

  if (!isInitialized) {
    return null; // Or return a loading spinner
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      {currentScreen === 'Login' && (
        <LoginScreen onLoginSuccess={handleLoginSuccess} />
      )}
      {currentScreen === 'Intro' && <IntroScreen />}
      {currentScreen === 'Dashboard' && <DashboardScreen />}
      {currentScreen === 'Scan' && <ScanScreen />}
      {currentScreen === 'Search' && <SearchScreen />}
      {currentScreen === 'Settings' && <SettingsScreen />}
    </View>
  );
}

export default function App() {
  return (
    <NavigationProvider>
      <AppContent />
    </NavigationProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});