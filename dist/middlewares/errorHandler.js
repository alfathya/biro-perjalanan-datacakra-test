"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const apiError_1 = require("../utils/apiError");
function errorHandler(err, req, res, _next) {
    console.error(`[ERROR] ${req.method} ${req.url}`, err);
    const status = err instanceof apiError_1.ApiError ? err.statusCode : 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({
        success: false,
        message,
    });
}
