import { JwtPayload as BaseJwtPayload } from "jsonwebtoken";
import { Role } from "@prisma/client";
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: Role;
        firstName: string;
        lastName: string;
      };
    }
  }
}

export interface JwtPayload extends BaseJwtPayload {
  id: string;
  email: string;
  role: Role;
  firstName: string;
  lastName: string;
}

export interface RegisterRequestBody {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface LoginRequestBody {
  email: string;
  password: string;
}

export interface UserResponse {
  id: string;
  email: string;
  role: "admin" | "employee" | "tourist";
  firstName: string;
  lastName: string;
}

export interface LoginResponse {
  user: UserResponse;
  token: string;
}

export interface CreateTouristRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
  dateOfBirth?: string;
  nationality?: string;
  identityNumber?: string;
  emergencyContact?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
}

export interface TouristResponse {
  id: string;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
  touristId?: string;
}

export interface UpdateTouristProfile {
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: string;
  nationality?: string;
  identityNumber?: string;
  emergencyContact?: string;
  isActive?: boolean;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
}