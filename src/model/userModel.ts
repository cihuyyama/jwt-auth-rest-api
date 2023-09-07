import { prop, getModelForClass, modelOptions, Severity, pre } from "@typegoose/typegoose";
import argon2 from "argon2";
import { nanoid } from "nanoid";


@pre<User>("save", async function () {
    if(!this.isModified('password')){
        return
    }

    const hash = await argon2.hash(this.password)
    this.password = hash
    return
})
@modelOptions({
    schemaOptions: {
        timestamps: true
    },
    options: {
        allowMixed: Severity.ALLOW
    }
})
export class User {
    @prop({lowercase: true, required: true, unique: true})
    email: string

    @prop({required: true})
    username: string

    @prop({required: true})
    password: string

    @prop({required: true, default: ()=>nanoid})
    verificationCode: string

    @prop()
    passwordResetCode: string | null

    @prop({default: false})
    verified: boolean
}

const UserModel = getModelForClass(User)

export default UserModel