const express = require("express");
const authController = require("../controllers/authController");
const { validate, schemas } = require("../middleware/validationMiddleware");
const { authenticateSession } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/login", validate(schemas.login), authController.login);
router.post("/register", validate(schemas.register), authController.register);

// Protected routes
router.use(authenticateSession);
router.post("/logout", authController.logout);
router.get("/current-user", authController.getCurrentUser);

module.exports = router;
