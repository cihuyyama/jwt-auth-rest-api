import { NextFunction, Request, Response } from "express";
import { CreateUserInput, VerifyUserInput } from "../schema/userSchema";
import { createUser, findUserById } from "../service/userService";
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

export async function verifyUserHandler(req: Request<VerifyUserInput>, res: Response) {
    const id = req.params.id
    const verificationcode = req.params.verificationCode

    const user = await findUserById(id)

    if (!user) {
        return res.status(404).send('Could not verify User')
    }

    if (user.verified) {
        return res.send('User is already verified')
    }

    if (user.verificationCode === verificationcode) {
        user.verified = true

        await user.save()

        return res.send("User succesfuly verified")
    }

    return res.status(400).send("Could not verify user")
}