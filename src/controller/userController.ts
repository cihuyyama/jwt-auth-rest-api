import { NextFunction, Request, Response } from "express";
import { CreateUserInput, ForgotPasswordInput, ResetPasswordInput, VerifyUserInput } from "../schema/userSchema";
import { createUser, findUserByEmail, findUserById } from "../service/userService";
import { nanoid } from 'nanoid'
import sendEmail, { getEmail } from "../utils/mailer";
import log from "../utils/logger";

export async function createUserHandler(req: Request<{}, {}, CreateUserInput>, res: Response) {
    const body = req.body

    try {
        const user = await createUser(body)

        const emailVerif = await getEmail({
            from: 'test@mail.com',
            to: user.email,
            subject: "Please verification here",
            text: `Verification Code ${user.verificationCode}. Id: ${user.id}`
        })

        return res.status(200).json({
            "message": "User succesfully created",
            "url": emailVerif
        })
    } catch (e: any) {
        if (e.code === 11000) {
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

export async function forgotPasswordHandler(req: Request<{}, {}, ForgotPasswordInput>, res: Response) {
    const message = "check your email for reset password"

    const { email } = req.body

    const user = await findUserByEmail(email)

    if (!user) {
        log.debug(`User with ${email} does not exists`)
        return res.status(404).send(message)
    }

    if (!user.verified) {
        return res.status(403).send("User is not verified")
    }

    const passwordResetCode = nanoid()

    user.passwordResetCode = passwordResetCode

    await user.save()


    await sendEmail({
        to: user.email,
        from: "resettest@mail.com",
        subject: "Reset your password",
        text: `Password reset code: ${passwordResetCode}. Id ${user._id}`
    })

    log.debug(`Password reset email sent to ${email}`)
    return res.send(message)
}

export async function resetPasswordHandler(req: Request<ResetPasswordInput['params'], {}, ResetPasswordInput['body']>, res: Response) {
    const { id, passwordResetCode } = req.params
    const { password } = req.body

    const user = await findUserById(id)

    if (!user || !user.passwordResetCode || user.passwordResetCode !== passwordResetCode) {
        return res.status(400).send('Could not reset user password')
    }

    user.passwordResetCode = null

    user.password = password

    await user.save()

    return res.status(200).send('succesfuly updated password')
}

export async function getCurrentUserHandler(req: Request, res: Response) {
    return res.send(res.locals.user)
}