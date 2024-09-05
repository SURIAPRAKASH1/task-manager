import Task from "../models/Tasks.js";
import User from "../models/User.js";
import {
  BadRequestError,
  NotFoundError,
  UnAuthenticatedError,
} from "../errors/index.js";
import { sendNotification } from "../controllers/cron.js";

import { StatusCodes } from "http-status-codes";
import moment from "moment-timezone";
import cron from "node-cron";

// POST

export const createTask = async (req, res) => {
  const {
    title,
    description,
    endTime,
    approvalRequired = false,
    approverId = null,
  } = req.body;

  if (!title || !description || !endTime) {
    throw new BadRequestError("Provide nessary details to create task");
  }

  const endDateUTC = moment.tz(endTime, "Asia/Kolkata").utc().toDate();

  const task = await Task.create({
    title,
    description,
    endTime: endDateUTC,
    userId: req.user._id,
    approvalRequired,
    approverId: approvalRequired ? approverId : null,
  });

  res.status(StatusCodes.CREATED).json(task);
};

// GET

export const getTasks = async (req, res) => {
  const tasks = await Task.find({ userId: req.user._id }).sort({
    createdAt: -1,
  });

  if (!tasks) {
    throw new NotFoundError("No tasks found");
  }

  const nowUTC = moment().utc().toDate();

  tasks.forEach(async (task) => {
    if (task.status === "in progress" && task.endTime <= nowUTC) {
      task.status = "expired";
      await task.save();
    }
  });

  const formattedTasks = tasks.map((task) => ({
    ...task._doc,
    endTime: moment
      .utc(task.endTime)
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss"),
  }));

  res.status(StatusCodes.OK).json(formattedTasks);
};

// PATCH

export const completeTask = async (req, res) => {
  const { approverId } = req.body;

  const task = await Task.findById(req.params.id);

  if (!task) {
    throw new NotFoundError("Task not found");
  }

  if (task.approvalRequired) {
    if (!approverId) {
      throw new BadRequestError("Approval required from approriate person");
    }

    await task.approveTask(approverId);
    res.status(StatusCodes.OK).json(task);
  }

  await task.completeTask(req.user._id);

  res.status(StatusCodes.OK).json(task);
};

// Approve a Task
// PATCH

// export const approveTask = async (req, res) => {
//   const task = await Task.findById(req.params.id);

//   if (!task) {
//     throw new NotFoundError("Task not found ");
//   }
//   await task.approveTask(req.user._id);
//   res.status(StatusCodes.OK).json(task);
// };

// Delete a Task

export const deleteTask = async (req, res) => {
  const task = await Task.findOneAndDelete({ _id: req.params.id });
  // console.log(task);
  if (!task) {
    throw new NotFoundError("Task not found");
  }
  // console.log(req.user._id);
  if (task.userId.toString() !== req.user._id.toString()) {
    throw new UnAuthenticatedError("Not authorized to delete this task");
  }

  // await task.remove();

  res.status(StatusCodes.NO_CONTENT).json({ message: "Task removed" });
};

// Cron job

cron.schedule("* * * * *", async () => {
  const nowUTC = moment().utc().toDate();

  const expiredTasks = await Task.updateMany(
    { endTime: { $lte: nowUTC }, status: "in progress" },
    { status: "expired" }
  );

  const task = Task();

  if (task.status === "expired") {
    const user = await User.findById(task.userId);

    if (user.notificationSubscriptoin) {
      sendNotification(user.notificationSubscriptoin, task);
    }
  }

  console.log(`${expiredTasks.nModified} :${expiredTasks._id} tasks expired `);
});
