import jwt from "jsonwebtoken";
import { UnAuthenticatedError } from "../errors/index.js";
import User from "../models/User.js";

const tokenVerify = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnAuthenticatedError("Authentication invalid");
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(payload.userId).select("-password");

    next();
  } catch (err) {
    throw new UnAuthenticatedError("Authentication invalid");
  }
};

export default tokenVerify;
