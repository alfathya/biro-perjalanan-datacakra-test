import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Role } from '@prisma/client';
import { prisma } from '../utils/prisma';
import {
  RegisterRequestBody,
  UserResponse,
  LoginRequestBody,
  LoginResponse,
  JwtPayload,
  CreateTouristRequest,
  TouristResponse
} from "../types/auth";
import { ApiError } from '../utils/apiError';

class AuthService {
  static async employeeRegister(
    data: RegisterRequestBody
  ): Promise<UserResponse> {
    try {
      const isEmailExist = await prisma.user.findUnique({
        where: {
          email: data.email,
        },
      });

      if (isEmailExist) {
        throw new ApiError("Email already exist", 409);
      }

      if (data.password.length < 8) {
        throw new ApiError("Password must be at least 8 characters", 400);
      }

      if (data.password !== data.confirmPassword) {
        throw new ApiError(
          "Password and confirm password must be the same",
          400
        );
      }

      const hashedPassword = await bcrypt.hash(data.password, 10);

      const createUserData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: hashedPassword,
        phone: data.phone,
        role: Role.employee,
        isActive: true,
      };

      const registered = await prisma.user.create({
        data: createUserData,
      });

      return {
        id: registered.id,
        firstName: registered.firstName,
        lastName: registered.lastName,
        email: registered.email,
        role: registered.role,
      };
    } catch (error) {
      throw error;
    }
  }

  static async registerTourist(
    data: RegisterRequestBody
  ): Promise<UserResponse> {
    try {
      const isEmailExist = await prisma.user.findUnique({
        where: {
          email: data.email,
        },
      });

      if (isEmailExist) {
        throw new ApiError("Email already exist", 409);
      }

      if (data.password.length < 8) {
        throw new ApiError("Password must be at least 8 characters", 400);
      }

      if (data.password !== data.confirmPassword) {
        throw new ApiError(
          "Password and confirm password must be the same",
          400
        );
      }

      const hashedPassword = await bcrypt.hash(data.password, 10);

      const registered = await prisma.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          role: Role.tourist,
          isActive: false,
          tourist: {
            create: {
              membershipLevel: "bronze",
              totalTrips: 0,
              totalSpent: 0,
              loyaltyPoints: 0,
            },
          },
        },
        include: {
          tourist: true,
        },
      });

      return {
        id: registered.id,
        firstName: registered.firstName,
        lastName: registered.lastName,
        email: registered.email,
        role: registered.role,
      };
    } catch (error) {
      throw error;
    }
  }

  static async touristRegisterByEmployee(
    data: CreateTouristRequest
  ): Promise<TouristResponse> {
    try {
        console.log(data);
      const isEmailExist = await prisma.user.findUnique({
        where: {
          email: data.email,
        },
      });

      if (isEmailExist) {
        throw new ApiError("Email already exist", 409);
      }

      if (data.password.length < 8) {
        throw new ApiError("Password must be at least 8 characters", 400);
      }

      if (data.password !== data.confirmPassword) {
        throw new ApiError(
          "Password and confirm password must be the same",
          400
        );
      }

      const hashedPassword = await bcrypt.hash(data.password, 10);


      const createdUser = await prisma.$transaction(async (tx) => {
        let addressId: string | undefined;
        if (data.address) {
          const address = await tx.address.create({ data: data.address });
          addressId = address.id;
        }

        const user = await tx.user.create({
          data: {
            email: data.email,
            password: hashedPassword,
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone,
            role: Role.tourist,
            isActive: true,
            tourist: {
              create: {
                membershipLevel: "bronze",
                dateOfBirth: data.dateOfBirth
                  ? new Date(data.dateOfBirth)
                  : undefined,
                nationality: data.nationality,
                identityNumber: data.identityNumber,
                emergencyContact: data.emergencyContact,
                totalTrips: 0,
                totalSpent: 0,
                loyaltyPoints: 0,
                ...(addressId && { addressId }),
              },
            },
          },
          include: {
            tourist: true,
          },
        });

        return user;
      });

      return {
        id: createdUser.id,
        email: createdUser.email,
        role: createdUser.role,
        firstName: createdUser.firstName,
        lastName: createdUser.lastName,
        touristId: createdUser.tourist?.id,
      };
    } catch (error) {
      throw error;
    }
  }

  static async login(data: LoginRequestBody): Promise<LoginResponse> {
    try {
      const user = await prisma.user.findUnique({
        where: { email: data.email },
      });

      if (!user) {
        throw new ApiError("Invalid email or password", 401);
      }

      const isPasswordValid = await bcrypt.compare(
        data.password,
        user.password
      );

      if (!isPasswordValid) {
        throw new ApiError("Invalid email or password", 401);
      }

      if (!user.isActive) {
        throw new ApiError("User is not active", 401);
      }

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
        } as JwtPayload,
        process.env.JWT_SECRET!,
        {
          expiresIn: "1d",
        }
      );

      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  static async approveTourist(id: string): Promise<TouristResponse> {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user || user.role !== Role.tourist)
      throw new ApiError("User not found or not a tourist", 404);

    return await prisma.user.update({
      where: { id },
      data: { isActive: true },
    });
    
  }
}

export default AuthService;