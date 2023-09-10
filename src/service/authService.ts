import { DocumentType } from "@typegoose/typegoose";
import { User } from "../model/userModel";
import { signJwt } from "../utils/jwt";
import SessionModel from "../model/sessionModel";

export async function createSession({ userId }: { userId: string }) {
    return SessionModel.create({ user: userId })
}

export async function signRefreshToken({ userId }: { userId: string }) {
    const session = await createSession({
        userId,
    })

    const refreshToken = signJwt(
        {session: session.id},
        "refreshTokenPrivateKey"
    )

    return refreshToken
}

export function signAccessToken(user: DocumentType<User>) {

    const payload = user.toJSON()

    const accessToken = signJwt(payload, "accessTokenPrivateKey")

    return accessToken
}