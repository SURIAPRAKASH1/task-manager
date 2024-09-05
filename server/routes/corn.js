import express from "express";
import tokenVerify from "../middleware/auth.js";
import pushMessage from "../controllers/cron.js";

const router = express.Router();

router.post("/", tokenVerify, pushMessage);
