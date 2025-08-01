import { Router } from "express";
import DestinationController from "../controllers/destination";
import {
  authenticate,
  requireAdmin,
  requireEmployee,
  requireTourist,
} from "../middlewares/Auth";
import { validate } from "../middlewares/validate";
import {
  createDestinationSchema,
  updateDestinationSchema,
} from "../validator/index.validator";

const router = Router();

router.get("/", DestinationController.getAll);
router.get("/detail/:id", DestinationController.getById);

router.post("/", authenticate, requireAdmin, validate(createDestinationSchema), DestinationController.create);
router.put("/:id", authenticate, requireAdmin, validate(updateDestinationSchema), DestinationController.update);
router.delete("/:id", authenticate, requireAdmin, DestinationController.delete);

export default router;
