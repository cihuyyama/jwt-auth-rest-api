import { DocumentType } from "@typegoose/typegoose";
import { User, privateFields } from "../model/userModel";
import { signJwt } from "../utils/jwt";
import SessionModel from "../model/sessionModel";
import { omit } from "lodash";

export async function createSession({ userId }: { userId: string }) {
    return SessionModel.create({ user: userId })
}

export async function signRefreshToken({ userId }: { userId: string }) {
    const session = await createSession({
        userId,
    })

    const refreshToken = signJwt(
        {session: session.id},
        "refreshTokenPrivateKey",
        {
            expiresIn: '5h',
        }
    )

    return refreshToken
}

export function signAccessToken(user: DocumentType<User>) {

    const payload = omit(user.toJSON(), privateFields)

    const accessToken = signJwt(payload, "accessTokenPrivateKey", {
        expiresIn: '15m'
    })

    return accessToken
}

export async function findSessionById(id: string) {
    return SessionModel.findById(id)
}

