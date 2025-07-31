import { prisma } from "../utils/prisma";
import { ApiError } from "../utils/apiError";
import { TouristListItem } from "../types";

class TouristService {
  static async getTouristList(page: number = 1, limit: number = 10) {
    try {
        const skip = (page - 1) * limit;

        const [tourists, total] = await Promise.all([
          prisma.tourist.findMany({
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
            },
            orderBy: {
              createdAt: "desc",
            },
          }),
          prisma.tourist.count(),
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
    } catch (error) {
        throw error
    }
  }

  static async getDetailTourist(id: string) {
    try {
        const tourist = await prisma.tourist.findUnique({
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
            },
        });

        if (!tourist) {
            throw new ApiError("Tourist not found", 404);
        }

        return tourist;
    } catch (error) {
        throw error
    }
  }
}

export default TouristService;
