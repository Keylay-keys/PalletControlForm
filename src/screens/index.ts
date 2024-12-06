// src/screens/index.ts
// Authentication screens
export { default as AuthScreen } from './AuthScreen';
export { default as LoginScreen } from './LoginScreen';
export { default as CreateAccountScreen } from './CreateAccountScreen';
export { default as VerificationScreen } from './VerificationScreen';
export { default as PendingReviewScreen } from './PendingReviewScreen';

export { 
    OnboardingStart,
    OnboardingPCF,
    OnboardingBusiness,
    OnboardingVerification,
    OnboardingRole 
  } from './onboarding';


// Onboarding screens
export { default as RoleSelectionScreen } from './RoleSelectionScreen';
export { default as OwnerOnboardingScreen } from './OwnerOnboardingScreen';
export { default as OwnerOnlyOnboardingScreen } from './OwnerOnlyOnboardingScreen';
export { default as TeamSetupScreen } from './TeamSetupScreen';
export { default as IntroScreen } from './IntroScreen';

// Main application screens
export { default as DashboardScreen } from './DashboardScreen';
export { ScanScreen } from './ScanScreen';
export { MainScannerScreen } from './MainScannerScreen';
export { ScannerScreen } from './ScannerScreen'
export { default as SearchScreen } from './SearchScreen';
export { default as SettingsScreen } from './SettingsScreen';
export { default as PalletControlFormUpload } from './PalletControlFormUpload';

// Note: Auth components should be exported from components/auth/index.ts instead