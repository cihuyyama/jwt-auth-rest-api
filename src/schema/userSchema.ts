import {string, object,TypeOf} from "zod"

export const createUserSchema = object({
    body: object({
        username: string({
            required_error: "Username is required"
        }),
        password: string({
            required_error: "Password is required"
        }).min(6, "Password is too short - should be min 6 chars"),
        passwordConfirmation: string({
            required_error: "Password Confirmation is required"
        }),
        email: string({
            required_error: "Email is required",
        }).email("not a valid email"),
    }).refine((data)=>data.password === data.passwordConfirmation, {
        message: "Password do not match",
        path: ["passwordConfirmation"],
    })
})

export const verifyUserSchema = object({
    
})

export type CreateUserInput = TypeOf<typeof createUserSchema>['body']