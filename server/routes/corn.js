import express from "express";
import tokenVerify from "../middleware/auth.js";
import { pushMessage } from "../controllers/cron.js";

const router = express.Router();

router.post("/push-subscribe", tokenVerify, pushMessage);

export default router;
