const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { authenticateSession, restrictTo } = require("../middleware/authMiddleware");
const { validate, schemas } = require("../middleware/validationMiddleware");

// Public API routes
router.get("/current-user", authController.getCurrentUser);

// Protected API routes
router.use(authenticateSession);

router.get("/messages", authController.getMessages);
router.delete("/messages", restrictTo("admin"), authController.deleteAllMessages);
router.delete("/messages/:id", restrictTo("admin"), authController.deleteMessage);

router.get("/allowed-emails", restrictTo("admin"), authController.getAllowedEmails);
router.post("/allowed-emails", restrictTo("admin"), validate(schemas.allowedEmailWithRole), authController.addAllowedEmail);
router.delete("/allowed-emails/:id", restrictTo("admin"), authController.deleteAllowedEmail);

module.exports = router;