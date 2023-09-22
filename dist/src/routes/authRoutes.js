"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validateResource_1 = __importDefault(require("../middleware/validateResource"));
const authSchema_1 = require("../schema/authSchema");
const authController_1 = require("../controller/authController");
const router = express_1.default.Router();
router.post('/api/sessions', (0, validateResource_1.default)(authSchema_1.createSessionSchema), authController_1.createSessionHandler);
router.post('/api/sessions/refresh', authController_1.refreshAccessTokenHandler);
exports.default = router;
