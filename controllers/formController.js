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
    const forms = await Form.find();
    res.status(200).json({
      status: "success",
      results: forms.length,
      data: { forms },
    });
  } catch (error) {
    handleError(error, next);
  }
};