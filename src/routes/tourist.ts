import { Router } from 'express';
import TouristController from '../controllers/tourist';
import { authenticate, requireAdmin, requireEmployee, requireTourist  } from "../middlewares/Auth";
import { validate } from '../middlewares/validate';
import { updateTouristProfileSchema } from "../validator/auth.validator";

const router = Router();

router.delete("/:id", authenticate, requireEmployee, TouristController.deleteTourist);
router.patch("/:id", authenticate, requireEmployee, validate(updateTouristProfileSchema) , TouristController.updateTouristByEmployee);
router.patch("/profile", authenticate, requireTourist, validate(updateTouristProfileSchema) , TouristController.updateTouristProfile);
router.get("/profile", authenticate, requireTourist, TouristController.getTouristProfile);
router.get('/list', authenticate, requireEmployee, TouristController.getTouristList);
router.get('/detail/:id', authenticate, requireEmployee, TouristController.getDetailTourist);

export default router;