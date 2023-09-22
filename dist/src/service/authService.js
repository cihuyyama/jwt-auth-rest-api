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
exports.findSessionById = exports.signAccessToken = exports.signRefreshToken = exports.createSession = void 0;
const userModel_1 = require("../model/userModel");
const jwt_1 = require("../utils/jwt");
const sessionModel_1 = __importDefault(require("../model/sessionModel"));
const lodash_1 = require("lodash");
function createSession({ userId }) {
    return __awaiter(this, void 0, void 0, function* () {
        return sessionModel_1.default.create({ user: userId });
    });
}
exports.createSession = createSession;
function signRefreshToken({ userId }) {
    return __awaiter(this, void 0, void 0, function* () {
        const session = yield createSession({
            userId,
        });
        const refreshToken = (0, jwt_1.signJwt)({ session: session.id }, "refreshTokenPrivateKey", {
            expiresIn: '5h',
        });
        return refreshToken;
    });
}
exports.signRefreshToken = signRefreshToken;
function signAccessToken(user) {
    const payload = (0, lodash_1.omit)(user.toJSON(), userModel_1.privateFields);
    const accessToken = (0, jwt_1.signJwt)(payload, "accessTokenPrivateKey", {
        expiresIn: '15m'
    });
    return accessToken;
}
exports.signAccessToken = signAccessToken;
function findSessionById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return sessionModel_1.default.findById(id);
    });
}
exports.findSessionById = findSessionById;
