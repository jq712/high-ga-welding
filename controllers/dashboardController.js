const { AppError } = require("../middleware/errorHandler");
const AllowedEmail = require("../models/AllowedEmail");
const Form = require("../models/Form");
const User = require("../models/Users");

// Helper function to handle errors
const handleError = (error, next, customMessage = null) => {
  console.error('Error:', error);
  if (error.code === 11000) {
    return next(new AppError(customMessage || 'Duplicate entry', 400));
  }
  next(new AppError(error.message, 500));
};

// Helper function to delete associated user
const deleteAssociatedUser = async (email) => {
  try {
    const deletedUser = await User.findOneAndDelete({ email });
    if (deletedUser) {
      console.log(`Associated user with email ${email} has been deleted.`);
    }
  } catch (error) {
    console.error(`Error deleting associated user: ${error.message}`);
  }
};

exports.addAllowedEmail = async (req, res, next) => {
  console.log("Received request to add allowed email:", req.body);
  try {
    const { email, role } = req.body;
    
    const allowedEmail = await AllowedEmail.create({ email, role });
    res.status(201).json({ status: 'success', data: { allowedEmail } });
  } catch (error) {
    console.error("Error in addAllowedEmail:", error);
    if (error.code === 11000) {
      return res.status(400).json({ status: 'error', message: 'Email already exists' });
    }
    res.status(500).json({ status: 'error', message: 'Server error', error: error.message });
  }
};

exports.getAllowedEmails = async (req, res, next) => {
  try {
    const allowedEmails = await AllowedEmail.find().select('email role addedAt');
    res.status(200).json({ status: "success", data: { allowedEmails } });
  } catch (error) {
    handleError(error, next);
  }
};

exports.deleteAllowedEmail = async (req, res, next) => {
  try {
    const allowedEmail = await AllowedEmail.findById(req.params.id);
    if (!allowedEmail) {
      return next(new AppError("Allowed email not found", 404));
    }

    await deleteAssociatedUser(allowedEmail.email);
    await AllowedEmail.findByIdAndDelete(req.params.id);

    res.status(200).json({ status: "success", message: "Allowed email deleted successfully" });
  } catch (error) {
    handleError(error, next);
  }
};

exports.getMessages = async (req, res, next) => {
  try {
    const messages = await Form.find().sort({ createdAt: -1 });
    res.status(200).json({ status: "success", data: { messages } });
  } catch (error) {
    handleError(error, next);
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Received delete request for message ID: ${id}`);

    if (!id || id === 'undefined') {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid message ID provided'
      });
    }

    const deletedMessage = await Form.findByIdAndDelete(id);

    if (!deletedMessage) {
      return res.status(404).json({
        status: 'error',
        message: 'Message not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    console.error('Error in deleteMessage:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

exports.deleteAllMessages = async (req, res, next) => {
  try {
    await Form.deleteMany();
    res.status(200).json({ status: "success", message: "All messages deleted successfully" });
  } catch (error) {
    handleError(error, next);
  }
};