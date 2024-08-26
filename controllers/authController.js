const User = require("../models/Users");
const AllowedEmail = require("../models/AllowedEmail");
const { AppError } = require("../middleware/errorHandler");
const bcrypt = require("bcryptjs");

const createUserResponse = (user) => ({
  status: 'success',
  data: {
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
      isAdmin: user.isAdmin,
    },
  },
});

exports.register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const allowedEmail = await AllowedEmail.findOne({ email });
    if (!allowedEmail) {
      return next(new AppError('Email not authorized for registration', 403));
    }
    const user = await User.create({ 
      email, 
      password, 
      role: allowedEmail.role,
      isAdmin: allowedEmail.role === 'admin'
    });
    res.status(201).json(createUserResponse(user));
  } catch (error) {
    if (error.code === 11000) {
      return next(new AppError('Email already in use', 400));
    }
    next(new AppError(error.message, 500));
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      console.log("❌ Login failed: Email or password missing");
      return next(new AppError("Please provide email and password", 400));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await bcrypt.compare(password, user.password))) {
      console.log(`❌ Login failed: Incorrect credentials (${email})`);
      return next(new AppError("Incorrect email or password", 401));
    }

    req.session.user = {
      id: user._id,
      email: user.email,
      role: user.role,
      isAdmin: user.isAdmin,
    };

    console.log(`✅ Login successful: ${email} (${user.role}, Admin: ${user.isAdmin})`);
    res.status(200).json(createUserResponse(user));
  } catch (error) {
    console.error("❌ Login error:", error.message);
    next(new AppError(error.message, 500));
  }
};

exports.logout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      return next(new AppError("Could not log out, please try again", 500));
    }
    res.clearCookie("connect.sid");
    res
      .status(200)
      .json({ status: "success", message: "Logged out successfully" });
  });
};

exports.getCurrentUser = (req, res, next) => {
  if (req.session && req.session.user) {
    res.status(200).json({
      status: "success",
      data: {
        user: req.session.user,
      },
    });
  } else {
    next(new AppError("Not authenticated", 401));
  }
};

exports.protect = (req, res, next) => {
  if (req.session && req.session.user) {
    next();
  } else {
    next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.session.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }
    next();
  };
};

module.exports = exports;