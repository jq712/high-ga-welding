const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const path = require('path');
const { authenticateSession, restrictTo } = require("../middleware/authMiddleware");
const { validate, schemas } = require("../middleware/validationMiddleware");
const Image = require("../models/Image");
const dashboardController = require("../controllers/dashboardController");

router.post("/login", validate(schemas.login), authController.login);
router.post("/logout", authenticateSession, authController.logout);

router.get("/dashboard", authenticateSession, dashboardController.getDashboard);

router.get("/allowed-emails", authenticateSession, restrictTo("admin"), (req, res) => {
  res.render('allowed-emails', {
    user: req.session.user
  });
});

router.get("/gallery-management", authenticateSession, restrictTo("admin"), dashboardController.getGalleryManagement); 

module.exports = router;