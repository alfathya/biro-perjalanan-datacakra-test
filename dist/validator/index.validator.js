"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyPaymentSchema = exports.updatePaymentSchema = exports.createPaymentSchema = exports.updateTripSchema = exports.createTripSchema = exports.updateDestinationSchema = exports.createDestinationSchema = exports.updateTouristProfileSchema = exports.CreateTouristSchema = exports.LoginSchema = exports.RegisterSchema = void 0;
const zod_1 = require("zod");
exports.RegisterSchema = zod_1.z
    .object({
    email: zod_1.z.email("Invalid email format"),
    password: zod_1.z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: zod_1.z.string().min(8, "Password must be at least 8 characters"),
    firstName: zod_1.z.string().min(1),
    lastName: zod_1.z.string().min(1),
    phone: zod_1.z.string().optional(),
})
    .refine((data) => data.password === data.confirmPassword, {
    message: "Password and confirm password must match",
    path: ["confirmPassword"],
});
exports.LoginSchema = zod_1.z.object({
    email: zod_1.z.email("Invalid email format"),
    password: zod_1.z.string().min(1, "Password is required"),
});
exports.CreateTouristSchema = zod_1.z.object({
    firstName: zod_1.z.string(),
    lastName: zod_1.z.string(),
    email: zod_1.z.email("Invalid email format"),
    password: zod_1.z.string().min(8),
    confirmPassword: zod_1.z.string().min(8),
    phone: zod_1.z.string().optional(),
    nationality: zod_1.z.string().optional(),
    identityNumber: zod_1.z.string().optional(),
    emergencyContact: zod_1.z.string().optional(),
    dateOfBirth: zod_1.z.string().optional(),
    address: zod_1.z
        .object({
        street: zod_1.z.string().optional(),
        city: zod_1.z.string().optional(),
        state: zod_1.z.string().optional(),
        postalCode: zod_1.z.string().optional(),
        country: zod_1.z.string().optional(),
    })
        .optional(),
});
exports.updateTouristProfileSchema = zod_1.z.object({
    firstName: zod_1.z.string().optional(),
    lastName: zod_1.z.string().optional(),
    phone: zod_1.z.string().optional(),
    dateOfBirth: zod_1.z.coerce.date().optional(),
    nationality: zod_1.z.string().optional(),
    identityNumber: zod_1.z.string().optional(),
    emergencyContact: zod_1.z.string().optional(),
    isActive: zod_1.z.boolean().optional(),
    address: zod_1.z
        .object({
        street: zod_1.z.string().optional(),
        city: zod_1.z.string().optional(),
        state: zod_1.z.string().optional(),
        postalCode: zod_1.z.string().optional(),
        country: zod_1.z.string().optional(),
    })
        .optional(),
});
exports.createDestinationSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required"),
    country: zod_1.z.string().optional(),
    city: zod_1.z.string().optional(),
    latitude: zod_1.z.number().optional(),
    longitude: zod_1.z.number().optional(),
    description: zod_1.z.string().optional(),
    imageUrl: zod_1.z.string().url().optional(),
});
exports.updateDestinationSchema = exports.createDestinationSchema.partial();
exports.createTripSchema = zod_1.z.object({
    touristId: zod_1.z.string().uuid("Tourist ID harus berupa UUID yang valid"),
    destinationId: zod_1.z.string().uuid("Destination ID harus berupa UUID yang valid"),
    tanggalMulaiPerjalanan: zod_1.z.coerce.date(),
    tanggalBerakhirPerjalanan: zod_1.z.coerce.date(),
    participants: zod_1.z.number().min(1, "Jumlah peserta minimal 1"),
    totalPrice: zod_1.z.number().min(0, "Total harga tidak boleh negatif"),
    notes: zod_1.z.string().optional(),
    specialRequests: zod_1.z.string().optional(),
    status: zod_1.z.enum(['planned', 'confirmed', 'cancelled']).optional(),
}).refine((data) => {
    return new Date(data.tanggalBerakhirPerjalanan) > new Date(data.tanggalMulaiPerjalanan);
}, {
    message: "Tanggal berakhir perjalanan harus setelah tanggal mulai perjalanan",
    path: ["tanggalBerakhirPerjalanan"],
});
exports.updateTripSchema = zod_1.z.object({
    destinationId: zod_1.z.string().uuid("Destination ID harus berupa UUID yang valid").optional(),
    tanggalMulaiPerjalanan: zod_1.z.coerce.date().optional(),
    tanggalBerakhirPerjalanan: zod_1.z.coerce.date().optional(),
    participants: zod_1.z.number().min(1, "Jumlah peserta minimal 1").optional(),
    totalPrice: zod_1.z.number().min(0, "Total harga tidak boleh negatif").optional(),
    notes: zod_1.z.string().optional(),
    specialRequests: zod_1.z.string().optional(),
    status: zod_1.z.enum(['planned', 'confirmed', 'cancelled']).optional(),
    rating: zod_1.z.number().min(1).max(5, "Rating harus antara 1-5").optional(),
    review: zod_1.z.string().optional(),
}).refine((data) => {
    if (data.tanggalMulaiPerjalanan && data.tanggalBerakhirPerjalanan) {
        return new Date(data.tanggalBerakhirPerjalanan) > new Date(data.tanggalMulaiPerjalanan);
    }
    return true;
}, {
    message: "Tanggal berakhir perjalanan harus setelah tanggal mulai perjalanan",
    path: ["tanggalBerakhirPerjalanan"],
});
exports.createPaymentSchema = zod_1.z.object({
    tripId: zod_1.z.string().uuid("Trip ID harus berupa UUID yang valid"),
    amount: zod_1.z.number().min(0, "Amount tidak boleh negatif"),
    method: zod_1.z.enum(['cash', 'bank_transfer', 'credit_card', 'digital_wallet'], {
        message: "Payment method harus salah satu dari: cash, bank_transfer, credit_card, digital_wallet"
    }),
    transactionId: zod_1.z.string().optional(),
    notes: zod_1.z.string().optional(),
});
exports.updatePaymentSchema = zod_1.z.object({
    amount: zod_1.z.number().min(0, "Amount tidak boleh negatif").optional(),
    method: zod_1.z.enum(['cash', 'bank_transfer', 'credit_card', 'digital_wallet'], {
        message: "Payment method harus salah satu dari: cash, bank_transfer, credit_card, digital_wallet"
    }).optional(),
    transactionId: zod_1.z.string().optional(),
    paymentDate: zod_1.z.coerce.date().optional(),
    notes: zod_1.z.string().optional(),
});
exports.VerifyPaymentSchema = zod_1.z.object({
    status: zod_1.z
        .enum(["paid", "refunded", "cancelled"])
        .refine((val) => ["paid", "refunded", "cancelled"].includes(val), {
        message: "Only 'paid', 'refunded', or 'cancelled' are allowed for verification",
    }),
});
