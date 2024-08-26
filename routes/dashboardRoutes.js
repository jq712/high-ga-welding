const express = require("express");
const {
  authenticateSession,
  restrictTo,
} = require("../middleware/authMiddleware");
const { validate, schemas } = require("../middleware/validationMiddleware");
const dashboardController = require("../controllers/dashboardController");

const router = express.Router();

router.use(authenticateSession);

// Messages routes
router.get("/messages", dashboardController.getMessages);
router.delete("/messages/:id", restrictTo("admin"), dashboardController.deleteMessage);
router.delete("/messages", restrictTo("admin"), dashboardController.deleteAllMessages);

// Allowed emails routes
router.get("/allowed-emails", dashboardController.getAllowedEmails);
router.post("/allowed-emails", restrictTo("admin"), validate(schemas.allowedEmail), dashboardController.addAllowedEmail);
router.delete("/allowed-emails/:id", restrictTo("admin"), dashboardController.deleteAllowedEmail);

module.exports = router;