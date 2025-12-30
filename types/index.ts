// TypeScript type definitions for AURA app

export interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  presenceScore: number;
  isHelper: boolean;
  location?: Location;
  verified: boolean;
}

export interface Location {
  latitude: number;
  longitude: number;
  timestamp: number;
}

export interface Helper {
  user: User;
  distance: number; // in meters
  estimatedArrival?: number; // in seconds
}

export interface PresenceRequest {
  id: string;
  userId: string;
  location: Location;
  timestamp: number;
  status: 'active' | 'resolved' | 'cancelled';
  helpers: Helper[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: number;
}

