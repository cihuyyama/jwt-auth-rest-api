import { NextFunction, Request, Response } from "express";
import { verifyJwt } from "../utils/jwt";

const deserializeUser = async (req: Request, res: Response, next: NextFunction) => {

    const accessToken = (req.headers.authorization || "").replace(/^Bearer\s/, "")

    if (!accessToken) {
        return next()
    }

    const decoded = verifyJwt(accessToken, "accessTokenPublicKey")
    const decoded2 = verifyJwt(accessToken, "refreshTokenPublicKey")

    if (decoded) {
        console.log(decoded)
        console.log(decoded2)
        res.locals.user = decoded
    } else {
        console.log(decoded)
        console.log(decoded2)
        res.sendStatus(401)
        return next()
    }

    return next()
}

export default deserializeUser