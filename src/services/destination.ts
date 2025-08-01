import { prisma } from "../utils/prisma";
import {
  CreateDestinationRequest,
  UpdateDestinationRequest,
} from "../types/index";
import { ApiError } from "../utils/apiError";

class DestinationService {
  static async create(data: CreateDestinationRequest) {
    try {
      return await prisma.destination.create({ data });
    } catch (error) {
      throw new ApiError("Failed to create destination", 500);
    }
  }

  static async getAll(page: number = 1, limit: number = 10) {
    try {
      const skip = (page - 1) * limit;
      
      const [data, total] = await Promise.all([
        prisma.destination.findMany({
          orderBy: { createdAt: "desc" },
          take: limit,
          skip: skip
        }),
        prisma.destination.count()
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
    } catch (error) {
      throw new ApiError("Failed to fetch destinations", 500);
    }
  }

  static async getById(id: string) {
    try {
      const destination = await prisma.destination.findUnique({ where: { id } });
      if (!destination) throw new ApiError("Destination not found", 404);
      return destination;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError("Failed to fetch destination", 500);
    }
  }

  static async update(id: string, data: UpdateDestinationRequest) {
    try {
      const existing = await prisma.destination.findUnique({ where: { id } });
      if (!existing) throw new ApiError("Destination not found", 404);

      return await prisma.destination.update({
        where: { id },
        data,
      });
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError("Failed to update destination", 500);
    }
  }

  static async delete(id: string) {
    try {
      const existing = await prisma.destination.findUnique({ where: { id } });
      if (!existing) throw new ApiError("Destination not found", 404);

      return await prisma.destination.delete({ where: { id } });
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError("Failed to delete destination", 500);
    }
  }
}

export default DestinationService;
