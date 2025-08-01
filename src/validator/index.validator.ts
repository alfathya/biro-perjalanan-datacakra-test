import { z } from "zod";

export const RegisterSchema = z
  .object({
    email: z.email("Invalid email format"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    phone: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password and confirm password must match",
    path: ["confirmPassword"],
  });

export const LoginSchema = z.object({
  email: z.email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export const CreateTouristSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.email("Invalid email format"),
  password: z.string().min(8),
  confirmPassword: z.string().min(8),
  phone: z.string().optional(),
  nationality: z.string().optional(),
  identityNumber: z.string().optional(),
  emergencyContact: z.string().optional(),
  dateOfBirth: z.string().optional(),
  address: z
    .object({
      street: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      postalCode: z.string().optional(),
      country: z.string().optional(),
    })
    .optional(),
});

export const updateTouristProfileSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  dateOfBirth: z.coerce.date().optional(),
  nationality: z.string().optional(),
  identityNumber: z.string().optional(),
  emergencyContact: z.string().optional(),
  isActive: z.boolean().optional(),
  address: z
    .object({
      street: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      postalCode: z.string().optional(),
      country: z.string().optional(),
    })
    .optional(),
});

export const createDestinationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  country: z.string().optional(),
  city: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  description: z.string().optional(),
  imageUrl: z.string().url().optional(),
});

export const updateDestinationSchema = createDestinationSchema.partial();

export const createTripSchema = z.object({
  touristId: z.string().uuid("Tourist ID harus berupa UUID yang valid"),
  destinationId: z.string().uuid("Destination ID harus berupa UUID yang valid"),
  tanggalMulaiPerjalanan: z.coerce.date(),
  tanggalBerakhirPerjalanan: z.coerce.date(),
  participants: z.number().min(1, "Jumlah peserta minimal 1"),
  totalPrice: z.number().min(0, "Total harga tidak boleh negatif"),
  notes: z.string().optional(),
  specialRequests: z.string().optional(),
  status: z.enum(['planned', 'confirmed', 'cancelled']).optional(),
}).refine((data) => {
  return new Date(data.tanggalBerakhirPerjalanan) > new Date(data.tanggalMulaiPerjalanan);
}, {
  message: "Tanggal berakhir perjalanan harus setelah tanggal mulai perjalanan",
  path: ["tanggalBerakhirPerjalanan"],
});

export const updateTripSchema = z.object({
  destinationId: z.string().uuid("Destination ID harus berupa UUID yang valid").optional(),
  tanggalMulaiPerjalanan: z.coerce.date().optional(),
  tanggalBerakhirPerjalanan: z.coerce.date().optional(),
  participants: z.number().min(1, "Jumlah peserta minimal 1").optional(),
  totalPrice: z.number().min(0, "Total harga tidak boleh negatif").optional(),
  notes: z.string().optional(),
  specialRequests: z.string().optional(),
  status: z.enum(['planned', 'confirmed', 'cancelled']).optional(),
  rating: z.number().min(1).max(5, "Rating harus antara 1-5").optional(),
  review: z.string().optional(),
}).refine((data) => {
  if (data.tanggalMulaiPerjalanan && data.tanggalBerakhirPerjalanan) {
    return new Date(data.tanggalBerakhirPerjalanan) > new Date(data.tanggalMulaiPerjalanan);
  }
  return true;
}, {
  message: "Tanggal berakhir perjalanan harus setelah tanggal mulai perjalanan",
  path: ["tanggalBerakhirPerjalanan"],
});

export const createPaymentSchema = z.object({
  tripId: z.string().uuid("Trip ID harus berupa UUID yang valid"),
  amount: z.number().min(0, "Amount tidak boleh negatif"),
  method: z.enum(['cash', 'bank_transfer', 'credit_card', 'digital_wallet'], {
    message: "Payment method harus salah satu dari: cash, bank_transfer, credit_card, digital_wallet"
  }),
  transactionId: z.string().optional(),
  notes: z.string().optional(),
});

export const updatePaymentSchema = z.object({
  amount: z.number().min(0, "Amount tidak boleh negatif").optional(),
  method: z.enum(['cash', 'bank_transfer', 'credit_card', 'digital_wallet'], {
    message: "Payment method harus salah satu dari: cash, bank_transfer, credit_card, digital_wallet"
  }).optional(),
  transactionId: z.string().optional(),
  paymentDate: z.coerce.date().optional(),
  notes: z.string().optional(),
});

export const VerifyPaymentSchema = z.object({
  status: z
    .enum(["paid", "refunded", "cancelled"])
    .refine((val) => ["paid", "refunded", "cancelled"].includes(val), {
      message:
        "Only 'paid', 'refunded', or 'cancelled' are allowed for verification",
    }),
});

export type CreateTripInput = z.infer<typeof createTripSchema>;
export type UpdateTripInput = z.infer<typeof updateTripSchema>;
export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
export type UpdatePaymentInput = z.infer<typeof updatePaymentSchema>;