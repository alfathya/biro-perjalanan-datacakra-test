"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Auth_1 = __importDefault(require("./Auth"));
const tourist_1 = __importDefault(require("./tourist"));
const destination_1 = __importDefault(require("./destination"));
const trip_1 = __importDefault(require("./trip"));
const payment_1 = __importDefault(require("./payment"));
const router = (0, express_1.Router)();
router.get('/', (req, res) => {
    res.send('Mlaka mulu server running!');
});
router.use('/auth', Auth_1.default);
router.use('/tourist', tourist_1.default);
router.use('/destination', destination_1.default);
router.use('/trip', trip_1.default);
router.use('/payment', payment_1.default);
exports.default = router;
