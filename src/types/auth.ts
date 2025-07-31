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
