"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const destination_1 = __importDefault(require("../controllers/destination"));
const Auth_1 = require("../middlewares/Auth");
const validate_1 = require("../middlewares/validate");
const index_validator_1 = require("../validator/index.validator");
const router = (0, express_1.Router)();
router.get("/", destination_1.default.getAll);
router.get("/detail/:id", destination_1.default.getById);
router.post("/", Auth_1.authenticate, Auth_1.requireAdmin, (0, validate_1.validate)(index_validator_1.createDestinationSchema), destination_1.default.create);
router.put("/:id", Auth_1.authenticate, Auth_1.requireAdmin, (0, validate_1.validate)(index_validator_1.updateDestinationSchema), destination_1.default.update);
router.delete("/:id", Auth_1.authenticate, Auth_1.requireAdmin, destination_1.default.delete);
exports.default = router;
