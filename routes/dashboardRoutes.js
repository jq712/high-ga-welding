const express = require("express");
const router = express.Router();

// Controller imports
const dashboardController = require("../controllers/dashboardController");
const formController = require("../controllers/formController");

// Middleware imports
const { authenticateSession } = require("../middleware/authMiddleware");

// Dashboard routes
router.get("/", authenticateSession, dashboardController.getDashboard);

// Form routes
router.route('/forms')
    .get(authenticateSession, formController.getForms)
    .delete(authenticateSession, formController.deleteAllForms);

router.delete('/forms/:id', authenticateSession, formController.deleteForm);

module.exports = router;