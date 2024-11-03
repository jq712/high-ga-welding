const { AppError } = require('./errorHandler');
const User = require('../models/Users');

exports.authenticateSession = async (req, res, next) => {
  if (req.session && req.session.user) {
    try {
      const user = await User.findById(req.session.user.id);
      if (!user) {
        // User no longer exists or has been deactivated
        return next(new AppError('User no longer exists', 401));
      }
      // Refresh user info in the session
      req.session.user = {
        id: user._id,
        email: user.email,
        role: user.role,
        isAdmin: user.isAdmin
      };
      next();
    } catch (error) {
      return next(new AppError('Authentication error', 500));
    }
  } else {
    next(new AppError('Not authenticated', 401));
  }
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.session || !req.session.user) {
      return next(new AppError('User session is missing', 401));
    }
    if (!roles.includes(req.session.user.role) && !req.session.user.isAdmin) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }
    next();
  };
};

exports.ensureAuth = (req, res, next) => {
  if (req.session && req.session.user) {
    res.redirect('/auth/dashboard');
  } else {
    next();
  }
};

exports.ensureGuest = (req, res, next) => {
  if (req.session && req.session.user) {
    res.redirect('/auth/dashboard');
  } else {
    next();
  }
};

exports.isLoggedIn = (req, res, next) => {
  if (req.session && req.session.user) {
    res.locals.user = req.session.user;
  }
  next();
};

exports.checkPasswordChanged = async (req, res, next) => {
  if (req.session && req.session.user) {
    const user = await User.findById(req.session.user.id);
    if (user && user.passwordChangedAfter(req.session.iat)) {
      // Log out the user if password was changed after the token was issued
      return res.status(401).json({
        status: 'fail',
        message: 'Password recently changed. Please log in again.'
      });
    }
  }
  next();
};

exports.requirePasswordChange = async (req, res, next) => {
  if (req.session && req.session.user) {
    const user = await User.findById(req.session.user.id);
    if (user && user.passwordChangeRequired) {
      return res.status(403).json({
        status: 'fail',
        message: 'Password change required. Please update your password.'
      });
    }
  }
  next();
};