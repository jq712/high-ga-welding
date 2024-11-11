const express = require("express");
const router = express.Router();


// Serve static pages
const pages = ["index", "about", "contact", "certifications", "login", "register", "gallery"];

router.get("/", (req, res) => {
  res.redirect("/index");
});

// Render EJS pages
pages.forEach(page => {
  router.get(`/${page}`, (req, res) => {
    res.render(page, { currentPage: page });
  });
});

module.exports = router;