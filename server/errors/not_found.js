import { StatusCodes } from "http-status-codes";
import CustomAPIError from "./custom_error.js";

class NotFoundError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statuscode = StatusCodes.NOT_FOUND;
  }
}

export default NotFoundError;
