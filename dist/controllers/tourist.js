"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tourist_1 = __importDefault(require("../services/tourist"));
const apiError_1 = require("../utils/apiError");
class TouristController {
    static async getTouristList(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const tourists = await tourist_1.default.getTouristList(page, limit);
            res.status(200).json({
                success: true,
                message: "Tourist list retrieved successfully",
                data: tourists.data,
                pagination: tourists.meta,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async getDetailTourist(req, res, next) {
        try {
            const id = req.params.id;
            const tourist = await tourist_1.default.getDetailTourist(id);
            res.status(200).json({
                success: true,
                message: "Tourist detail retrieved successfully",
                data: tourist,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async getTouristProfile(req, res, next) {
        try {
            const userID = req.user?.id;
            if (!userID) {
                throw new apiError_1.ApiError("User not found", 404);
            }
            const tourists = await tourist_1.default.getTouristProfile(userID);
            res.status(200).json({
                success: true,
                message: "Tourist list retrieved successfully",
                data: tourists,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async updateTouristProfile(req, res, next) {
        try {
            const userID = req.user?.id;
            const data = req.body;
            if (!userID) {
                throw new apiError_1.ApiError("User not found", 404);
            }
            const tourists = await tourist_1.default.updateTouristProfile(userID, data);
            res.status(200).json({
                success: true,
                message: "Tourist list retrieved successfully",
                data: tourists,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async updateTouristByEmployee(req, res, next) {
        try {
            const touristId = req.params.id;
            const data = req.body;
            if (!touristId) {
                throw new apiError_1.ApiError("Tourist not found", 404);
            }
            const tourists = await tourist_1.default.updateTouristByEmployee(touristId, data);
            res.status(200).json({
                success: true,
                message: "Tourist list retrieved successfully",
                data: tourists,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async deleteTourist(req, res, next) {
        try {
            const touristId = req.params.id;
            await tourist_1.default.deleteTouristById(touristId);
            res.status(200).json({
                success: true,
                message: "Tourist deleted successfully",
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.default = TouristController;
