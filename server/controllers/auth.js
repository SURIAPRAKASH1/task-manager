import User from "../models/User.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, UnAuthenticatedError } from "../errors/index.js";

export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, picturePath, friends } =
      req.body;

    const user = new User({
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
    });

    const savedUser = await user.save();

    res.status(StatusCodes.CREATED).json(savedUser);
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: err,
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new UnAuthenticatedError("Please provide email and password");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new UnAuthenticatedError("Invalid email");
  }

  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new UnAuthenticatedError("Invalid Password");
  }

  const token = user.createJWT();

  res.status(StatusCodes.OK).json({ token, user });
};
