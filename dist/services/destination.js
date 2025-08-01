"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../utils/prisma");
const apiError_1 = require("../utils/apiError");
class DestinationService {
    static async create(data) {
        try {
            return await prisma_1.prisma.destination.create({ data });
        }
        catch (error) {
            throw new apiError_1.ApiError("Failed to create destination", 500);
        }
    }
    static async getAll(page = 1, limit = 10) {
        try {
            const skip = (page - 1) * limit;
            const [data, total] = await Promise.all([
                prisma_1.prisma.destination.findMany({
                    orderBy: { createdAt: "desc" },
                    take: limit,
                    skip: skip
                }),
                prisma_1.prisma.destination.count()
            ]);
            const totalPages = Math.ceil(total / limit);
            return {
                data,
                meta: {
                    current: page,
                    pages: totalPages,
                    total: total,
                    limit: limit,
                },
            };
        }
        catch (error) {
            throw new apiError_1.ApiError("Failed to fetch destinations", 500);
        }
    }
    static async getById(id) {
        try {
            const destination = await prisma_1.prisma.destination.findUnique({ where: { id } });
            if (!destination)
                throw new apiError_1.ApiError("Destination not found", 404);
            return destination;
        }
        catch (error) {
            if (error instanceof apiError_1.ApiError)
                throw error;
            throw new apiError_1.ApiError("Failed to fetch destination", 500);
        }
    }
    static async update(id, data) {
        try {
            const existing = await prisma_1.prisma.destination.findUnique({ where: { id } });
            if (!existing)
                throw new apiError_1.ApiError("Destination not found", 404);
            return await prisma_1.prisma.destination.update({
                where: { id },
                data,
            });
        }
        catch (error) {
            if (error instanceof apiError_1.ApiError)
                throw error;
            throw new apiError_1.ApiError("Failed to update destination", 500);
        }
    }
    static async delete(id) {
        try {
            const existing = await prisma_1.prisma.destination.findUnique({ where: { id } });
            if (!existing)
                throw new apiError_1.ApiError("Destination not found", 404);
            return await prisma_1.prisma.destination.delete({ where: { id } });
        }
        catch (error) {
            if (error instanceof apiError_1.ApiError)
                throw error;
            throw new apiError_1.ApiError("Failed to delete destination", 500);
        }
    }
}
exports.default = DestinationService;
