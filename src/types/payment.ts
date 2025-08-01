import { PaymentMethod, PaymentStatus } from "@prisma/client";

export interface CreatePaymentRequest {
  tripId: string;
  amount: number;
  method: PaymentMethod;
  transactionId?: string;
  notes?: string;
}

export interface UpdatePaymentRequest {
  amount?: number;
  method?: PaymentMethod;
  transactionId?: string;
  notes?: string;
}

export interface PaymentResponse {
  id: string;
  tripId: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string | null;
  paymentDate?: Date | null;
  notes?: string | null;
  createdAt: Date;
  trip?: {
    id: string;
    tanggalMulaiPerjalanan: Date;
    tanggalBerakhirPerjalanan: Date;
    participants: number;
    totalPrice: number;
    status: string;
    notes?: string | null;
    specialRequests?: string | null;
    rating?: number | null;
    review?: string | null;
    touristId: string;
    destinationId: string;
    createdById: string;
    createdAt: Date;
    updatedAt: Date;
    tourist: {
      id: string;
      user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        phone?: string | null;
      };
    };
    destination: {
      id: string;
      name: string;
      country?: string | null;
      city?: string | null;
    };
  };
}

export interface VerifyPaymentRequest {
  status: PaymentStatus; // must be "paid", "refunded", or "cancelled"
}