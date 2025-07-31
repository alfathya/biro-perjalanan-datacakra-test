import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/apiError";

export function errorHandler(
  err: ApiError | Error,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error(`[ERROR] ${req.method} ${req.url}`, err);

  const status = err instanceof ApiError ? err.statusCode : 500;
  const message = err.message || "Internal Server Error";

  res.status(status).json({
    success: false,
    message,
  });
}
