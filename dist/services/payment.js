"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentService = exports.PaymentService = void 0;
const prisma_1 = require("../utils/prisma");
const apiError_1 = require("../utils/apiError");
class PaymentService {
    async createPayment(data) {
        try {
            const existingTrip = await prisma_1.prisma.trip.findUnique({
                where: { id: data.tripId },
                include: { payment: true }
            });
            if (!existingTrip) {
                throw new apiError_1.ApiError("Trip tidak ditemukan", 404);
            }
            if (existingTrip.payment) {
                throw new apiError_1.ApiError("Trip ini sudah memiliki payment", 400);
            }
            if (existingTrip.totalPrice !== data.amount) {
                throw new apiError_1.ApiError("Jumlah pembayaran tidak sesuai dengan total harga", 400);
            }
            const payment = await prisma_1.prisma.payment.create({
                data: {
                    tripId: data.tripId,
                    amount: data.amount,
                    method: data.method,
                    transactionId: data.transactionId,
                    notes: data.notes,
                    status: "pending",
                },
                include: {
                    trip: {
                        include: {
                            tourist: {
                                select: {
                                    id: true,
                                    user: {
                                        select: {
                                            id: true,
                                            firstName: true,
                                            lastName: true,
                                            email: true,
                                        },
                                    },
                                },
                            },
                            destination: {
                                select: {
                                    id: true,
                                    name: true,
                                    country: true,
                                    city: true,
                                },
                            },
                        },
                    },
                },
            });
            return payment;
        }
        catch (error) {
            if (error instanceof apiError_1.ApiError) {
                throw error;
            }
            throw new apiError_1.ApiError("Gagal membuat payment", 500);
        }
    }
    async getAllPayments(page = 1, limit = 10) {
        try {
            const skip = (page - 1) * limit;
            const [payments, total] = await Promise.all([
                prisma_1.prisma.payment.findMany({
                    skip,
                    take: limit,
                    include: {
                        trip: {
                            include: {
                                tourist: {
                                    select: {
                                        id: true,
                                        user: {
                                            select: {
                                                id: true,
                                                firstName: true,
                                                lastName: true,
                                                email: true
                                            }
                                        }
                                    }
                                },
                                destination: {
                                    select: {
                                        id: true,
                                        name: true,
                                        country: true,
                                        city: true
                                    }
                                }
                            }
                        }
                    },
                    orderBy: { createdAt: 'desc' }
                }),
                prisma_1.prisma.payment.count()
            ]);
            return {
                data: payments,
                meta: {
                    current: page,
                    pages: Math.ceil(total / limit),
                    total: total,
                    limit: limit,
                },
            };
        }
        catch (error) {
            throw new apiError_1.ApiError("Gagal mengambil data payments", 500);
        }
    }
    async getPaymentById(id) {
        try {
            const payment = await prisma_1.prisma.payment.findUnique({
                where: { id },
                include: {
                    trip: {
                        include: {
                            tourist: {
                                select: {
                                    id: true,
                                    user: {
                                        select: {
                                            id: true,
                                            firstName: true,
                                            lastName: true,
                                            email: true
                                        }
                                    }
                                }
                            },
                            destination: {
                                select: {
                                    id: true,
                                    name: true,
                                    country: true,
                                    city: true
                                }
                            }
                        }
                    }
                }
            });
            if (!payment) {
                throw new apiError_1.ApiError("Payment tidak ditemukan", 404);
            }
            return payment;
        }
        catch (error) {
            throw new apiError_1.ApiError("Gagal mengambil data payment", 500);
        }
    }
    async getPaymentByTripId(tripId) {
        try {
            const payment = await prisma_1.prisma.payment.findUnique({
                where: { tripId },
                include: {
                    trip: {
                        include: {
                            tourist: {
                                select: {
                                    id: true,
                                    user: {
                                        select: {
                                            id: true,
                                            firstName: true,
                                            lastName: true,
                                            email: true
                                        }
                                    }
                                }
                            },
                            destination: {
                                select: {
                                    id: true,
                                    name: true,
                                    country: true,
                                    city: true
                                }
                            }
                        }
                    }
                }
            });
            return payment;
        }
        catch (error) {
            throw new apiError_1.ApiError("Gagal mengambil data payment", 500);
        }
    }
    async updatePayment(id, data) {
        try {
            const existingPayment = await prisma_1.prisma.payment.findUnique({
                where: { id }
            });
            if (!existingPayment) {
                throw new apiError_1.ApiError("Payment tidak ditemukan", 404);
            }
            const payment = await prisma_1.prisma.payment.update({
                where: { id },
                data: {
                    amount: data.amount,
                    method: data.method,
                    transactionId: data.transactionId,
                    notes: data.notes,
                },
                include: {
                    trip: {
                        include: {
                            tourist: {
                                select: {
                                    id: true,
                                    user: {
                                        select: {
                                            id: true,
                                            firstName: true,
                                            lastName: true,
                                            email: true
                                        }
                                    }
                                }
                            },
                            destination: {
                                select: {
                                    id: true,
                                    name: true,
                                    country: true,
                                    city: true
                                }
                            }
                        }
                    }
                }
            });
            return payment;
        }
        catch (error) {
            throw new apiError_1.ApiError("Gagal mengupdate payment", 500);
        }
    }
    async deletePayment(id) {
        try {
            const existingPayment = await prisma_1.prisma.payment.findUnique({
                where: { id }
            });
            if (!existingPayment) {
                throw new apiError_1.ApiError("Payment tidak ditemukan", 404);
            }
            await prisma_1.prisma.payment.delete({
                where: { id }
            });
        }
        catch (error) {
            throw new apiError_1.ApiError("Gagal menghapus payment", 500);
        }
    }
    async getPaymentsByTouristId(touristId, page = 1, limit = 10) {
        try {
            const skip = (page - 1) * limit;
            const [payments, total] = await Promise.all([
                prisma_1.prisma.payment.findMany({
                    where: {
                        trip: {
                            touristId: touristId
                        }
                    },
                    skip,
                    take: limit,
                    include: {
                        trip: {
                            include: {
                                tourist: {
                                    select: {
                                        id: true,
                                        user: {
                                            select: {
                                                id: true,
                                                firstName: true,
                                                lastName: true,
                                                email: true
                                            }
                                        }
                                    }
                                },
                                destination: {
                                    select: {
                                        id: true,
                                        name: true,
                                        country: true,
                                        city: true
                                    }
                                }
                            }
                        }
                    },
                    orderBy: { createdAt: 'desc' }
                }),
                prisma_1.prisma.payment.count({
                    where: {
                        trip: {
                            touristId: touristId
                        }
                    }
                })
            ]);
            return {
                data: payments,
                meta: {
                    current: page,
                    pages: Math.ceil(total / limit),
                    total: total,
                    limit: limit,
                },
            };
        }
        catch (error) {
            throw new apiError_1.ApiError("Gagal mengambil data payments tourist", 500);
        }
    }
    async confirmPayment(id, transactionId) {
        try {
            const existingPayment = await prisma_1.prisma.payment.findUnique({
                where: { id },
                include: { trip: true }
            });
            if (!existingPayment) {
                throw new apiError_1.ApiError("Payment tidak ditemukan", 404);
            }
            if (existingPayment.status === 'paid') {
                throw new apiError_1.ApiError("Payment sudah dikonfirmasi sebelumnya", 400);
            }
            if (existingPayment.status !== 'pending') {
                throw new apiError_1.ApiError("Trip ini sudah dikonfirmasi atau dibatalkan", 400);
            }
            const [payment] = await prisma_1.prisma.$transaction([
                prisma_1.prisma.payment.update({
                    where: { id },
                    data: {
                        status: 'paid',
                        paymentDate: new Date(),
                        transactionId: transactionId || existingPayment.transactionId,
                    },
                    include: {
                        trip: {
                            include: {
                                tourist: {
                                    select: {
                                        id: true,
                                        user: {
                                            select: {
                                                id: true,
                                                firstName: true,
                                                lastName: true,
                                                email: true
                                            }
                                        }
                                    }
                                },
                                destination: {
                                    select: {
                                        id: true,
                                        name: true,
                                        country: true,
                                        city: true
                                    }
                                }
                            }
                        }
                    }
                }),
                prisma_1.prisma.trip.update({
                    where: { id: existingPayment.tripId },
                    data: { status: 'confirmed' }
                })
            ]);
            return payment;
        }
        catch (error) {
            if (error instanceof apiError_1.ApiError) {
                throw error;
            }
            throw new apiError_1.ApiError("Gagal mengkonfirmasi payment", 500);
        }
    }
    async cancelPayment(id, touristId) {
        try {
            const existingPayment = await prisma_1.prisma.payment.findUnique({
                where: { id },
                include: {
                    trip: {
                        select: {
                            id: true,
                            touristId: true,
                            status: true
                        }
                    }
                }
            });
            if (!existingPayment) {
                throw new apiError_1.ApiError("Payment tidak ditemukan", 404);
            }
            if (existingPayment.trip.touristId !== touristId) {
                throw new apiError_1.ApiError("Anda tidak memiliki akses untuk membatalkan payment ini", 403);
            }
            if (existingPayment.status === 'paid') {
                throw new apiError_1.ApiError("Payment yang sudah dibayar tidak dapat dibatalkan", 400);
            }
            if (existingPayment.status === 'refunded') {
                throw new apiError_1.ApiError("Payment sudah dibatalkan sebelumnya", 400);
            }
            const [payment] = await prisma_1.prisma.$transaction([
                prisma_1.prisma.payment.update({
                    where: { id },
                    data: {
                        status: "refunded",
                        notes: existingPayment.notes
                            ? `${existingPayment.notes} - Dibatalkan oleh tourist pada ${new Date().toISOString()}`
                            : `Dibatalkan oleh tourist pada ${new Date().toISOString()}`,
                    },
                    include: {
                        trip: {
                            include: {
                                tourist: {
                                    select: {
                                        id: true,
                                        user: {
                                            select: {
                                                id: true,
                                                firstName: true,
                                                lastName: true,
                                                email: true,
                                            },
                                        },
                                    },
                                },
                                destination: {
                                    select: {
                                        id: true,
                                        name: true,
                                        country: true,
                                        city: true,
                                    },
                                },
                            },
                        },
                    },
                }),
                prisma_1.prisma.trip.update({
                    where: { id: existingPayment.tripId },
                    data: { status: "cancelled" },
                }),
            ]);
            return payment;
        }
        catch (error) {
            if (error instanceof apiError_1.ApiError) {
                throw error;
            }
            throw new apiError_1.ApiError("Gagal membatalkan payment", 500);
        }
    }
}
exports.PaymentService = PaymentService;
exports.paymentService = new PaymentService();
