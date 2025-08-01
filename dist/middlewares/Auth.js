"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireTourist = exports.requireEmployee = exports.requireAdmin = exports.authorize = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../utils/prisma");
const apiError_1 = require("../utils/apiError");
const client_1 = require("@prisma/client");
const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new apiError_1.ApiError('Access token is required', 401);
        }
        const token = authHeader.substring(7);
        if (!process.env.JWT_SECRET) {
            throw new apiError_1.ApiError('JWT secret is not configured', 500);
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: decoded.id },
            select: {
                id: true,
                email: true,
                role: true,
                firstName: true,
                lastName: true,
                isActive: true
            }
        });
        if (!user) {
            throw new apiError_1.ApiError('User not found', 401);
        }
        if (!user.isActive) {
            throw new apiError_1.ApiError('Account is not active', 401);
        }
        req.user = {
            id: user.id,
            email: user.email,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName
        };
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            next(new apiError_1.ApiError('Invalid token', 401));
        }
        else if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            next(new apiError_1.ApiError('Token has expired', 401));
        }
        else {
            next(error);
        }
    }
};
exports.authenticate = authenticate;
const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        try {
            if (!req.user) {
                throw new apiError_1.ApiError('Authentication required', 401);
            }
            if (!allowedRoles.includes(req.user.role)) {
                throw new apiError_1.ApiError('You do not have permission to access this resource', 403);
            }
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
exports.authorize = authorize;
exports.requireAdmin = (0, exports.authorize)(client_1.Role.admin);
exports.requireEmployee = (0, exports.authorize)(client_1.Role.admin, client_1.Role.employee);
exports.requireTourist = (0, exports.authorize)(client_1.Role.tourist);
