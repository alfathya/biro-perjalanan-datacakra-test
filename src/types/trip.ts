import { TripStatus } from "@prisma/client";

export interface CreateTripRequest {
  touristId: string;
  destinationId: string;
  tanggalMulaiPerjalanan: string | Date;
  tanggalBerakhirPerjalanan: string | Date;
  participants: number;
  totalPrice: number;
  notes?: string;
  specialRequests?: string;
  status?: TripStatus;
}

export interface UpdateTripRequest {
  destinationId?: string;
  tanggalMulaiPerjalanan?: string | Date;
  tanggalBerakhirPerjalanan?: string | Date;
  participants?: number;
  totalPrice?: number;
  notes?: string;
  specialRequests?: string;
  status?: TripStatus;
  rating?: number;
  review?: string;
}

export interface TripResponse {
  id: string;
  touristId: string;
  destinationId: string;
  tanggalMulaiPerjalanan: Date;
  tanggalBerakhirPerjalanan: Date;
  participants: number;
  notes?: string | null;
  specialRequests?: string | null;
  totalPrice: number;
  status: TripStatus;
  createdById: string;
  rating?: number | null;
  review?: string | null;
  createdAt: Date;
  updatedAt: Date;
  tourist?: {
    id: string;
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      phone?: string | null;
    };
  };
  destination?: {
    id: string;
    name: string;
    country?: string | null;
    city?: string | null;
    description?: string | null;
    imageUrl?: string | null;
  };
  createdBy?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  payment?: {
    id: string;
    amount: number;
    method: string;
    status: string;
    transactionId?: string | null;
    paymentDate?: Date | null;
  } | null;
}

export interface TripListResponse {
  data: TripResponse[];
  meta: {
    current: number;
    pages: number;
    total: number;
    limit: number;
  };
}