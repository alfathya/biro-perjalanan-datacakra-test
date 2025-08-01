"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../utils/prisma");
const apiError_1 = require("../utils/apiError");
const client_1 = require("@prisma/client");
class TripService {
    static async createTrip(data, createdById) {
        try {
            const tourist = await prisma_1.prisma.tourist.findUnique({
                where: { id: data.touristId },
            });
            if (!tourist) {
                throw new apiError_1.ApiError("Tourist tidak ditemukan", 404);
            }
            const destination = await prisma_1.prisma.destination.findUnique({
                where: { id: data.destinationId },
            });
            if (!destination) {
                throw new apiError_1.ApiError("Destinasi tidak ditemukan", 404);
            }
            const startDate = new Date(data.tanggalMulaiPerjalanan);
            const endDate = new Date(data.tanggalBerakhirPerjalanan);
            if (endDate <= startDate) {
                throw new apiError_1.ApiError("Tanggal berakhir perjalanan harus setelah tanggal mulai", 400);
            }
            const trip = await prisma_1.prisma.trip.create({
                data: {
                    touristId: data.touristId,
                    destinationId: data.destinationId,
                    tanggalMulaiPerjalanan: startDate,
                    tanggalBerakhirPerjalanan: endDate,
                    participants: data.participants,
                    totalPrice: data.totalPrice,
                    notes: data.notes,
                    specialRequests: data.specialRequests,
                    status: data.status || client_1.TripStatus.planned,
                    createdById,
                },
                include: {
                    tourist: {
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    email: true,
                                    firstName: true,
                                    lastName: true,
                                    phone: true,
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
                            description: true,
                            imageUrl: true,
                        },
                    },
                    createdBy: {
                        select: {
                            id: true,
                            email: true,
                            firstName: true,
                            lastName: true,
                        },
                    },
                },
            });
            return trip;
        }
        catch (error) {
            throw error;
        }
    }
    static async getTripList(page = 1, limit = 10, status, touristId) {
        try {
            const skip = (page - 1) * limit;
            const where = {};
            if (status) {
                where.status = status;
            }
            if (touristId) {
                where.touristId = touristId;
            }
            const [trips, total] = await Promise.all([
                prisma_1.prisma.trip.findMany({
                    where,
                    skip: Number(skip),
                    take: Number(limit),
                    include: {
                        tourist: {
                            include: {
                                user: {
                                    select: {
                                        id: true,
                                        email: true,
                                        firstName: true,
                                        lastName: true,
                                        phone: true,
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
                                description: true,
                                imageUrl: true,
                            },
                        },
                        createdBy: {
                            select: {
                                id: true,
                                email: true,
                                firstName: true,
                                lastName: true,
                            },
                        },
                        payment: {
                            select: {
                                id: true,
                                amount: true,
                                method: true,
                                status: true,
                                transactionId: true,
                                paymentDate: true,
                            },
                        },
                    },
                    orderBy: {
                        createdAt: "desc",
                    },
                }),
                prisma_1.prisma.trip.count({ where }),
            ]);
            const totalPages = Math.ceil(total / limit);
            return {
                data: trips,
                meta: {
                    current: page,
                    pages: totalPages,
                    total: total,
                    limit: limit,
                },
            };
        }
        catch (error) {
            throw error;
        }
    }
    static async getTripById(id) {
        try {
            const trip = await prisma_1.prisma.trip.findUnique({
                where: { id },
                include: {
                    tourist: {
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    email: true,
                                    firstName: true,
                                    lastName: true,
                                    phone: true,
                                },
                            },
                            address: {
                                select: {
                                    id: true,
                                    street: true,
                                    city: true,
                                    state: true,
                                    postalCode: true,
                                    country: true,
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
                            latitude: true,
                            longitude: true,
                            description: true,
                            imageUrl: true,
                        },
                    },
                    createdBy: {
                        select: {
                            id: true,
                            email: true,
                            firstName: true,
                            lastName: true,
                        },
                    },
                    payment: {
                        select: {
                            id: true,
                            amount: true,
                            method: true,
                            status: true,
                            transactionId: true,
                            paymentDate: true,
                            notes: true,
                        },
                    },
                },
            });
            if (!trip) {
                throw new apiError_1.ApiError("Trip tidak ditemukan", 404);
            }
            return trip;
        }
        catch (error) {
            throw error;
        }
    }
    static async updateTrip(id, data) {
        try {
            const existingTrip = await prisma_1.prisma.trip.findUnique({
                where: { id },
            });
            if (!existingTrip) {
                throw new apiError_1.ApiError("Trip tidak ditemukan", 404);
            }
            if (data.destinationId) {
                const destination = await prisma_1.prisma.destination.findUnique({
                    where: { id: data.destinationId },
                });
                if (!destination) {
                    throw new apiError_1.ApiError("Destinasi tidak ditemukan", 404);
                }
            }
            if (data.tanggalMulaiPerjalanan || data.tanggalBerakhirPerjalanan) {
                const startDate = data.tanggalMulaiPerjalanan
                    ? new Date(data.tanggalMulaiPerjalanan)
                    : existingTrip.tanggalMulaiPerjalanan;
                const endDate = data.tanggalBerakhirPerjalanan
                    ? new Date(data.tanggalBerakhirPerjalanan)
                    : existingTrip.tanggalBerakhirPerjalanan;
                if (endDate <= startDate) {
                    throw new apiError_1.ApiError("Tanggal berakhir perjalanan harus setelah tanggal mulai", 400);
                }
            }
            const updateData = { ...data };
            if (data.tanggalMulaiPerjalanan) {
                updateData.tanggalMulaiPerjalanan = new Date(data.tanggalMulaiPerjalanan);
            }
            if (data.tanggalBerakhirPerjalanan) {
                updateData.tanggalBerakhirPerjalanan = new Date(data.tanggalBerakhirPerjalanan);
            }
            const updatedTrip = await prisma_1.prisma.trip.update({
                where: { id },
                data: updateData,
                include: {
                    tourist: {
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    email: true,
                                    firstName: true,
                                    lastName: true,
                                    phone: true,
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
                            description: true,
                            imageUrl: true,
                        },
                    },
                    createdBy: {
                        select: {
                            id: true,
                            email: true,
                            firstName: true,
                            lastName: true,
                        },
                    },
                    payment: {
                        select: {
                            id: true,
                            amount: true,
                            method: true,
                            status: true,
                            transactionId: true,
                            paymentDate: true,
                        },
                    },
                },
            });
            return updatedTrip;
        }
        catch (error) {
            throw error;
        }
    }
    static async deleteTrip(id) {
        try {
            const existingTrip = await prisma_1.prisma.trip.findUnique({
                where: { id },
                include: {
                    payment: true,
                },
            });
            if (!existingTrip) {
                throw new apiError_1.ApiError("Trip tidak ditemukan", 404);
            }
            if (existingTrip.status === client_1.TripStatus.confirmed && existingTrip.payment) {
                throw new apiError_1.ApiError("Trip yang sudah dikonfirmasi dan memiliki pembayaran tidak dapat dihapus", 400);
            }
            await prisma_1.prisma.trip.delete({
                where: { id },
            });
            return { message: "Trip berhasil dihapus" };
        }
        catch (error) {
            throw error;
        }
    }
    static async getTripsByTourist(touristId, page = 1, limit = 10, status) {
        try {
            const tourist = await prisma_1.prisma.tourist.findUnique({
                where: { id: touristId },
            });
            if (!tourist) {
                throw new apiError_1.ApiError("Tourist tidak ditemukan", 404);
            }
            return this.getTripList(page, limit, status, touristId);
        }
        catch (error) {
            throw error;
        }
    }
    static async getTripsByUser(userId, page = 1, limit = 10, status) {
        try {
            const tourist = await prisma_1.prisma.tourist.findUnique({
                where: { userId },
            });
            if (!tourist) {
                throw new apiError_1.ApiError("Tourist profile tidak ditemukan", 404);
            }
            return this.getTripList(page, limit, status, tourist.id);
        }
        catch (error) {
            throw error;
        }
    }
    static async updateTripRating(id, rating, review) {
        try {
            const existingTrip = await prisma_1.prisma.trip.findUnique({
                where: { id },
            });
            if (!existingTrip) {
                throw new apiError_1.ApiError("Trip tidak ditemukan", 404);
            }
            if (existingTrip.status !== client_1.TripStatus.confirmed) {
                throw new apiError_1.ApiError("Hanya trip yang sudah dikonfirmasi yang dapat diberi rating", 400);
            }
            const updatedTrip = await prisma_1.prisma.trip.update({
                where: { id },
                data: {
                    rating,
                    review,
                },
                include: {
                    tourist: {
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    email: true,
                                    firstName: true,
                                    lastName: true,
                                    phone: true,
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
                            description: true,
                            imageUrl: true,
                        },
                    },
                },
            });
            return updatedTrip;
        }
        catch (error) {
            throw error;
        }
    }
}
exports.default = TripService;
