"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tourist_1 = __importDefault(require("../controllers/tourist"));
const Auth_1 = require("../middlewares/Auth");
const validate_1 = require("../middlewares/validate");
const index_validator_1 = require("../validator/index.validator");
const router = (0, express_1.Router)();
router.delete("/:id", Auth_1.authenticate, Auth_1.requireEmployee, tourist_1.default.deleteTourist);
router.patch("/:id", Auth_1.authenticate, Auth_1.requireEmployee, (0, validate_1.validate)(index_validator_1.updateTouristProfileSchema), tourist_1.default.updateTouristByEmployee);
router.patch("/profile", Auth_1.authenticate, Auth_1.requireTourist, (0, validate_1.validate)(index_validator_1.updateTouristProfileSchema), tourist_1.default.updateTouristProfile);
router.get("/profile", Auth_1.authenticate, Auth_1.requireTourist, tourist_1.default.getTouristProfile);
router.get("/list", Auth_1.authenticate, Auth_1.requireEmployee, tourist_1.default.getTouristList);
router.get("/detail/:id", Auth_1.authenticate, Auth_1.requireEmployee, tourist_1.default.getDetailTourist);
exports.default = router;
