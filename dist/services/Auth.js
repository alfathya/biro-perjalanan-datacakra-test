"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const prisma_1 = require("../utils/prisma");
const apiError_1 = require("../utils/apiError");
class AuthService {
    static async employeeRegister(data) {
        try {
            const isEmailExist = await prisma_1.prisma.user.findUnique({
                where: {
                    email: data.email,
                },
            });
            if (isEmailExist) {
                throw new apiError_1.ApiError("Email already exist", 409);
            }
            if (data.password.length < 8) {
                throw new apiError_1.ApiError("Password must be at least 8 characters", 400);
            }
            if (data.password !== data.confirmPassword) {
                throw new apiError_1.ApiError("Password and confirm password must be the same", 400);
            }
            const hashedPassword = await bcrypt_1.default.hash(data.password, 10);
            const createUserData = {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                password: hashedPassword,
                phone: data.phone,
                role: client_1.Role.employee,
                isActive: true,
            };
            const registered = await prisma_1.prisma.user.create({
                data: createUserData,
            });
            return {
                id: registered.id,
                firstName: registered.firstName,
                lastName: registered.lastName,
                email: registered.email,
                role: registered.role,
            };
        }
        catch (error) {
            throw error;
        }
    }
    static async registerTourist(data) {
        try {
            const isEmailExist = await prisma_1.prisma.user.findUnique({
                where: {
                    email: data.email,
                },
            });
            if (isEmailExist) {
                throw new apiError_1.ApiError("Email already exist", 409);
            }
            if (data.password.length < 8) {
                throw new apiError_1.ApiError("Password must be at least 8 characters", 400);
            }
            if (data.password !== data.confirmPassword) {
                throw new apiError_1.ApiError("Password and confirm password must be the same", 400);
            }
            const hashedPassword = await bcrypt_1.default.hash(data.password, 10);
            const registered = await prisma_1.prisma.user.create({
                data: {
                    email: data.email,
                    password: hashedPassword,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    phone: data.phone,
                    role: client_1.Role.tourist,
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
        }
        catch (error) {
            throw error;
        }
    }
    static async touristRegisterByEmployee(data) {
        try {
            const isEmailExist = await prisma_1.prisma.user.findUnique({
                where: {
                    email: data.email,
                },
            });
            if (isEmailExist) {
                throw new apiError_1.ApiError("Email already exist", 409);
            }
            if (data.password.length < 8) {
                throw new apiError_1.ApiError("Password must be at least 8 characters", 400);
            }
            if (data.password !== data.confirmPassword) {
                throw new apiError_1.ApiError("Password and confirm password must be the same", 400);
            }
            const hashedPassword = await bcrypt_1.default.hash(data.password, 10);
            const createdUser = await prisma_1.prisma.$transaction(async (tx) => {
                let addressId;
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
                        role: client_1.Role.tourist,
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
        }
        catch (error) {
            throw error;
        }
    }
    static async login(data) {
        try {
            const user = await prisma_1.prisma.user.findUnique({
                where: { email: data.email },
            });
            if (!user) {
                throw new apiError_1.ApiError("Invalid email or password", 401);
            }
            const isPasswordValid = await bcrypt_1.default.compare(data.password, user.password);
            if (!isPasswordValid) {
                throw new apiError_1.ApiError("Invalid email or password", 401);
            }
            if (!user.isActive) {
                throw new apiError_1.ApiError("User is not active", 401);
            }
            const token = jsonwebtoken_1.default.sign({
                id: user.id,
                email: user.email,
                role: user.role,
                firstName: user.firstName,
                lastName: user.lastName,
            }, process.env.JWT_SECRET, {
                expiresIn: "1d",
            });
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
        }
        catch (error) {
            throw error;
        }
    }
    static async approveTourist(id) {
        const user = await prisma_1.prisma.user.findUnique({ where: { id } });
        if (!user || user.role !== client_1.Role.tourist)
            throw new apiError_1.ApiError("User not found or not a tourist", 404);
        return await prisma_1.prisma.user.update({
            where: { id },
            data: { isActive: true },
        });
    }
}
exports.default = AuthService;
