import { Router } from "express";
import AuthController from "../controllers/Auth";
import {
  authenticate,
  requireAdmin,
  requireEmployee,
} from "../middlewares/Auth";
import { validate } from "../middlewares/validate";
import {
  RegisterSchema,
  LoginSchema,
  CreateTouristSchema,
} from "../validator/index.validator";

const router = Router();

router.post("/login", validate(LoginSchema), AuthController.login);

router.post(
  "/tourist/register",
  validate(RegisterSchema),
  AuthController.touristRegister
);
router.post(
  "/employee/register",
  authenticate,
  requireAdmin,
  validate(RegisterSchema),
  AuthController.employeeRegister
);
router.post(
  "/employee/tourist-register",
  authenticate,
  requireEmployee,
  validate(CreateTouristSchema),
  AuthController.touristRegisterByEmployee
);
router.post(
  "/employee/tourist-approve/:id",
  authenticate,
  requireEmployee,
  AuthController.approveTourist
);

export default router;
