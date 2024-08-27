const Joi = require("joi");
const { AppError } = require("./errorHandler");

const validate = (schema) => {
  return (req, res, next) => {
    console.log('Validating request body:', req.body);
    const { error } = schema.validate(req.body);
    if (error) {
      console.log('Validation error:', error);
      return res.status(400).json({
        status: 'fail',
        message: error.details[0].message,
        error: error.details[0]
      });
    }
    console.log('Validation passed');
    next();
  };
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
  addAllowedEmail: Joi.object({
    email: Joi.string().email().required(),
    role: Joi.string().valid('user', 'admin').required()
  }),
};

module.exports = { validate, schemas };