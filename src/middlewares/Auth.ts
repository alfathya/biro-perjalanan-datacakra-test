import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../utils/prisma';
import { ApiError } from '../utils/apiError';
import { JwtPayload } from '../types/auth';
import { Role } from "@prisma/client";

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError('Access token is required', 401);
    }

    const token = authHeader.substring(7);
    
    if (!process.env.JWT_SECRET) {
      throw new ApiError('JWT secret is not configured', 500);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
    
    const user = await prisma.user.findUnique({
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
      throw new ApiError('User not found', 401);
    }

    if (!user.isActive) {
      throw new ApiError('Account is not active', 401);
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new ApiError('Invalid token', 401));
    } else if (error instanceof jwt.TokenExpiredError) {
      next(new ApiError('Token has expired', 401));
    } else {
      next(error);
    }
  }
};

export const authorize = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new ApiError('Authentication required', 401);
      }

      if (!allowedRoles.includes(req.user.role)) {
        throw new ApiError('You do not have permission to access this resource', 403);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export const requireAdmin = authorize(Role.admin);
export const requireEmployee = authorize(Role.admin, Role.employee);
export const requireTourist = authorize(Role.tourist);