import express from "express";
import validateResource from "../middleware/validateResource";
import { createSessionSchema } from "../schema/authSchema";
import { createSessionHandler } from "../controller/authController";

const router = express.Router()

router.post('/api/sessions', validateResource(createSessionSchema), createSessionHandler)

export default router