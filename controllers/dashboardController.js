const { AppError } = require("../middleware/errorHandler");
const AllowedEmail = require("../models/AllowedEmail");
const Form = require("../models/Form");

exports.addAllowedEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    const allowedEmail = await AllowedEmail.create({
      email,
      addedBy: req.session.user.id,
    });
    res.status(201).json({
      status: "success",
      data: { allowedEmail },
    });
  } catch (error) {
    if (error.code === 11000) {
      return next(new AppError("Email already allowed", 400));
    }
    next(new AppError(error.message, 500));
  }
};

exports.getAllowedEmails = async (req, res, next) => {
  try {
    const allowedEmails = await AllowedEmail.find();
    res.status(200).json({
      status: "success",
      data: { allowedEmails },
    });
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};

exports.deleteAllowedEmail = async (req, res, next) => {
  try {
    const allowedEmail = await AllowedEmail.findByIdAndDelete(req.params.id);
    if (!allowedEmail) {
      return next(new AppError("Allowed email not found", 404));
    }
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};

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
