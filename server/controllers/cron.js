import User from "../models/User.js";
import { StatusCodes } from "http-status-codes";
import webpush from "web-push";

export const pushMessage = (req, res) => {
  const { subscription } = req.body;

  User.findByIdAndUpdate(req.user._id, {
    notificationSubscription: subscription,
  });

  res.status(StatusCodes.CREATED).json({ message: "Subscription saved !" });
};

export const sendNotification = async (subscription, task) => {
  const payload = JSON.stringify({
    title: "Task Expired",
    body: task,
  });

  try {
    await webpush.sendNotification(subscription, payload);
  } catch (err) {
    console.log("Error sending notification", err);
  }
};

// export const sendApprovalNotification =async()=> {

// }
