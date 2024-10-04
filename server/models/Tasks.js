import mongoose from "mongoose";
import { UnAuthenticatedError, BadRequestError } from "../errors/index.js";

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "title must be provided !"],
      minlength: 2,
      maxlength: 50,
    },
    description: {
      type: String,
      required: [true, "description must be given !"],
      minlength: 5,
      maxlength: 500,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    endTime: {
      type: Date,
      required: true,
      default: function () {
        return new Date(Date.now() + 24 * 60 * 60 * 1000);
      },
    },
    user: {
      firstName: {
        type: String,
        default: "user firstName",
      },
      lastName: {
        type: String,
        default: "user lastName",
      },
      picturePath: {
        type: String,
        default: "",
      },
    },
    status: {
      type: String,
      enum: ["in progress", "completed", "expired"],
      default: "in progress",
    },
    approvalRequired: {
      type: Boolean,
      default: false,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    approverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    notificationSent: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// middlware to check task expiration

TaskSchema.pre("save", function (next) {
  const currentTime = new Date();
  if (currentTime >= this.endTime) {
    this.status = "expired";
  }

  next();
});

// method to mark task as completed

TaskSchema.methods.completeTask = function (userId) {
  if (this.approvalRequired) {
    throw new UnAuthenticatedError(
      "Approval is required to complete this task"
    );
  }

  if (this.endTime <= new Date()) {
    throw new BadRequestError("Cannot complete an expired task");
  }

  this.status = "completed";
  return this.save();
};

// method to approve task completion

TaskSchema.methods.approveTask = function (approverId) {
  if (!this.approvalRequired) {
    throw new BadRequestError("this task does not require approval");
  }
  if (this.endTime <= new Date()) {
    throw new BadRequestError("Cannot approve an expired task");
  }
  if (this.approverId.toString() !== approverId.toString()) {
    throw new UnAuthenticatedError(
      "You are not authorized to approve this task"
    );
  }
  this.approvedBy = approverId;
  this.status = "completed";
  return this.save();
};

const Task = mongoose.model("Task", TaskSchema);

export default Task;
