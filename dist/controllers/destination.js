"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const destination_1 = __importDefault(require("../services/destination"));
class DestinationController {
    static async create(req, res, next) {
        try {
            const destination = await destination_1.default.create(req.body);
            res.status(201).json({
                success: true,
                message: "Destination created",
                data: destination,
            });
        }
        catch (err) {
            next(err);
        }
    }
    static async getAll(req, res, next) {
        try {
            const limit = Number(req.query.limit) || 10;
            const page = Number(req.query.page) || 1;
            const destinations = await destination_1.default.getAll(page, limit);
            res.status(200).json({
                success: true,
                message: "Destination list",
                data: destinations.data,
                pagination: destinations.meta,
            });
        }
        catch (err) {
            next(err);
        }
    }
    static async getById(req, res, next) {
        try {
            const destination = await destination_1.default.getById(req.params.id);
            res.status(200).json({
                success: true,
                message: "Destination detail",
                data: destination,
            });
        }
        catch (err) {
            next(err);
        }
    }
    static async update(req, res, next) {
        try {
            const updated = await destination_1.default.update(req.params.id, req.body);
            res.status(200).json({
                success: true,
                message: "Destination updated",
                data: updated,
            });
        }
        catch (err) {
            next(err);
        }
    }
    static async delete(req, res, next) {
        try {
            await destination_1.default.delete(req.params.id);
            res.status(200).json({
                success: true,
                message: "Destination deleted",
            });
        }
        catch (err) {
            next(err);
        }
    }
}
exports.default = DestinationController;
