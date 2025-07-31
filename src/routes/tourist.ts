import { Router } from 'express';
import TouristController from '../controllers/tourist';
import { authenticate, requireAdmin, requireEmployee  } from "../middlewares/Auth";

const router = Router();

router.get('/list', authenticate, requireEmployee, TouristController.getTouristList);
router.get('/detail/:id', authenticate, requireEmployee, TouristController.getDetailTourist);

export default router;