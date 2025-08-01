import { prisma } from "../utils/prisma";
import { ApiError } from "../utils/apiError";
import { CreateTripRequest, UpdateTripRequest, TripListResponse } from "../types/trip";
import { TripStatus } from "@prisma/client";

class TripService {
  static async createTrip(data: CreateTripRequest, createdById: string) {
    try {
      const tourist = await prisma.tourist.findUnique({
        where: { id: data.touristId },
      });

      if (!tourist) {
        throw new ApiError("Tourist tidak ditemukan", 404);
      }

      const destination = await prisma.destination.findUnique({
        where: { id: data.destinationId },
      });

      if (!destination) {
        throw new ApiError("Destinasi tidak ditemukan", 404);
      }

      const startDate = new Date(data.tanggalMulaiPerjalanan);
      const endDate = new Date(data.tanggalBerakhirPerjalanan);

      if (endDate <= startDate) {
        throw new ApiError("Tanggal berakhir perjalanan harus setelah tanggal mulai", 400);
      }

      const trip = await prisma.trip.create({
        data: {
          touristId: data.touristId,
          destinationId: data.destinationId,
          tanggalMulaiPerjalanan: startDate,
          tanggalBerakhirPerjalanan: endDate,
          participants: data.participants,
          totalPrice: data.totalPrice,
          notes: data.notes,
          specialRequests: data.specialRequests,
          status: data.status || TripStatus.planned,
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
    } catch (error) {
      throw error;
    }
  }

  static async getTripList(
    page: number = 1,
    limit: number = 10,
    status?: TripStatus,
    touristId?: string
  ): Promise<TripListResponse> {
    try {
      const skip = (page - 1) * limit;

      const where: any = {};
      if (status) {
        where.status = status;
      }
      if (touristId) {
        where.touristId = touristId;
      }

      const [trips, total] = await Promise.all([
        prisma.trip.findMany({
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
        prisma.trip.count({ where }),
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
    } catch (error) {
      throw error;
    }
  }

  static async getTripById(id: string) {
    try {
      const trip = await prisma.trip.findUnique({
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
        throw new ApiError("Trip tidak ditemukan", 404);
      }

      return trip;
    } catch (error) {
      throw error;
    }
  }

  static async updateTrip(id: string, data: UpdateTripRequest) {
    try {
      const existingTrip = await prisma.trip.findUnique({
        where: { id },
      });

      if (!existingTrip) {
        throw new ApiError("Trip tidak ditemukan", 404);
      }

      if (data.destinationId) {
        const destination = await prisma.destination.findUnique({
          where: { id: data.destinationId },
        });

        if (!destination) {
          throw new ApiError("Destinasi tidak ditemukan", 404);
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
          throw new ApiError("Tanggal berakhir perjalanan harus setelah tanggal mulai", 400);
        }
      }

      const updateData: any = { ...data };
      if (data.tanggalMulaiPerjalanan) {
        updateData.tanggalMulaiPerjalanan = new Date(data.tanggalMulaiPerjalanan);
      }
      if (data.tanggalBerakhirPerjalanan) {
        updateData.tanggalBerakhirPerjalanan = new Date(data.tanggalBerakhirPerjalanan);
      }

      const updatedTrip = await prisma.trip.update({
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
    } catch (error) {
      throw error;
    }
  }

  static async deleteTrip(id: string) {
    try {
      const existingTrip = await prisma.trip.findUnique({
        where: { id },
        include: {
          payment: true,
        },
      });

      if (!existingTrip) {
        throw new ApiError("Trip tidak ditemukan", 404);
      }

      if (existingTrip.status === TripStatus.confirmed && existingTrip.payment) {
        throw new ApiError("Trip yang sudah dikonfirmasi dan memiliki pembayaran tidak dapat dihapus", 400);
      }

      await prisma.trip.delete({
        where: { id },
      });

      return { message: "Trip berhasil dihapus" };
    } catch (error) {
      throw error;
    }
  }

  static async getTripsByTourist(
    touristId: string,
    page: number = 1,
    limit: number = 10,
    status?: TripStatus
  ) {
    try {
      const tourist = await prisma.tourist.findUnique({
        where: { id: touristId },
      });

      if (!tourist) {
        throw new ApiError("Tourist tidak ditemukan", 404);
      }

      return this.getTripList(page, limit, status, touristId);
    } catch (error) {
      throw error;
    }
  }

  static async getTripsByUser(
    userId: string,
    page: number = 1,
    limit: number = 10,
    status?: TripStatus
  ) {
    try {
      const tourist = await prisma.tourist.findUnique({
        where: { userId },
      });

      if (!tourist) {
        throw new ApiError("Tourist profile tidak ditemukan", 404);
      }

      return this.getTripList(page, limit, status, tourist.id);
    } catch (error) {
      throw error;
    }
  }

  static async updateTripRating(id: string, rating: number, review?: string) {
    try {
      const existingTrip = await prisma.trip.findUnique({
        where: { id },
      });

      if (!existingTrip) {
        throw new ApiError("Trip tidak ditemukan", 404);
      }

      if (existingTrip.status !== TripStatus.confirmed) {
        throw new ApiError("Hanya trip yang sudah dikonfirmasi yang dapat diberi rating", 400);
      }

      const updatedTrip = await prisma.trip.update({
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
    } catch (error) {
      throw error;
    }
  }
}

export default TripService;