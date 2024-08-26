const { AppError } = require("../middleware/errorHandler");
const AllowedEmail = require("../models/AllowedEmail");
const Form = require("../models/Form");
const User = require("../models/Users"); 

exports.addAllowedEmail = async (req, res, next) => {
  try {
    const { email, role } = req.body;
    const allowedEmail = await AllowedEmail.create({ email, role });
    res.status(201).json({
      status: 'success',
      data: { allowedEmail },
    });
  } catch (error) {
    if (error.code === 11000) {
      return next(new AppError('Email already allowed', 400));
    }
    next(new AppError(error.message, 500));
  }
};

exports.getAllowedEmails = async (req, res, next) => {
  try {
    const allowedEmails = await AllowedEmail.find().select('email role addedAt');
    console.log('Retrieved allowed emails:', allowedEmails); // Keep this for debugging
    res.status(200).json({
      status: "success",
      data: { allowedEmails },
    });
  } catch (error) {
    console.error('Error retrieving allowed emails:', error);
    next(new AppError(error.message, 500));
  }
};

exports.deleteAllowedEmail = async (req, res, next) => {
  try {
    const allowedEmail = await AllowedEmail.findById(req.params.id);
    if (!allowedEmail) {
      return next(new AppError("Allowed email not found", 404));
    }

    // Delete the associated user if exists
    await deleteAssociatedUser(allowedEmail.email);

    // Delete the allowed email
    await AllowedEmail.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};

// Helper function to delete associated user
async function deleteAssociatedUser(email) {
  try {
    const deletedUser = await User.findOneAndDelete({ email });
    if (deletedUser) {
      console.log(`Associated user with email ${email} has been deleted.`);
    }
  } catch (error) {
    console.error(`Error deleting associated user: ${error.message}`);
  }
}

exports.getMessages = async (req, res, next) => {
  try {
    const messages = await Form.find();
    res.status(200).json({
      status: "success",
      data: { messages },
    });
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};

exports.deleteMessage = async (req, res, next) => {
  try {
    const message = await Form.findByIdAndDelete(req.params.id);
    if (!message) {
      return next(new AppError("Message not found", 404));
    }
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};

exports.deleteAllMessages = async (req, res, next) => {
  try {
    await Form.deleteMany();
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};