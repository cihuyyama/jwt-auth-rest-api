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
exports.getEmail = void 0;
const config_1 = __importDefault(require("config"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const logger_1 = __importDefault(require("./logger"));
// async function createCreds() {
//     const creds = await nodemailer.createTestAccount()
//     console.log({creds})
// }
// createCreds()
const smtp = config_1.default.get('smtp');
const transporter = nodemailer_1.default.createTransport(Object.assign(Object.assign({}, smtp), { auth: { user: smtp.user, pass: smtp.pass } }));
function sendEmail(payload) {
    return __awaiter(this, void 0, void 0, function* () {
        transporter.sendMail(payload, (e, info) => {
            if (e) {
                logger_1.default.error(e, "Error sending email");
            }
            logger_1.default.info(`Preview Url: ${nodemailer_1.default.getTestMessageUrl(info)}`);
        });
    });
}
function getEmail(payload) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            transporter.sendMail(payload, (e, info) => {
                if (e) {
                    logger_1.default.error(e, "Error sending email");
                    reject(e);
                }
                else {
                    const previewUrl = nodemailer_1.default.getTestMessageUrl(info);
                    if (previewUrl) {
                        // log.info(`Preview Url: ${previewUrl}`);
                        resolve(previewUrl);
                    }
                    else {
                        // log.warn('No preview URL available. Not using the test email service.');
                        resolve(false); // Resolve with `false` if there's no preview URL
                    }
                }
            });
        });
    });
}
exports.getEmail = getEmail;
exports.default = sendEmail;
