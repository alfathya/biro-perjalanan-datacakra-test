import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../types/index";
import { CreateTripRequest, UpdateTripRequest } from "../types/trip";
import TripService from "../services/trip";
import { ApiError } from "../utils/apiError";
import { TripStatus } from "@prisma/client";
import { prisma } from "../utils/prisma";

class TripController {
  static async createTrip(
    req: Request<{}, {}, CreateTripRequest>,
    res: Response<ApiResponse>,
    next: NextFunction
  ) {
    try {
      const data: CreateTripRequest = req.body;
      const createdById = req.user?.id;

      if (!createdById) {
        throw new ApiError("User tidak ditemukan", 401);
      }

      const trip = await TripService.createTrip(data, createdById);

      res.status(201).json({
        success: true,
        message: "Trip berhasil dibuat",
        data: trip,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getTripList(
    req: Request,
    res: Response<ApiResponse>,
    next: NextFunction
  ) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const status = req.query.status as TripStatus;
      const touristId = req.query.touristId as string;

      const trips = await TripService.getTripList(page, limit, status, touristId);

      res.status(200).json({
        success: true,
        message: "Daftar trip berhasil diambil",
        data: trips.data,
        pagination: trips.meta,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getTripById(
    req: Request,
    res: Response<ApiResponse>,
    next: NextFunction
  ) {
    try {
      const id = req.params.id;
      const trip = await TripService.getTripById(id);

      res.status(200).json({
        success: true,
        message: "Detail trip berhasil diambil",
        data: trip,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateTrip(
    req: Request<{ id: string }, {}, UpdateTripRequest>,
    res: Response<ApiResponse>,
    next: NextFunction
  ) {
    try {
      const id = req.params.id;
      const data: UpdateTripRequest = req.body;

      const updatedTrip = await TripService.updateTrip(id, data);

      res.status(200).json({
        success: true,
        message: "Trip berhasil diperbarui",
        data: updatedTrip,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteTrip(
    req: Request,
    res: Response<ApiResponse>,
    next: NextFunction
  ) {
    try {
      const id = req.params.id;
      await TripService.deleteTrip(id);

      res.status(200).json({
        success: true,
        message: "Trip berhasil dihapus",
      });
    } catch (error) {
      next(error);
    }
  }

  static async getTripsByTourist(
    req: Request,
    res: Response<ApiResponse>,
    next: NextFunction
  ) {
    try {
      const touristId = req.params.touristId;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const status = req.query.status as TripStatus;

      const trips = await TripService.getTripsByTourist(touristId, page, limit, status);

      res.status(200).json({
        success: true,
        message: "Daftar trip tourist berhasil diambil",
        data: trips.data,
        pagination: trips.meta,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getMyTrips(
    req: Request,
    res: Response<ApiResponse>,
    next: NextFunction
  ) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new ApiError("User tidak ditemukan", 401);
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const status = req.query.status as TripStatus;

      const trips = await TripService.getTripsByUser(userId, page, limit, status);

      res.status(200).json({
        success: true,
        message: "Daftar trip Anda berhasil diambil",
        data: trips.data,
        pagination: trips.meta,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateTripRating(
    req: Request<{ id: string }, {}, { rating: number; review?: string }>,
    res: Response<ApiResponse>,
    next: NextFunction
  ) {
    try {
      const id = req.params.id;
      const { rating, review } = req.body;

      if (!rating || rating < 1 || rating > 5) {
        throw new ApiError("Rating harus antara 1-5", 400);
      }

      const updatedTrip = await TripService.updateTripRating(id, rating, review);

      res.status(200).json({
        success: true,
        message: "Rating trip berhasil diperbarui",
        data: updatedTrip,
      });
    } catch (error) {
      next(error);
    }
  }

  static async createTripForTourist(
    req: Request<{}, {}, Omit<CreateTripRequest, 'touristId'>>,
    res: Response<ApiResponse>,
    next: NextFunction
  ) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new ApiError("User tidak ditemukan", 401);
      }

      const tourist = await prisma.tourist.findUnique({
        where: { userId },
      });

      if (!tourist) {
        throw new ApiError("Profile tourist tidak ditemukan. Silakan lengkapi profile terlebih dahulu", 404);
      }

      const data: CreateTripRequest = {
        ...req.body,
        touristId: tourist.id,
      };

      const trip = await TripService.createTrip(data, userId);

      res.status(201).json({
        success: true,
        message: "Trip berhasil dibuat",
        data: trip,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default TripController;