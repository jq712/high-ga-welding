class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

const errorHandler = (err, req, res, next) => {
  if (process.env.NODE_ENV !== "test") {
    console.error("Error caught in errorHandler:", err);
  }

  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  // Handle specific types of errors
  if (err.name === "ValidationError") {
    err.statusCode = 400;
    err.status = "fail";
  }

  if (err.code === 11000) {
    err.statusCode = 400;
    err.status = "fail";
    err.message = "Duplicate field value entered";
  }

  if (err.name === "JsonWebTokenError") {
    err.statusCode = 401;
    err.status = "fail";
    err.message = "Invalid token. Please log in again!";
  }

  if (err.name === "TokenExpiredError") {
    err.statusCode = 401;
    err.status = "fail";
    err.message = "Your token has expired! Please log in again.";
  }

  const errorResponse = {
    status: err.status,
    message: err.message,
  };

  if (process.env.NODE_ENV === "development") {
    errorResponse.error = err;
    errorResponse.stack = err.stack;
  } else if (!err.isOperational) {
    errorResponse.message = "Something went very wrong!";
    console.error("ERROR 💥", err);
  }

  res.status(err.statusCode).json(errorResponse);
};

module.exports = { AppError, errorHandler };
