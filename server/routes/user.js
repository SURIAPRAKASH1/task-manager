import express from "express";
import {
  getUser,
  getUserFriends,
  addRemoveFriend,
  getAllusers,
} from "../controllers/user.js";

const router = express.Router();

router.route("/:id").get(getUser);

router.route("/").get(getAllusers);

router.route("/:id/friends").get(getUserFriends);

router.route("/:id/:friendId").patch(addRemoveFriend);

export default router;
