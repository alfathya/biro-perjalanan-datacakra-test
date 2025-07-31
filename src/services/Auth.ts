import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Role } from '@prisma/client';
import { prisma } from '../utils/prisma';
import { RegisterRequestBody, UserResponse } from '../types/auth';
import { ApiError } from '../utils/apiError';

class AuthService {
  static async registerTourist(data: RegisterRequestBody): Promise<UserResponse> {
    try {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            throw new ApiError('Please enter a valid email address', 400);
        }

        const isEmailExist = await prisma.user.findUnique({
            where: {
                email: data.email
            }
        })

        if (isEmailExist) {
            throw new ApiError('Email already exist', 409);
        }

        if(data.password.length < 8) {
            throw new ApiError('Password must be at least 8 characters', 400);
        }

        if(data.password !== data.confirmPassword) {
            throw new ApiError('Password and confirm password must be the same', 400);
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);

        const createUserData = {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          password: hashedPassword,
          phone: data.phone,
          role: Role.tourist,
          isActive: true,
        }; 
        const registered = await prisma.user.create({
            data: createUserData
        })
        
        return {
            id: registered.id,
            firstName: registered.firstName,
            lastName: registered.lastName,
            email: registered.email,
            role: registered.role,
        }
    } catch (error) {
        throw error;
    }
  }
}

export default AuthService;