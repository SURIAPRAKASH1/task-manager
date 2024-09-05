import { StatusCodes } from "http-status-codes";
import CustomAPIError from "./custom_error.js";

class BadRequestError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statuscode = StatusCodes.BAD_REQUEST;
  }
}

export default BadRequestError;
