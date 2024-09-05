import express from "express";
import {
  createTask,
  getTasks,
  completeTask,
  deleteTask,
} from "../controllers/tasks.js";

import tokenVerify from "../middleware/auth.js";

const router = express.Router();

// Create new task
router.post("/", tokenVerify, createTask);

// get all tasks
router.get("/", tokenVerify, getTasks);

// mark task as completed
router.patch("/:id/complete", tokenVerify, completeTask);

// approveing task
// router.patch("/:id/approve", tokenVerify, approveTask);

// Delete task
router.delete("/:id/remove", tokenVerify, deleteTask);

export default router;
