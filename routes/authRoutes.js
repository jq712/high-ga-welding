// Controller Imports
const express = require("express");
const router = express.Router();

// Controllers handle the business logic for each route
const dashboardController = require("../controllers/dashboardController");
const formController = require("../controllers/formController");

// Middleware Imports

// Authentication and session handling
const { authenticateSession } = require("../middleware/authMiddleware");

// Dashboard Routes

// Frontend pages for authenticated users
router.get("/", 
    authenticateSession,     // Verify user is logged in
    dashboardController.getDashboard
);

router.get("/forms", 
    authenticateSession,     // Verify user is logged in
    formController.getForms
);

module.exports = router;