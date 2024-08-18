const Form = require("../models/Form");
const { AppError } = require("../middleware/errorHandler");

exports.submitForm = async (req, res, next) => {
  try {
    const { name, email, phone, message } = req.body;

    const form = await Form.create({ name, email, phone, message });

    res.status(201).json({
      status: "success",
      message: "Form submitted successfully!",
      data: {
        form: {
          name: form.name,
          email: form.email,
          phone: form.phone,
          message: form.message,
        },
      },
    });
  } catch (error) {
    next(new AppError(error.message, 400));
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
    next(new AppError(error.message, 500));
  }
};
