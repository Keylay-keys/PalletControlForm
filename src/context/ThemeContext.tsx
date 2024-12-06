// src/context/ThemeContext.tsx
import React, { createContext, useContext, useState } from 'react';
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';
import { createDarkColors } from '../constants/colors';

type ThemeContextType = {
  colors: ReturnType<typeof createDarkColors>;
};

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const insets = useSafeAreaInsets();

  // Always use dark mode
  const colors = createDarkColors(insets);

  const value = {
    colors,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
