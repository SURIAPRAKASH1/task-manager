import User from "../models/User.js";
import { BadRequestError, NotFoundError } from "../errors/index.js";
import { StatusCodes } from "http-status-codes";

export const getUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);

  if (!user) {
    throw new NotFoundError("can't found user");
  }

  res.status(StatusCodes.OK).json(user);
};

export const getUserFriends = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);

  if (!user) {
    throw new NotFoundError("No user found");
  }

  const friends = await Promise.all(
    user.friends.map((id) => User.findById(id))
  );

  const formattedFriends = friends.map(
    ({ _id, firstName, lastName, picturePath }) => {
      return {
        _id,
        firstName,
        lastName,
        picturePath,
      };
    }
  );

  res.status(StatusCodes.OK).json(formattedFriends);
};

export const addRemoveFriend = async (req, res) => {
  const { id, friendId } = req.params;

  if (id === friendId) {
    throw new BadRequestError("You can't add/ remove yourself");
  }

  const user = await User.findById(id);
  const friend = await User.findById(friendId);

  if (!user || !friend) {
    throw new NotFoundError("User or Friend not found");
  }

  if (user.friends.includes(friendId)) {
    user.friends = user.friends.filter((id) => id !== friendId);
    friend.friends = friend.friends.filter((friendid) => friendid !== id);
  } else {
    user.friends.push(friendId);
    friend.friends.push(id);
  }

  await user.save();
  await friend.save();

  const friends = await Promise.all(
    user.friends.map((id) => User.findById(id))
  );

  const formattedFriends = friends.map(
    ({ _id, firstName, lastName, picturePath }) => {
      return {
        _id,
        firstName,
        lastName,
        picturePath,
      };
    }
  );

  res.status(StatusCodes.OK).json(formattedFriends);
};

export const getAllusers = async (req, res) => {
  try {
    const users = await User.find({}).select(
      "-password -email -notificationSubscription"
    );

    if (!users) {
      throw new NotFoundError("Got error while finding plateform users!");
    }

    res.status(StatusCodes.OK).json(users);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ msg: error });
  }
};
