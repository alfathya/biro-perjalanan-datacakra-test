import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { ApiError } from "../utils/apiError";

export const validate =
  (schema: ZodSchema<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.issues.map(
        (e) => `${e.path.join(".")}: ${e.message}`
      );
      return next(new ApiError(`Validation error: ${errors.join(", ")}`, 400));
    }

    req.body = result.data;
    next();
  };
