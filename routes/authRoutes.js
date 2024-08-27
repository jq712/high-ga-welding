const express = require("express");
const authController = require("../controllers/authController");
const dashboardController = require("../controllers/dashboardController");
const { validate, schemas } = require("../middleware/validationMiddleware");
const { authenticateSession } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/login", validate(schemas.login), authController.login);
router.post("/register", validate(schemas.register), authController.register);

// Protected routes
router.use(authenticateSession);
router.post("/logout", authController.logout);
router.get("/current-user", authController.getCurrentUser);
router.post("/add-allowed-email", dashboardController.addAllowedEmail);

router.get("/allowed-emails", dashboardController.getAllowedEmails);
router.post("/allowed-emails", dashboardController.addAllowedEmail);

module.exports = router;
