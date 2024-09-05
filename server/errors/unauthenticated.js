import { StatusCodes } from "http-status-codes";
import CustomAPIError from "./custom_error.js";

class UnAuthenticatedError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statuscode = StatusCodes.UNAUTHORIZED;
  }
}

export default UnAuthenticatedError;
