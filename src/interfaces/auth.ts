// src/interfaces/auth.ts
export interface UserData {
    uid: string;
    email: string;
    routeNumber: string;
    emailVerified?: boolean;
    adminReviewStatus?: 'pending' | 'approved' | 'rejected';
    hasRoleSelected?: boolean; // Ensures compatibility with LoginScreen logic
    hasTeam?: boolean; // For dashboard redirection logic
  }
  
  export interface LoginScreenProps {
    onLoginSuccess: (userData: UserData) => void;
  }