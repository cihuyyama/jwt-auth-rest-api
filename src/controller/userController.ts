import { NextFunction, Request, Response } from "express";
import { CreateUserInput } from "../schema/userSchema";
import { createUser } from "../service/userService";
import sendEmail from "../utils/mailer";

export async function createUserHandler(req: Request<{}, {}, CreateUserInput>, res: Response) {
    const body = req.body

    try {
        const user = await createUser(body)

        await sendEmail({
            from: 'test@mail.com',
            to: user.email,
            subject: "Please verification here",
            text: `Verification Code ${user.verificationCode}. Id: ${user.id}`
        })

        return res.send("User succesfully created")
    } catch (e: any) {
        if(e.code === 11000){
            return res.status(409).send("Account already exists")
        }

        return res.status(500).send(e)
    }
}

export async function verifyUserHandler(req: Request, res: Response) {
    
}