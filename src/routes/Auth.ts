import { Router } from 'express';
import AuthController from '../controllers/Auth';
import { authenticate, requireAdmin } from "../middlewares/Auth";
import { validate } from '../middlewares/validate';
import { RegisterSchema, LoginSchema } from '../validators/auth.validator';

const router = Router();

router.post('/register', validate(RegisterSchema), AuthController.register);
router.post('/login', validate(LoginSchema), AuthController.login);

router.post('/employee/register', authenticate, requireAdmin, validate(RegisterSchema), AuthController.employeeRegister);

export default router;