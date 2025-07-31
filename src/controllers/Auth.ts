import { Request, Response, NextFunction } from 'express';
import AuthService from '../services/Auth';
import { RegisterRequestBody } from "../types/auth";
import { ApiResponse } from '../types/index';

class AuthController {
    static async register(req: Request<{}, {}, RegisterRequestBody>, res: Response<ApiResponse>, next: NextFunction) {
        try {
            const data = req.body;
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
}

export default AuthController;