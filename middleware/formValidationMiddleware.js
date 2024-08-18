const Joi = require("joi");
const { AppError } = require("./errorHandler");

const validateForm = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const errorMessage = error.details
      .map((detail) => detail.message)
      .join(", ");
    return next(new AppError(`Form validation error: ${errorMessage}`, 400));
  }
  next();
};

const formSchemas = {
  submitForm: Joi.object({
    name: Joi.string().required().messages({
      "string.empty": "Name is required",
      "any.required": "Name is required",
    }),
    email: Joi.string().email().required().messages({
      "string.email": "Must be a valid email",
      "string.empty": "Email is required",
      "any.required": "Email is required",
    }),
    phone: Joi.string().required().messages({
      "string.empty": "Phone is required",
      "any.required": "Phone is required",
    }),
    message: Joi.string().required().messages({
      "string.empty": "Message is required",
      "any.required": "Message is required",
    }),
  }),
};

module.exports = { validateForm, formSchemas };
