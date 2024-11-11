const express = require("express");
const router = express.Router();
const path = require("path");
const { submitForm } = require("../controllers/formController");
const { validate } = require("../middleware/validationMiddleware");
const { formSchemas } = require('../middleware/formValidationMiddleware');

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

module.exports = router;