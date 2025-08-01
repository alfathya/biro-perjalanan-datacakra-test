"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const apiError_1 = require("../utils/apiError");
const validate = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
        const errors = result.error.issues.map((e) => `${e.path.join(".")}: ${e.message}`);
        return next(new apiError_1.ApiError(`Validation error: ${errors.join(", ")}`, 400));
    }
    req.body = result.data;
    next();
};
exports.validate = validate;
