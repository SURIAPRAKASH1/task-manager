import User from "../models/User.js";
import { StatusCodes } from "http-status-codes";
import webpush from "web-push";

export const pushMessage = async (req, res) => {
  try {
    const { subscription } = req.body;

    await User.findByIdAndUpdate(req.user._id, {
      notificationSubscription: subscription,
    });

    res.status(StatusCodes.CREATED).json({ message: "Subscription saved !" });
  } catch (error) {
    res.status(404).json(error);
  }
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
