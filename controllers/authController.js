const User = require('../models/Users');
const AllowedEmail = require('../models/AllowedEmail');
const { AppError } = require('../middleware/errorHandler');
const bcrypt = require('bcryptjs');

exports.register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    const allowedEmail = await AllowedEmail.findOne({ email }).select('password');
    if (!allowedEmail) {
      return next(new AppError('Email not authorized for registration', 403));
    }

    const user = await User.create({ 
      email, 
      password, 
      role: allowedEmail.role,
      isAdmin: allowedEmail.role === 'admin'
    });

    // Log the user in after successful registration
    req.session.user = {
      id: user._id,
      email: user.email,
      role: user.role,
      isAdmin: user.isAdmin
    };

    res.status(201).json({
      status: 'success',
      data: { user: { id: user._id, email: user.email, role: user.role, isAdmin: user.isAdmin } }
    });
  } catch (error) {
    if (error.code === 11000) {
      return next(new AppError('Email already in use', 400));
    }
    next(error);
  }
};

exports.login = async (req, res, next) => {

  const { email, password } = req.body; 


    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return next(new AppError('Incorrect email or password', 401));
    }
    const isPasswordCorrect = await user.correctPassword(password, user.password);
    console.log('password is correct');

    if (!isPasswordCorrect) {
      return next(new AppError('Incorrect password', 401));
  }

  req.session.user = {
    id: user._id,
    email: user.email,
    role: user.role,
    isAdmin: user.isAdmin
  };

  res.redirect('/auth/dashboard');   
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res.status(500).json({ status: 'error', message: 'Could not log out, please try again' });
    }
    res.clearCookie('connect.sid');
    res.status(200).json({ status: 'success', message: 'Logged out successfully' });
  });
};

exports.getCurrentUser = (req, res) => {
  if (req.session && req.session.user) {
    res.status(200).json({
      status: 'success',
      data: { user: req.session.user }
    });
  } else {
    res.status(401).json({
      status: 'fail',
      message: 'Not authenticated'
    });
  }
};

exports.updatePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.session.user.id).select('+password');
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    if (!(await user.correctPassword(req.body.currentPassword, user.password))) {
      return next(new AppError('Current password is incorrect', 401));
    }

    user.password = req.body.newPassword;
    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'Password updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return next(new AppError('There is no user with this email address', 404));
    }

    // Generate a password reset token (you might want to implement this in your User model)
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // Here you would typically send an email with the reset token
    // For this example, we'll just send it in the response
    res.status(200).json({
      status: 'success',
      message: 'Token sent to email',
      resetToken
    });
  } catch (error) {
    next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    // Find user by reset token (you'll need to implement this logic)
    const user = await User.findOne({
      passwordResetToken: req.params.token,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      return next(new AppError('Token is invalid or has expired', 400));
    }

    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'Password reset successfully'
    });
  } catch (error) {
    next(error);
  }
};

exports.addAllowedEmail = async (req, res, next) => {
  try {
    const { email, role } = req.body;
    const allowedEmail = await AllowedEmail.create({ email, role });
    res.status(201).json({
      status: 'success',
      data: { allowedEmail }
    });
  } catch (error) {
    if (error.code === 11000) {
      return next(new AppError('Email already allowed', 400));
    }
    next(error);
  }
};

exports.getAllowedEmails = async (req, res, next) => {
  try {
    const allowedEmails = await AllowedEmail.find();
    res.status(200).json({
      status: 'success',
      data: { allowedEmails }
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteAllowedEmail = async (req, res, next) => {
  try {
    const allowedEmail = await AllowedEmail.findByIdAndDelete(req.params.id);
    if (!allowedEmail) {
      return next(new AppError('No allowed email found with that ID', 404));
    }
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    next(error);
  }
};


exports.getMessages = async (req, res, next) => {
  try {
    const messages = await Form.find().sort({ createdAt: -1 });
    res.status(200).json({
      status: 'success',
      data: { messages }
    });
  } catch (error) {
    next(new AppError('Error fetching messages', 500));
  }
};

exports.deleteMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      return next(new AppError('Message ID is required', 400));
    }

    const deletedMessage = await Form.findByIdAndDelete(id);
    if (!deletedMessage) {
      return next(new AppError('Message not found', 404));
    }

    res.status(200).json({
      status: 'success',
      message: 'Message deleted successfully'
    });
  } catch (error) {
    next(new AppError('Error deleting message', 500));
  }
};

exports.deleteAllMessages = async (req, res, next) => {
  try {
    await Form.deleteMany({});
    res.status(200).json({
      status: 'success',
      message: 'All messages deleted successfully'
    });
  } catch (error) {
    next(new AppError('Error deleting all messages', 500));
  }
};


