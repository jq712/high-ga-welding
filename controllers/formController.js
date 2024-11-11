const Form = require("../models/Form");
const { AppError } = require("../middleware/errorHandler");

// Helper function to handle errors
const handleError = (error, next, statusCode = 500) => {
  console.error('Error:', error);
  next(new AppError(error.message, statusCode));
};

exports.submitForm = async (req, res, next) => {
  try {
    const { name, email, phone, message } = req.body;
    const form = await Form.create({ name, email, phone, message });

    res.status(201).json({
      status: "success",
      message: "Form submitted successfully!",
      data: { form: { name, email, phone, message } },
    });
  } catch (error) {
    handleError(error, next, 400);
  }
};

exports.getForms = async (req, res, next) => {
  try {
    const forms = await Form.find().sort({ submittedAt: -1 });
    res.status(200).json({
      status: "success",
      data: { forms },
    });
  } catch (error) {
    handleError(error, next);
  }
};

exports.deleteForm = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      return next(new AppError('Form ID is required', 400));
    }

    const deletedForm = await Form.findByIdAndDelete(id);
    if (!deletedForm) {
      return next(new AppError('Form not found', 404));
    }

    res.status(200).json({
      status: 'success',
      message: 'Form deleted successfully'
    });
  } catch (error) {
    handleError(error, next);
  }
};

exports.deleteAllForms = async (req, res, next) => {
  try {
    await Form.deleteMany({});
    res.status(200).json({
      status: 'success',
      message: 'All forms deleted successfully'
    });
  } catch (error) {
    handleError(error, next);
  }
};