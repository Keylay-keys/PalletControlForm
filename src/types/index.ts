// src/types/index.ts
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';


export { Route, TeamMember, UserProfile, Store, MasterListItem } from './firestore';

// Basic OCR/Scanner Types
export interface PageInfo {
  current: number;
  total: number;
}

export interface PCFLineItem {
  product: string;
  description: string;
  batch?: string;
  bestBefore?: string;
  days: string;
  isShortCoded: boolean;
}

export interface PCFScanResult {
  lineItems: PCFLineItem[];
  containerCode: string;
  pageInfo?: PageInfo;          // Added for multi-page support
}

// Database Types
export interface PCFDocument {
  containerCode: string;
  currentPage: number;
  totalPages: number;
  dateScanned: Date;           // Same as createdAt
  lineItems: PCFLineItem[];
  isComplete: boolean;
  orderNumber?: string;        // Optional until we get it from scan
  imageUri: string;
  lastProcessed?: Date;
}

// Settings & Configuration
export interface AlertSettings {
  globalAlertDays: number;     // Default days before expiration for alert
  deleteDays: number;          // Days after expiration to keep records
  notificationTime?: string;   // When to send daily notifications
}

// Search & Filtering
export interface SearchFilters {
  productNumber?: string;
  orderNumber?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  isShortCodedOnly?: boolean;
  expiringWithinDays?: number;
}

// Constants
export const PCF_CONSTANTS = {
  DEFAULT_ALERT_DAYS: 3,
  DEFAULT_DELETE_DAYS: 5,
  SHORT_CODED_MARKER: '*',
  STORAGE_KEYS: {
    SETTINGS: 'pcf_settings',
    DOCUMENTS: 'pcf_documents',
    NOTIFICATIONS: 'pcf_notifications'
  }
} as const;

// Error Types
export interface PCFError extends Error {
  code: string;
  details?: any;
}

export interface TeamMemberInvite {
  type: 'pcf_upload' | 'route_operator';
  ownerEmail: string;
  routeNumber: string;
  inviteCode: string;
}

export interface BusinessVerificationData {
  businessName: string;
  businessPhone: string;
  businessState: string; // Add businessState here
  teamMembers: TeamMemberInitial[];
}

export interface TeamMemberInitial {
  email: string;
  name: string;
  routeNumber: string;
}


// RootParamList for navigation
export type RootParamList = {
  // Existing auth screens
  Auth: undefined;
  Login: undefined;

  // New unified onboarding flow
  OnboardingStart: undefined; // Initial signup screen

  OnboardingPCF: {
    email: string;
    routeNumber: string;
    password: string;
    isTeamMember: boolean;
  };

  OnboardingBusiness: {
    email: string;
    routeNumber: string;
    role: 'owner' | 'ownerWithTeam' | 'ownerOnly';
    isOwnerOnly: boolean;
    verifiedPCF?: boolean;
    password: string;
    teamMembers?: TeamMemberInitial[];
    verifiedRoutes?: string[];
    userId?: string; // Add userId here
  };

OnboardingVerification: {
  email: string;
  routeNumber?: string;
  userId?: string; 
  isOwnerOnly?: boolean;
  businessData?: BusinessVerificationData;
  verifiedPCF?: boolean;
};
OnboardingRole: {
  email: string;
  routeNumber: string;
  verifiedPCF: boolean;
  password: string;
  userId: string;
};

  // Additional onboarding routes
  AdditionalRoutes: {
    email: string;
    routeNumber: string;
    role: 'owner' | 'ownerWithTeam' | 'ownerOnly';
    verifiedPCF: boolean;
    hasTeam?: boolean;
    password: string;
    userId: string;
  };

  VerificationPending: {
    email: string;
    routeNumber: string;
    pendingTeamMember?: boolean;
    password?: string;
    userId: string; // Add userId here
  };

  TeamMemberOnboarding: {
    inviteCode?: string;
  };

  TeamMemberSetup: {
    routeNumber: string;
    ownerEmail: string;
  };

  // Deprecated or transitional screens
  CreateAccountScreen: undefined;
  Verification: {
    email: string;
    message?: string;
  };
  PendingReview: undefined;
  RoleSelection: undefined; // Deprecated
  OwnerOnboarding: {
    hasTeamMembers?: boolean;
  }; // Deprecated
  OwnerOnlyOnboarding: undefined; // Deprecated

  // Main application screens
  Dashboard: {
    initialView?: 'operator' | 'management';
  };

  Intro: undefined;

  OperatorDashboard: {
    primaryRoute: string | null;
  };
  ManagementDashboard: undefined;

  TeamSetup: {
    routes: string[];
    ownerType: 'owner' | 'ownerOnly';
  };

  PalletControlFormUpload: {
    routes: string[];
    businessName: string;
  };

  Scan: undefined;
  Search: undefined;
  MainScanner: undefined;

  Settings: undefined;
  NotificationSettings: undefined;
  AccountSettings: undefined;
  ChangePassword: undefined;
};
