import { Request, Response, NextFunction } from "express";
import DestinationService from "../services/destination";
import { ApiResponse } from "../types";

class DestinationController {
  static async create(
    req: Request,
    res: Response<ApiResponse>,
    next: NextFunction
  ) {
    try {
      const destination = await DestinationService.create(req.body);
      res.status(201).json({
        success: true,
        message: "Destination created",
        data: destination,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getAll(
    req: Request,
    res: Response<ApiResponse>,
    next: NextFunction
  ) {
    try {
        const limit = Number(req.query.limit) || 10;
        const page = Number(req.query.page) || 1;
        const destinations = await DestinationService.getAll(page, limit);
        res.status(200).json({
            success: true,
            message: "Destination list",
            data: destinations.data,
            pagination: destinations.meta,
        });
    } catch (err) {
      next(err);
    }
  }

  static async getById(
    req: Request,
    res: Response<ApiResponse>,
    next: NextFunction
  ) {
    try {
      const destination = await DestinationService.getById(req.params.id);
      res.status(200).json({
        success: true,
        message: "Destination detail",
        data: destination,
      });
    } catch (err) {
      next(err);
    }
  }

  static async update(
    req: Request,
    res: Response<ApiResponse>,
    next: NextFunction
  ) {
    try {
      const updated = await DestinationService.update(req.params.id, req.body);
      res.status(200).json({
        success: true,
        message: "Destination updated",
        data: updated,
      });
    } catch (err) {
      next(err);
    }
  }

  static async delete(
    req: Request,
    res: Response<ApiResponse>,
    next: NextFunction
  ) {
    try {
      await DestinationService.delete(req.params.id);
      res.status(200).json({
        success: true,
        message: "Destination deleted",
      });
    } catch (err) {
      next(err);
    }
  }
}

export default DestinationController;
