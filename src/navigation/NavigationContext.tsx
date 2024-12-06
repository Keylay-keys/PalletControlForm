// NavigationContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { RootParamList } from '../types'; // Import the RootParamList for screen names

// Derive valid screen names from RootParamList
export type ScreenName = keyof RootParamList;

interface NavigationContextValue {
  currentScreen: ScreenName;
  navigate: (screen: ScreenName) => void;
}

// Create the navigation context with default values
const NavigationContext = createContext<NavigationContextValue>({
  currentScreen: 'Login', // Initial screen when context is uninitialized
  navigate: () => {}, // No-op by default
});

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  // State to track the current active screen
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('Login');

  // Function to navigate to a different screen
  const navigate = (screen: ScreenName) => {
    if (currentScreen === screen) {
      console.log(`Already on ${screen}, skipping navigation`);
      return;
    }
    console.log(`Navigating to: ${screen} (Triggered from ${currentScreen})`);
    setCurrentScreen(screen);
  };

  // Log state changes for debugging
  useEffect(() => {
    console.log(`Current screen updated to: ${currentScreen}`);
  }, [currentScreen]);

  return (
    <NavigationContext.Provider value={{ currentScreen, navigate }}>
      {children}
    </NavigationContext.Provider>
  );
}

// Hook to use the navigation context
export function useNavigation() {
  return useContext(NavigationContext);
}
