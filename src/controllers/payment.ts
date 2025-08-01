import { Request, Response, NextFunction } from "express";
import { paymentService } from "../services/payment";
import TripService from "../services/trip";
import TouristService from "../services/tourist";
import { CreatePaymentRequest, UpdatePaymentRequest } from "../types/payment";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../types/index";

export class PaymentController {
  async createPayment(
    req: Request,
    res: Response<ApiResponse>,
    next: NextFunction
  ) {
    try {
      const data: CreatePaymentRequest = req.body;
      const payment = await paymentService.createPayment(data);

      res.status(201).json({
        success: true,
        message: "Payment berhasil dibuat",
        data: payment,
      });
    } catch (error: any) {
      next(error);
    }
  }

  async getAllPayments(
    req: Request,
    res: Response<ApiResponse>,
    next: NextFunction
  ) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await paymentService.getAllPayments(page, limit);

      res.status(200).json({
        success: true,
        message: "Data payments berhasil diambil",
        data: result.data,
        pagination: result.meta,
      });
    } catch (error: any) {
      next(error);
    }
  }

  async getPaymentById(
    req: Request,
    res: Response<ApiResponse>,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const payment = await paymentService.getPaymentById(id);

      res.status(200).json({
        success: true,
        message: "Data payment berhasil diambil",
        data: payment,
      });
    } catch (error: any) {
      next(error);
    }
  }

  async getPaymentByTripId(
    req: Request,
    res: Response<ApiResponse>,
    next: NextFunction
  ) {
    try {
      const { tripId } = req.params;
      const payment = await paymentService.getPaymentByTripId(tripId);

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
    } catch (error: any) {
      next(error);
    }
  }

  async updatePayment(
    req: Request,
    res: Response<ApiResponse>,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const data: UpdatePaymentRequest = req.body;

      const payment = await paymentService.updatePayment(id, data);

      res.status(200).json({
        success: true,
        message: "Payment berhasil diupdate",
        data: payment,
      });
    } catch (error: any) {
      next(error);
    }
  }

  async deletePayment(
    req: Request,
    res: Response<ApiResponse>,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      await paymentService.deletePayment(id);

      res.status(200).json({
        success: true,
        message: "Payment berhasil dihapus",
      });
    } catch (error: any) {
      next(error);
    }
  }

  async getMyPayments(
    req: Request,
    res: Response<ApiResponse>,
    next: NextFunction
  ) {
    try {
      const userId = (req as any).user.id;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const touristProfile = await TouristService.getTouristProfile(userId);
      if (!touristProfile) {
        res.status(404).json({
          success: false,
          message: "Tourist profile tidak ditemukan",
        });
        return;
      }

      const result = await paymentService.getPaymentsByTouristId(
        touristProfile.id,
        page,
        limit
      );

      res.status(200).json({
        success: true,
        message: "Data payments berhasil diambil",
        data: result.data,
        pagination: result.meta,
      });
    } catch (error: any) {
      next(error);
    }
  }

  async confirmPayment(
    req: Request,
    res: Response<ApiResponse>,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const { transactionId } = req.body;

      const payment = await paymentService.confirmPayment(id, transactionId);

      res.status(200).json({
        success: true,
        message: "Payment berhasil dikonfirmasi",
        data: payment,
      });
    } catch (error: any) {
      next(error);
    }
  }

  async createMyPayment(
    req: Request,
    res: Response<ApiResponse>,
    next: NextFunction
  ) {
    try {
      const userId = (req as any).user.id;
      const { tripId, amount, method, transactionId, notes } = req.body;

      const touristProfile = await TouristService.getTouristProfile(userId);
      if (!touristProfile) {
        res.status(404).json({
          success: false,
          message: "Tourist profile tidak ditemukan",
        });
        return;
      }

      const trip = await TripService.getTripById(tripId);

      if (trip.touristId !== touristProfile.id) {
        res.status(403).json({
          success: false,
          message:
            "Anda tidak memiliki akses untuk membuat payment untuk trip ini",
        });
        return;
      }

      const data: CreatePaymentRequest = {
        tripId,
        amount,
        method,
        transactionId,
        notes,
      };

      const payment = await paymentService.createPayment(data);

      res.status(201).json({
        success: true,
        message: "Payment berhasil dibuat",
        data: payment,
      });
    } catch (error: any) {
      next(error);
    }
  }

  async cancelMyPayment(
    req: Request,
    res: Response<ApiResponse>,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;

      const touristProfile = await TouristService.getTouristProfile(userId);
      if (!touristProfile) {
        res.status(404).json({
          success: false,
          message: "Tourist profile tidak ditemukan",
        });
        return;
      }

      const payment = await paymentService.cancelPayment(id, touristProfile.id);

      res.status(200).json({
        success: true,
        message: "Payment berhasil dibatalkan dan trip telah dicancel",
        data: payment,
      });
    } catch (error: any) {
      next(error);
    }
  }
}

export const paymentController = new PaymentController();