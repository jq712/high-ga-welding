const Joi = require("joi");
const { AppError } = require("./errorHandler");

const validate = (schema) => (req, res, next) => {
  if (!schema) {
    return next(new AppError("Validation schema is not defined", 500));
  }
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const errorMessage = error.details
      .map((detail) => detail.message)
      .join(", ");
    return next(new AppError(errorMessage, 400));
  }
  next();
};

const passwordSchema = Joi.string()
  .min(8)
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
  .required()
  .messages({
    "string.pattern.base":
      "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character",
    "string.min": "Password must be at least 8 characters long",
    "string.empty": "Password is required",
    "any.required": "Password is required",
  });

const schemas = {
  register: Joi.object({
    email: Joi.string().email().required(),
    password: passwordSchema,
  }),
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
  allowedEmail: Joi.object({
    email: Joi.string().email().required(),
  }),
  allowedEmailWithRole: Joi.object({
    email: Joi.string().email().required(),
    role: Joi.string().valid('user', 'admin').required(),
  }),
};

module.exports = { validate, schemas };