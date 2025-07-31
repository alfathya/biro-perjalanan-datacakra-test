import { Request, Response, NextFunction } from 'express';
import AuthService from '../services/Auth';
import { RegisterRequestBody, LoginRequestBody } from "../types/auth";
import { ApiResponse } from '../types/index';

class AuthController {
    static async register(req: Request<{}, {}, RegisterRequestBody>, res: Response<ApiResponse>, next: NextFunction) {
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
}

export default AuthController;