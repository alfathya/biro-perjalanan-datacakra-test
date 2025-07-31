import { Request, Response, NextFunction} from "express";
import { ApiResponse } from "../types";
import TouristService from "../services/tourist";
import { ApiError } from "../utils/apiError";

class TouristController {
    static async getTouristList(req: Request, res: Response<ApiResponse>, next: NextFunction) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;

            const tourists = await TouristService.getTouristList(page, limit);
            res.status(200).json({
              success: true,
              message: "Tourist list retrieved successfully",
              data: tourists.data,
              pagination: tourists.meta,
            });
        } catch (error) {
            next(error)
        }
    }

    static async getDetailTourist (req: Request, res: Response<ApiResponse>, next: NextFunction) {
        try {
            const id = req.params.id;
            const tourist = await TouristService.getDetailTourist(id);
            res.status(200).json({
                success: true,
                message: "Tourist detail retrieved successfully",
                data: tourist,
            });
        } catch (error) {
            next(error)
        }
    }

    static async getTouristProfile (req: Request, res: Response<ApiResponse>, next: NextFunction) {
        try {
            const userID = req.user?.id;
            if(!userID) {
                throw new ApiError("User not found", 404);
            }
            const tourists = await TouristService.getTouristProfile(userID);
            res.status(200).json({
                success: true,
                message: "Tourist list retrieved successfully",
                data: tourists,
            });
        } catch (error) {
            next(error)
        }
    }
}

export default TouristController;
