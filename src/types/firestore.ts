// src/types/firestore.ts
import { Timestamp } from 'firebase/firestore';

// User Profile
export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  businessName: string;
  phone: string;
  state: string; // State abbreviation
  userType: 'owner' | 'teamMember';
  ownerId?: string; // Optional, for team members
  createdAt: Timestamp; // Firestore timestamp
  hasTeam?: boolean; // Indicates if the owner has a team
  verified: boolean; // Whether the email is verified
  adminReviewStatus?: 'pending' | 'approved' | 'rejected'; // Admin review status
  hasRoleSelected?: boolean; // Indicates if a role has been selected
  onboardingComplete?: boolean; // Indicates if the onboarding process is complete
  verifiedPCF?: boolean; // Indicates if the Pallet Control Form was verified
  isOwnerOnly?: boolean; // Indicates if the user is an owner-only account
  lastUpdated?: Timestamp; // Last time the profile was updated
}

// Route Information
export interface Route {
  id: string; // Firestore document ID
  number: string; // Route number
  ownerId: string; // Owner ID for the route
  assignedTo?: string; // Assigned team member ID
  stores: string[]; // List of store IDs
  state: string; // State abbreviation
  createdAt: Timestamp; // Timestamp when the route was created
  isOwnerWorking: boolean; // Indicates if the owner is managing the route
  storeCount: number; // Total number of stores in the route
  teamMember?: string; // Optional team member assignment
}

// Store Information
export interface Store {
  routeId: string; // ID of the associated route
  storeName: string; // Name of the store
}

export interface TeamMember {
  id: string; // Firestore document ID
  name: string; // Team member's full name
  email: string; // Email address
  ownerId: string; // The owner who manages this team member
  assignedRoutes: string[]; // IDs of routes assigned to the team member
  currentRoutes: string[]; // IDs of currently active routes
  pendingStales: number; // Number of pending stale items to review
  pendingCredits: number; // Number of pending credits to approve
  status: 'pending' | 'active' | 'inactive'; // Status of the team member
  invitedAt: Timestamp; // When the invitation to join was sent
  lastActive?: Timestamp; // Last time the team member was active
  role?: 'driver' | 'manager' | 'assistant'; // Optional role
}

// Master List Item
export interface MasterListItem {
  productNumber: string;
  description: string;
  state: string; // The state where the item was added/verified
  confirmedCount: number; // Number of times this item has been confirmed
  firstAddedBy: string; // User ID of the person who added it
  lastVerifiedAt: Timestamp;
}
