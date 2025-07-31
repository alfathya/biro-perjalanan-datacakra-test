import { z } from "zod";

export const RegisterSchema = z
  .object({
    email: z.email("Invalid email format"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    phone: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password and confirm password must match",
    path: ["confirmPassword"],
  });

export const LoginSchema = z.object({
  email: z.email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export const createTouristSchema = z.object({
  email: z.email("Invalid email format"),
  password: z.string().min(8),
  confirmPassword: z.string().min(8),
  firstName: z.string(),
  lastName: z.string(),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  nationality: z.string().optional(),
  identityNumber: z.string().optional(),
});