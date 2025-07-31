import { Request, Response, NextFunction } from 'express';
import AuthService from '../services/Auth';
import { RegisterRequestBody, LoginRequestBody, CreateTouristRequest } from "../types/auth";
import { ApiResponse } from '../types/index';

class AuthController {
    static async employeeRegister(req: Request<{}, {}, RegisterRequestBody>, res: Response<ApiResponse>, next: NextFunction) {
        try {
            const data: RegisterRequestBody = req.body;
            const registered = await AuthService.employeeRegister(data);
            
            res.status(201).json({
                success: true,
                message: 'Register success',
                data: registered
            })
        } catch (error) {
            next(error)
        }
    }
    static async touristRegister(req: Request<{}, {}, RegisterRequestBody>, res: Response<ApiResponse>, next: NextFunction) {
        try {
            const data: RegisterRequestBody = req.body;
            const registered = await AuthService.registerTourist(data);
            
            res.status(201).json({
                success: true,
                message: 'Register success',
                data: registered
            })
        } catch (error) {
            next(error)
        }
    }

    static async touristRegisterByEmployee(req: Request<{}, {}, CreateTouristRequest>, res: Response<ApiResponse>, next: NextFunction) {
        try {
            const data: CreateTouristRequest = req.body;
            const registered = await AuthService.touristRegisterByEmployee(data);
            
            res.status(201).json({
                success: true,
                message: 'Register success',
                data: registered
            })
        } catch (error) {
            next(error)
        }
    }

    static async login(req: Request<{}, {}, LoginRequestBody>, res: Response<ApiResponse>, next: NextFunction) {
        try {
            const data: LoginRequestBody = req.body;
            const logged = await AuthService.login(data);

            res.status(200).json({
                success: true,
                message: 'Login success',
                data: logged
            })
        } catch (error) {
            next(error)
        }
    }

    static async approveTourist(req: Request<{ id: string }>, res: Response<ApiResponse>, next: NextFunction) {
        try {
            const { id } = req.params;
            const approved = await AuthService.approveTourist(id);

            res.status(200).json({
                success: true,
                message: 'Tourist approved successfully',
                data: approved
            })
        } catch (error) {
            next(error)
        }
    }
}

export default AuthController;