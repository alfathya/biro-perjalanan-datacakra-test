"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../utils/prisma");
const apiError_1 = require("../utils/apiError");
class TouristService {
    static async getTouristList(page = 1, limit = 10) {
        try {
            const skip = (page - 1) * limit;
            const [tourists, total] = await Promise.all([
                prisma_1.prisma.tourist.findMany({
                    skip: Number(skip),
                    take: Number(limit),
                    include: {
                        user: {
                            select: {
                                id: true,
                                email: true,
                                firstName: true,
                                lastName: true,
                                phone: true,
                                isActive: true,
                                role: true,
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
                    orderBy: {
                        createdAt: "desc",
                    },
                }),
                prisma_1.prisma.tourist.count(),
            ]);
            const totalPages = Math.ceil(total / limit);
            return {
                data: tourists,
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
    static async getDetailTourist(id) {
        try {
            const tourist = await prisma_1.prisma.tourist.findUnique({
                where: {
                    id,
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            email: true,
                            firstName: true,
                            lastName: true,
                            phone: true,
                            isActive: true,
                            role: true,
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
            });
            if (!tourist) {
                throw new apiError_1.ApiError("Tourist not found", 404);
            }
            return tourist;
        }
        catch (error) {
            throw error;
        }
    }
    static async getTouristProfile(userID) {
        try {
            const tourists = await prisma_1.prisma.tourist.findUnique({
                where: {
                    userId: userID,
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            email: true,
                            firstName: true,
                            lastName: true,
                            phone: true,
                            isActive: true,
                            role: true,
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
            });
            return tourists;
        }
        catch (error) {
            throw error;
        }
    }
    static async updateTouristProfile(userId, data) {
        try {
            const { firstName, lastName, phone, address, ...touristField } = data;
            if (touristField.dateOfBirth) {
                touristField.dateOfBirth = new Date(touristField.dateOfBirth).toISOString();
            }
            const updatedTourist = await prisma_1.prisma.$transaction(async (tx) => {
                const existingTourist = await tx.tourist.findUnique({
                    where: { userId },
                    include: { address: true },
                });
                if (!existingTourist)
                    throw new apiError_1.ApiError("Tourist not found", 404);
                let addressUpdate = {};
                if (address) {
                    if (existingTourist.addressId) {
                        await tx.address.update({
                            where: { id: existingTourist.addressId },
                            data: address,
                        });
                    }
                    else {
                        const newAddress = await tx.address.create({ data: address });
                        addressUpdate = {
                            address: {
                                connect: {
                                    id: newAddress.id,
                                },
                            },
                        };
                    }
                }
                const updated = await tx.tourist.update({
                    where: { userId },
                    data: {
                        ...touristField,
                        ...addressUpdate,
                        user: {
                            update: {
                                ...(firstName && { firstName }),
                                ...(lastName && { lastName }),
                                ...(phone && { phone }),
                            },
                        },
                    },
                    include: {
                        user: {
                            select: {
                                id: true,
                                email: true,
                                firstName: true,
                                lastName: true,
                                phone: true,
                                isActive: true,
                                role: true,
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
                });
                return updated;
            });
            return updatedTourist;
        }
        catch (error) {
            throw error;
        }
    }
    static async updateTouristByEmployee(touristId, data) {
        try {
            const { firstName, lastName, phone, isActive, address, ...touristFields } = data;
            if (touristFields.dateOfBirth) {
                touristFields.dateOfBirth = new Date(touristFields.dateOfBirth).toISOString();
            }
            const updated = await prisma_1.prisma.$transaction(async (tx) => {
                const existing = await tx.tourist.findUnique({
                    where: { id: touristId },
                    include: { address: true, user: true },
                });
                if (!existing)
                    throw new apiError_1.ApiError("Tourist not found", 404);
                let addressUpdate = {};
                if (address) {
                    if (existing.addressId) {
                        await tx.address.update({
                            where: { id: existing.addressId },
                            data: address,
                        });
                    }
                    else {
                        const newAddress = await tx.address.create({ data: address });
                        addressUpdate = {
                            address: {
                                connect: {
                                    id: newAddress.id,
                                },
                            },
                        };
                    }
                }
                await tx.user.update({
                    where: { id: existing.userId },
                    data: {
                        ...(firstName && { firstName }),
                        ...(lastName && { lastName }),
                        ...(phone && { phone }),
                        ...(typeof isActive === "boolean" && { isActive }),
                    },
                });
                const tourist = await tx.tourist.update({
                    where: { id: touristId },
                    data: touristFields,
                    ...addressUpdate,
                    include: {
                        user: {
                            select: {
                                id: true,
                                email: true,
                                firstName: true,
                                lastName: true,
                                phone: true,
                                role: true,
                                isActive: true,
                            },
                        },
                        address: true,
                    },
                });
                return tourist;
            });
            return updated;
        }
        catch (error) {
            throw error;
        }
    }
    static async deleteTouristById(touristId) {
        const tourist = await prisma_1.prisma.tourist.findUnique({
            where: { id: touristId },
            select: {
                id: true,
                userId: true,
                addressId: true,
            },
        });
        if (!tourist) {
            throw new apiError_1.ApiError("Tourist not found", 404);
        }
        await prisma_1.prisma.$transaction(async (tx) => {
            if (tourist.addressId) {
                await tx.address.delete({
                    where: { id: tourist.addressId },
                });
            }
            await tx.user.delete({
                where: { id: tourist.userId },
            });
        });
    }
}
exports.default = TouristService;
