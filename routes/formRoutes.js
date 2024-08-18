const express = require("express");
const { submitForm } = require("../controllers/formController");
const {
  validateForm,
  formSchemas,
} = require("../middleware/formValidationMiddleware");

const router = express.Router();

// Public route for submitting a form
router.post("/", validateForm(formSchemas.submitForm), submitForm);

module.exports = router;
