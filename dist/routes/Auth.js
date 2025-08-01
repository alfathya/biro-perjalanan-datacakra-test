"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Auth_1 = __importDefault(require("../controllers/Auth"));
const Auth_2 = require("../middlewares/Auth");
const validate_1 = require("../middlewares/validate");
const index_validator_1 = require("../validator/index.validator");
const router = (0, express_1.Router)();
router.post("/login", (0, validate_1.validate)(index_validator_1.LoginSchema), Auth_1.default.login);
router.post("/tourist/register", (0, validate_1.validate)(index_validator_1.RegisterSchema), Auth_1.default.touristRegister);
router.post("/employee/register", Auth_2.authenticate, Auth_2.requireAdmin, (0, validate_1.validate)(index_validator_1.RegisterSchema), Auth_1.default.employeeRegister);
router.post("/employee/tourist-register", Auth_2.authenticate, Auth_2.requireEmployee, (0, validate_1.validate)(index_validator_1.CreateTouristSchema), Auth_1.default.touristRegisterByEmployee);
router.post("/employee/tourist-approve/:id", Auth_2.authenticate, Auth_2.requireEmployee, Auth_1.default.approveTourist);
exports.default = router;
