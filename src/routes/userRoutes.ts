import express from "express";
import validateResource from "../middleware/validateResource";
import { createUserSchema } from "../schema/userSchema";
import { createUserHandler } from "../controller/userController";

const router = express.Router()

router.post('/api/users', validateResource(createUserSchema), createUserHandler)

export default router