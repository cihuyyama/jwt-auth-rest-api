"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const config_1 = __importDefault(require("config"));
const connectToDb_1 = __importDefault(require("./utils/connectToDb"));
const logger_1 = __importDefault(require("./utils/logger"));
const routes_1 = __importDefault(require("./routes"));
const deserializeUser_1 = __importDefault(require("./middleware/deserializeUser"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: '*',
    credentials: true
}));
app.use(express_1.default.json());
app.use(deserializeUser_1.default);
app.get('/', (req, res) => {
    return res.send("App is Running").end();
});
app.use(routes_1.default);
const port = config_1.default.get("port");
app.listen(port, () => {
    logger_1.default.info(`App started at http://localhost:${port}`);
    (0, connectToDb_1.default)();
});
