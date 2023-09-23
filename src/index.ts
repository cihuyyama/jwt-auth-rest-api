import "dotenv/config";
import express from "express";
import config from "config";
import connectToDb from "./utils/connectToDb";
import log from "./utils/logger";
import router from "./routes";
import deserializeUser from "./middleware/deserializeUser";
import cors from 'cors'

const app = express();

app.use(cors({
    origin: '*',
    credentials: true
}))

app.use(express.json())

app.use(deserializeUser)

app.get('/',(req: express.Request, res: express.Response)=>{
    return res.send("App is Running").end()
})

app.use(router)

const port = config.get("port");

app.listen(port, () => {    
    log.info(`App started at http://localhost:${port}`)

    connectToDb();
});
