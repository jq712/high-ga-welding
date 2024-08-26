const { AppError } = require("./errorHandler");

exports.authenticateSession = (req, res, next) => {
  console.log("Session:", JSON.stringify(req.session, null, 2));
  console.log(
    "User:",
    req.session ? JSON.stringify(req.session.user, null, 2) : "No session"
  );
  if (req.session && req.session.user) {
    console.log("User authenticated");
    next();
  } else {
    console.log("User not authenticated, redirecting to login");
    res.redirect("/login");
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