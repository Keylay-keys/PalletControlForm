// src/constants/colors.ts
import { EdgeInsets } from 'react-native-safe-area-context';

export const createDarkColors = (insets: EdgeInsets) => ({
  primary: '#00897B',         // Dark teal or brand-specific primary
  secondary: '#26A69A',       // Accent color

  background: '#121212',      // True dark mode background
  cardBg: '#1E1E1E',          // Card backgrounds lighter than primary background
  backgroundAlt: '#2E2E2E',   // Slightly lighter background for alternate use

  textPrimary: '#FFFFFF',     // White text for primary readability
  textSecondary: '#B0BEC5',   // Softer muted text
  textMuted: '#78909C',       // More muted for labels, etc.

  border: '#37474F',          // Subtle grayish border

  error: '#EF5350',           // Red for errors
  warning: '#FFB74D',         // Amber for warnings

  safeArea: {
    container: {
      flex: 1,
      paddingTop: insets.top || 16,
      paddingBottom: insets.bottom || 0,
      paddingLeft: insets.left || 0,
      paddingRight: insets.right || 0,
    },
  },
});

