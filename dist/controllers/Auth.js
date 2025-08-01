"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Auth_1 = __importDefault(require("../services/Auth"));
class AuthController {
    static async employeeRegister(req, res, next) {
        try {
            const data = req.body;
            const registered = await Auth_1.default.employeeRegister(data);
            res.status(201).json({
                success: true,
                message: 'Register success',
                data: registered
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async touristRegister(req, res, next) {
        try {
            const data = req.body;
            const registered = await Auth_1.default.registerTourist(data);
            res.status(201).json({
                success: true,
                message: 'Register success',
                data: registered
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async touristRegisterByEmployee(req, res, next) {
        try {
            const data = req.body;
            const registered = await Auth_1.default.touristRegisterByEmployee(data);
            res.status(201).json({
                success: true,
                message: 'Register success',
                data: registered
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async login(req, res, next) {
        try {
            const data = req.body;
            const logged = await Auth_1.default.login(data);
            res.status(200).json({
                success: true,
                message: 'Login success',
                data: logged
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async approveTourist(req, res, next) {
        try {
            const { id } = req.params;
            const approved = await Auth_1.default.approveTourist(id);
            res.status(200).json({
                success: true,
                message: 'Tourist approved successfully',
                data: approved
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.default = AuthController;
