import { Router } from "express";
import { paymentController } from "../controllers/payment";
import { authenticate, requireTourist, requireEmployee} from "../middlewares/Auth";
import { validate } from "../middlewares/validate";
import { createPaymentSchema, updatePaymentSchema } from "../validator/index.validator";

const router = Router();

router.get("/trip/:tripId", authenticate, paymentController.getPaymentByTripId);
// Routes untuk tourist - hanya bisa akses payment mereka sendiri
router.get("/my-payments", authenticate, requireTourist, paymentController.getMyPayments);
router.post("/my-payment", authenticate, requireTourist, validate(createPaymentSchema), paymentController.createMyPayment);
router.patch("/my-payment/:id/cancel", authenticate, requireTourist, paymentController.cancelMyPayment);


router.get("/", authenticate, requireEmployee, paymentController.getAllPayments);
router.get("/:id", authenticate, requireEmployee, paymentController.getPaymentById);
router.post("/", authenticate, requireEmployee, validate(createPaymentSchema), paymentController.createPayment);
router.put("/:id", authenticate, requireEmployee, validate(updatePaymentSchema), paymentController.updatePayment);
router.delete("/:id", authenticate, requireEmployee, paymentController.deletePayment);
router.patch("/:id/confirm", authenticate, requireEmployee, paymentController.confirmPayment);


export default router;