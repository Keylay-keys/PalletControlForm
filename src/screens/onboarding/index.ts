// src/screens/onboarding/index.ts

export { default as OnboardingStart } from './common/OnboardingStart';
export { default as OnboardingPCF } from './common/OnboardingPCF';
export { default as OnboardingBusiness } from './common/OnboardingBusiness'
export { default as OnboardingVerification } from './common/OnboardingVerification'
export { default as OnboardingRole } from './common/OnboardingRole'

// Add types specific to onboarding screens
export interface OnboardingStepProps {
 navigation: any; // Will replace with proper typed navigation
 route: {
   params: {
     email: string;
     routeNumber?: string;
     password?: string;
     isOwnerOnly?: boolean;
     verifiedPCF?: boolean;
   }
 }
}