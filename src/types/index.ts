export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  pagination?: {
    current: number;
    pages: number;
    total: number;
    limit: number;
  };
}

export interface TouristListItem {
  id: string;
  userId: string;
  email: string;
  name: string;
  isActive: boolean;
  phone?: string;
  totalTrips: number;
  totalSpent: number;
  loyaltyPoints: number;
  membershipLevel: string;
  createdAt: Date;
}

export interface TouristDetail extends TouristListItem {
  trips: Trip[];
}

export interface Trip {
  id: string;
  userId: string;
  destination: string;
  startDate: Date;
  endDate: Date;
  cost: number;
  createdAt: Date;
}

export interface TripDetail extends Trip {
  destination: string;
  startDate: Date;
  endDate: Date;
  cost: number;
  createdAt: Date;
}

export interface CreateDestinationRequest {
  name: string;
  country?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  description?: string;
  imageUrl?: string;
}

export interface UpdateDestinationRequest extends CreateDestinationRequest {
  id: string;
}