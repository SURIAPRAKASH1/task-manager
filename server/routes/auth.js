import express from "express";
import { login, register } from "../controllers/auth.js";
import upload from "../storage/files.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", upload, register);

export default router;
