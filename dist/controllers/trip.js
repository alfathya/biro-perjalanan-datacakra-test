"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const trip_1 = __importDefault(require("../services/trip"));
const apiError_1 = require("../utils/apiError");
const prisma_1 = require("../utils/prisma");
class TripController {
    static async createTrip(req, res, next) {
        try {
            const data = req.body;
            const createdById = req.user?.id;
            if (!createdById) {
                throw new apiError_1.ApiError("User tidak ditemukan", 401);
            }
            const trip = await trip_1.default.createTrip(data, createdById);
            res.status(201).json({
                success: true,
                message: "Trip berhasil dibuat",
                data: trip,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async getTripList(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const status = req.query.status;
            const touristId = req.query.touristId;
            const trips = await trip_1.default.getTripList(page, limit, status, touristId);
            res.status(200).json({
                success: true,
                message: "Daftar trip berhasil diambil",
                data: trips.data,
                pagination: trips.meta,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async getTripById(req, res, next) {
        try {
            const id = req.params.id;
            const trip = await trip_1.default.getTripById(id);
            res.status(200).json({
                success: true,
                message: "Detail trip berhasil diambil",
                data: trip,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async updateTrip(req, res, next) {
        try {
            const id = req.params.id;
            const data = req.body;
            const updatedTrip = await trip_1.default.updateTrip(id, data);
            res.status(200).json({
                success: true,
                message: "Trip berhasil diperbarui",
                data: updatedTrip,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async deleteTrip(req, res, next) {
        try {
            const id = req.params.id;
            await trip_1.default.deleteTrip(id);
            res.status(200).json({
                success: true,
                message: "Trip berhasil dihapus",
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async getTripsByTourist(req, res, next) {
        try {
            const touristId = req.params.touristId;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const status = req.query.status;
            const trips = await trip_1.default.getTripsByTourist(touristId, page, limit, status);
            res.status(200).json({
                success: true,
                message: "Daftar trip tourist berhasil diambil",
                data: trips.data,
                pagination: trips.meta,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async getMyTrips(req, res, next) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                throw new apiError_1.ApiError("User tidak ditemukan", 401);
            }
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const status = req.query.status;
            const trips = await trip_1.default.getTripsByUser(userId, page, limit, status);
            res.status(200).json({
                success: true,
                message: "Daftar trip Anda berhasil diambil",
                data: trips.data,
                pagination: trips.meta,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async updateTripRating(req, res, next) {
        try {
            const id = req.params.id;
            const { rating, review } = req.body;
            if (!rating || rating < 1 || rating > 5) {
                throw new apiError_1.ApiError("Rating harus antara 1-5", 400);
            }
            const updatedTrip = await trip_1.default.updateTripRating(id, rating, review);
            res.status(200).json({
                success: true,
                message: "Rating trip berhasil diperbarui",
                data: updatedTrip,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async createTripForTourist(req, res, next) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                throw new apiError_1.ApiError("User tidak ditemukan", 401);
            }
            const tourist = await prisma_1.prisma.tourist.findUnique({
                where: { userId },
            });
            if (!tourist) {
                throw new apiError_1.ApiError("Profile tourist tidak ditemukan. Silakan lengkapi profile terlebih dahulu", 404);
            }
            const data = {
                ...req.body,
                touristId: tourist.id,
            };
            const trip = await trip_1.default.createTrip(data, userId);
            res.status(201).json({
                success: true,
                message: "Trip berhasil dibuat",
                data: trip,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.default = TripController;
