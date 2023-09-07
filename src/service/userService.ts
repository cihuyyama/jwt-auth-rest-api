import UserModel, { User } from "../model/userModel";

export function createUser(input: Partial<User>) {
    return UserModel.create(input)
}