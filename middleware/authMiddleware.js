const { AppError } = require("./errorHandler");

exports.authenticateSession = (req, res, next) => {
  if (req.session && req.session.user) {
    next();
  } else {
    next(new AppError("You are not logged in", 401));
  }
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.session || !req.session.user) {
      return next(new AppError("User session is missing", 401));
    }
    if (!roles.includes(req.session.user.role) && !req.session.user.isAdmin) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }
    next();
  };
};
