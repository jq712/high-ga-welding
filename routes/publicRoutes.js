const express = require("express");
const router = express.Router();
const path = require("path");
const { submitForm } = require("../controllers/formController");
const { validate } = require("../middleware/validationMiddleware");
const formSchemas = require('../models/Form');

// Serve static pages
const pages = ["index", "about", "contact", "certifications", "login", "register"];

router.get("/", (req, res) => {
  res.redirect("/index");
});

pages.forEach((page) => {
  router.get(`/${page}`, (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", `${page}.html`));
  });
});

// Handle form submission
router.post("/submit-form", validate(formSchemas.form), submitForm);

module.exports = router;