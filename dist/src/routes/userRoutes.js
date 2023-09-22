"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validateResource_1 = __importDefault(require("../middleware/validateResource"));
const userSchema_1 = require("../schema/userSchema");
const userController_1 = require("../controller/userController");
const requireUser_1 = __importDefault(require("../middleware/requireUser"));
const router = express_1.default.Router();
router.post('/api/users', (0, validateResource_1.default)(userSchema_1.createUserSchema), userController_1.createUserHandler);
router.post('/api/users/verify/:id/:verificationCode', (0, validateResource_1.default)(userSchema_1.verifyUserSchema), userController_1.verifyUserHandler);
router.post('/api/users/forgotpassword', (0, validateResource_1.default)(userSchema_1.forgotPasswordSchema), userController_1.forgotPasswordHandler);
router.post('/api/users/resetpassword/:id/:passwordResetCode', (0, validateResource_1.default)(userSchema_1.resetPasswordSchema), userController_1.resetPasswordHandler);
router.get('/api/users/me', requireUser_1.default, userController_1.getCurrentUserHandler);
exports.default = router;
