"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentController = exports.PaymentController = void 0;
const payment_1 = require("../services/payment");
const trip_1 = __importDefault(require("../services/trip"));
const tourist_1 = __importDefault(require("../services/tourist"));
class PaymentController {
    async createPayment(req, res, next) {
        try {
            const data = req.body;
            const payment = await payment_1.paymentService.createPayment(data);
            res.status(201).json({
                success: true,
                message: "Payment berhasil dibuat",
                data: payment,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getAllPayments(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const result = await payment_1.paymentService.getAllPayments(page, limit);
            res.status(200).json({
                success: true,
                message: "Data payments berhasil diambil",
                data: result.data,
                pagination: result.meta,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getPaymentById(req, res, next) {
        try {
            const { id } = req.params;
            const payment = await payment_1.paymentService.getPaymentById(id);
            res.status(200).json({
                success: true,
                message: "Data payment berhasil diambil",
                data: payment,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getPaymentByTripId(req, res, next) {
        try {
            const { tripId } = req.params;
            const payment = await payment_1.paymentService.getPaymentByTripId(tripId);
            if (!payment) {
                res.status(404).json({
                    success: false,
                    message: "Payment untuk trip ini tidak ditemukan",
                });
                return;
            }
            res.status(200).json({
                success: true,
                message: "Data payment berhasil diambil",
                data: payment,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async updatePayment(req, res, next) {
        try {
            const { id } = req.params;
            const data = req.body;
            const payment = await payment_1.paymentService.updatePayment(id, data);
            res.status(200).json({
                success: true,
                message: "Payment berhasil diupdate",
                data: payment,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async deletePayment(req, res, next) {
        try {
            const { id } = req.params;
            await payment_1.paymentService.deletePayment(id);
            res.status(200).json({
                success: true,
                message: "Payment berhasil dihapus",
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getMyPayments(req, res, next) {
        try {
            const userId = req.user.id;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const touristProfile = await tourist_1.default.getTouristProfile(userId);
            if (!touristProfile) {
                res.status(404).json({
                    success: false,
                    message: "Tourist profile tidak ditemukan",
                });
                return;
            }
            const result = await payment_1.paymentService.getPaymentsByTouristId(touristProfile.id, page, limit);
            res.status(200).json({
                success: true,
                message: "Data payments berhasil diambil",
                data: result.data,
                pagination: result.meta,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async confirmPayment(req, res, next) {
        try {
            const { id } = req.params;
            const { transactionId } = req.body;
            const payment = await payment_1.paymentService.confirmPayment(id, transactionId);
            res.status(200).json({
                success: true,
                message: "Payment berhasil dikonfirmasi",
                data: payment,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async createMyPayment(req, res, next) {
        try {
            const userId = req.user.id;
            const { tripId, amount, method, transactionId, notes } = req.body;
            const touristProfile = await tourist_1.default.getTouristProfile(userId);
            if (!touristProfile) {
                res.status(404).json({
                    success: false,
                    message: "Tourist profile tidak ditemukan",
                });
                return;
            }
            const trip = await trip_1.default.getTripById(tripId);
            if (trip.touristId !== touristProfile.id) {
                res.status(403).json({
                    success: false,
                    message: "Anda tidak memiliki akses untuk membuat payment untuk trip ini",
                });
                return;
            }
            const data = {
                tripId,
                amount,
                method,
                transactionId,
                notes,
            };
            const payment = await payment_1.paymentService.createPayment(data);
            res.status(201).json({
                success: true,
                message: "Payment berhasil dibuat",
                data: payment,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async cancelMyPayment(req, res, next) {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            const touristProfile = await tourist_1.default.getTouristProfile(userId);
            if (!touristProfile) {
                res.status(404).json({
                    success: false,
                    message: "Tourist profile tidak ditemukan",
                });
                return;
            }
            const payment = await payment_1.paymentService.cancelPayment(id, touristProfile.id);
            res.status(200).json({
                success: true,
                message: "Payment berhasil dibatalkan dan trip telah dicancel",
                data: payment,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.PaymentController = PaymentController;
exports.paymentController = new PaymentController();
