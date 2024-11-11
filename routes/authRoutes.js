const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const path = require('path');
const { authenticateSession, restrictTo } = require("../middleware/authMiddleware");
const { validate, schemas } = require("../middleware/validationMiddleware");

router.post("/login", validate(schemas.login), authController.login);
router.post("/logout", authenticateSession, authController.logout);

router.get("/dashboard", authenticateSession, (req, res) => {
  res.render('dashboard', {
    user: req.session.user
  });
});

router.get("/allowed-emails", authenticateSession, restrictTo("admin"), (req, res) => {
  res.render('allowed-emails', {
    user: req.session.user
  });
});

module.exports = router;