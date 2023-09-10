import { Request, Response } from "express";
import { CreateSessionInput } from "../schema/authSchema";
import { findUserByEmail } from "../service/userService";
import { signAccessToken, signRefreshToken } from "../service/authService";

export async function createSessionHandler(req: Request<{},{},CreateSessionInput>, res: Response) {
    const message = "Invalid email or password"
    const {email, password} = req.body

    const user = await findUserByEmail(email)

    if (!user) {
        return res.send(message)
    }

    if (!user.verified) {
        return res.send("Please verify your email")
    }

    const isValid = await user.validatePassword(password)

    if (!isValid) {
        return res.send(message)
    }

    const accessToken = signAccessToken(user)

    const refreshToken = await signRefreshToken({
        userId: String(user._id)
    })

    return res.send({
        accessToken,
        refreshToken
    })

}