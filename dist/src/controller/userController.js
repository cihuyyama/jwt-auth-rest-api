"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentUserHandler = exports.resetPasswordHandler = exports.forgotPasswordHandler = exports.verifyUserHandler = exports.createUserHandler = void 0;
const userService_1 = require("../service/userService");
const nanoid_1 = require("nanoid");
const mailer_1 = require("../utils/mailer");
const logger_1 = __importDefault(require("../utils/logger"));
function createUserHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const body = req.body;
        try {
            const user = yield (0, userService_1.createUser)(body);
            const emailVerif = yield (0, mailer_1.getEmail)({
                from: 'test@mail.com',
                to: user.email,
                subject: "Please verification here",
                text: `Verification Code ${user.verificationCode}. Id: ${user.id}`
            });
            return res.status(200).json({
                "message": "User succesfully created",
                "url": emailVerif
            });
        }
        catch (e) {
            if (e.code === 11000) {
                return res.status(409).send("Account already exists");
            }
            return res.status(500).send(e);
        }
    });
}
exports.createUserHandler = createUserHandler;
function verifyUserHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        const verificationcode = req.params.verificationCode;
        const user = yield (0, userService_1.findUserById)(id);
        if (!user) {
            return res.status(404).send('Could not verify User');
        }
        if (user.verified) {
            return res.send('User is already verified');
        }
        if (user.verificationCode === verificationcode) {
            user.verified = true;
            yield user.save();
            return res.send("User succesfuly verified");
        }
        return res.status(400).send("Could not verify user");
    });
}
exports.verifyUserHandler = verifyUserHandler;
function forgotPasswordHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const message = "check your email for reset password";
        const { email } = req.body;
        const user = yield (0, userService_1.findUserByEmail)(email);
        if (!user) {
            logger_1.default.debug(`User with ${email} does not exists`);
            return res.status(404).send(message);
        }
        if (!user.verified) {
            return res.status(403).send("User is not verified");
        }
        const passwordResetCode = (0, nanoid_1.nanoid)();
        user.passwordResetCode = passwordResetCode;
        yield user.save();
        const emailVerif = yield (0, mailer_1.getEmail)({
            from: 'test@mail.com',
            to: user.email,
            subject: "Please verification here",
            text: `Verification Code ${user.verificationCode}. Id: ${user.id}`
        });
        logger_1.default.debug(`Password reset email sent to ${email}`);
        return res.status(200).json({
            "message": "User succesfully created",
            "url": emailVerif
        });
    });
}
exports.forgotPasswordHandler = forgotPasswordHandler;
function resetPasswordHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id, passwordResetCode } = req.params;
        const { password } = req.body;
        const user = yield (0, userService_1.findUserById)(id);
        if (!user || !user.passwordResetCode || user.passwordResetCode !== passwordResetCode) {
            return res.status(400).send('Could not reset user password');
        }
        user.passwordResetCode = null;
        user.password = password;
        yield user.save();
        return res.status(200).send('succesfuly updated password');
    });
}
exports.resetPasswordHandler = resetPasswordHandler;
function getCurrentUserHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        return res.send(res.locals.user);
    });
}
exports.getCurrentUserHandler = getCurrentUserHandler;
