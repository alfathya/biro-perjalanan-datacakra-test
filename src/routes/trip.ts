import { Router } from "express";
import TripController from "../controllers/trip";
import {
  authenticate,
  requireAdmin,
  requireEmployee,
  requireTourist,
} from "../middlewares/Auth";
import { validate } from "../middlewares/validate";
import { createTripSchema, updateTripSchema } from "../validator/index.validator";

const router = Router();

// Routes untuk Employee/Admin - dapat mengakses semua trip
router.get("/list", authenticate, requireEmployee, TripController.getTripList);
router.get("/detail/:id", authenticate, requireEmployee, TripController.getTripById);
router.post("/create", authenticate, requireEmployee, validate(createTripSchema), TripController.createTrip);
router.patch("/:id", authenticate, requireEmployee, validate(updateTripSchema), TripController.updateTrip);
router.delete("/:id",authenticate,requireEmployee,TripController.deleteTrip);
router.get("/tourist/:touristId", authenticate, requireEmployee, TripController.getTripsByTourist);

// Routes untuk Tourist - hanya dapat mengakses trip mereka sendiri
router.get("/my-trips", authenticate, requireTourist, TripController.getMyTrips);
router.post("/book", authenticate, requireTourist, validate(createTripSchema.omit({ touristId: true })),TripController.createTripForTourist);
router.patch("/rating/:id", authenticate, requireTourist, TripController.updateTripRating);

export default router;