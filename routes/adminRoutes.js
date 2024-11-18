const express = require("express");
const router = express.Router();


// Controller Imports

// Each controller handles specific functionality for different admin features
const dashboardController = require("../controllers/dashboardController");
const allowedEmailController = require("../controllers/allowedEmailController");
const formController = require("../controllers/formController");
const imageController = require("../controllers/imageController");


// Middleware Imports

// Authentication, validation, and file upload handling
const { authenticateSession, restrictTo } = require("../middleware/authMiddleware");
const { validate, schemas } = require("../middleware/validationMiddleware");
const upload = require("../middleware/uploadMiddleware");


// Admin Dashboard Routes

// Frontend pages for admin management
router.get("/gallery-management", 
    authenticateSession,     // Verify user is logged in
    restrictTo("admin"),     // Ensure user has admin privileges
    dashboardController.getGalleryManagement
);

router.get("/allowed-emails", 
    authenticateSession,     // Verify user is logged in
    restrictTo("admin"),     // Ensure user has admin privileges
    allowedEmailController.getAllowedEmailsPage
);


// API Routes
// Backend endpoints for CRUD operations


// Gallery Image Management
// Handles updating and deleting individual gallery images
router.route('/gallery/images/:id')
    .patch(authenticateSession, restrictTo("admin"), imageController.updateImage)
    .delete(authenticateSession, restrictTo("admin"), imageController.deleteImage);

// Allowed Emails Management
// Handles CRUD operations for the allowed emails list
router.route('/allowed-emails')
    // Get all allowed emails
    .get(authenticateSession, restrictTo("admin"), allowedEmailController.getAllowedEmails)
    // Add new allowed email with role validation
    .post(
        authenticateSession, 
        restrictTo("admin"), 
        validate(schemas.allowedEmailWithRole), 
        allowedEmailController.addAllowedEmail
    );

// Individual Allowed Email Management
// Handles updating and deleting specific allowed email entries
router.route('/allowed-emails/:id')
    .patch(authenticateSession, restrictTo("admin"), allowedEmailController.updateAllowedEmail)
    .delete(authenticateSession, restrictTo("admin"), allowedEmailController.deleteAllowedEmail);

module.exports = router;