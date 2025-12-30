// Firebase-specific type definitions

export interface FirestoreUser {
  id: string;
  phone: string;
  firstName: string;
  lastName?: string;
  isHelper: boolean;
  location?: {
    lat: number;
    lng: number;
    geohash: string;
    updatedAt: number;
  };
  reputation: number;
  verified: boolean;
  createdAt: number;
  lastActiveAt: number;
  deviceId?: string;
}

export interface SOSRequest {
  id: string;
  userId: string;
  location: {
    lat: number;
    lng: number;
    geohash: string;
  };
  status: 'active' | 'closed' | 'cancelled';
  helpers: Array<{
    userId: string;
    distance: number; // in meters
    status: 'notified' | 'responding' | 'on_way' | 'arrived' | 'cancelled';
    respondedAt?: number;
  }>;
  createdAt: number;
  closedAt?: number;
  message?: string; // Optional status message
}

export interface HelperResponse {
  id: string;
  sosRequestId: string;
  helperId: string;
  status: 'accepted' | 'declined' | 'on_way' | 'arrived' | 'cancelled';
  distance: number;
  respondedAt: number;
  arrivedAt?: number;
}

export interface ReputationData {
  userId: string;
  points: number;
  totalHelps: number;
  totalSOS: number;
  responseRate: number;
  averageResponseTime?: number; // in seconds
  streaks: {
    current: number;
    longest: number;
    lastActiveDate: string; // YYYY-MM-DD
  };
  badges: Array<{
    id: string;
    name: string;
    earnedAt: number;
  }>;
  dailyPoints: {
    date: string; // YYYY-MM-DD
    points: number;
  }[];
  updatedAt: number;
}

export interface Report {
  id: string;
  reporterId: string;
  reportedUserId: string;
  sosRequestId?: string;
  reason: 'abuse' | 'spam' | 'inappropriate' | 'other';
  description?: string;
  createdAt: number;
  status: 'pending' | 'reviewed' | 'resolved';
}

