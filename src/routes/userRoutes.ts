import express from "express";
import validateResource from "../middleware/validateResource";
import { createUserSchema, verifyUserSchema } from "../schema/userSchema";
import { createUserHandler, verifyUserHandler } from "../controller/userController";

const router = express.Router()

router.post('/api/users', validateResource(createUserSchema), createUserHandler)
router.post('/api/users/verify/:id/:verificationCode', validateResource(verifyUserSchema), verifyUserHandler)

export default router