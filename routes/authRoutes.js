const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const path = require('path');
const { authenticateSession, restrictTo } = require("../middleware/authMiddleware");
const { validate, schemas } = require("../middleware/validationMiddleware");

router.post("/register", validate(schemas.register), authController.register);
router.post("/login", validate(schemas.login), authController.login);
router.post("/logout", authenticateSession, authController.logout);

router.get("/dashboard", authenticateSession, (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "dashboard.html"));
});

router.get("/allowed-emails", authenticateSession, restrictTo("admin"), (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "allowed-emails.html"));
});

module.exports = router;