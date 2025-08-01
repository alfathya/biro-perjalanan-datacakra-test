"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const trip_1 = __importDefault(require("../controllers/trip"));
const Auth_1 = require("../middlewares/Auth");
const validate_1 = require("../middlewares/validate");
const index_validator_1 = require("../validator/index.validator");
const router = (0, express_1.Router)();
// Routes untuk Employee/Admin - dapat mengakses semua trip
router.get("/list", Auth_1.authenticate, Auth_1.requireEmployee, trip_1.default.getTripList);
router.get("/detail/:id", Auth_1.authenticate, Auth_1.requireEmployee, trip_1.default.getTripById);
router.post("/create", Auth_1.authenticate, Auth_1.requireEmployee, (0, validate_1.validate)(index_validator_1.createTripSchema), trip_1.default.createTrip);
router.patch("/:id", Auth_1.authenticate, Auth_1.requireEmployee, (0, validate_1.validate)(index_validator_1.updateTripSchema), trip_1.default.updateTrip);
router.delete("/:id", Auth_1.authenticate, Auth_1.requireEmployee, trip_1.default.deleteTrip);
router.get("/tourist/:touristId", Auth_1.authenticate, Auth_1.requireEmployee, trip_1.default.getTripsByTourist);
// Routes untuk Tourist - hanya dapat mengakses trip mereka sendiri
router.get("/my-trips", Auth_1.authenticate, Auth_1.requireTourist, trip_1.default.getMyTrips);
router.post("/book", Auth_1.authenticate, Auth_1.requireTourist, (0, validate_1.validate)(index_validator_1.createTripSchema.omit({ touristId: true })), trip_1.default.createTripForTourist);
router.patch("/rating/:id", Auth_1.authenticate, Auth_1.requireTourist, trip_1.default.updateTripRating);
exports.default = router;
