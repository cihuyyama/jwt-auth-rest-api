import express from "express";
import validateResource from "../middleware/validateResource";
import { createSessionSchema } from "../schema/authSchema";
import { createSessionHandler, refreshAccessTokenHandler } from "../controller/authController";

const router = express.Router()

router.post('/api/sessions', validateResource(createSessionSchema), createSessionHandler)
router.post('/api/sessions/refresh', refreshAccessTokenHandler)

export default router