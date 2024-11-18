const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const formController = require("../controllers/formController");
const allowedEmailController = require("../controllers/allowedEmailController");
const { authenticateSession, restrictTo } = require("../middleware/authMiddleware");
const { validate, schemas } = require("../middleware/validationMiddleware");
const { formSchemas } = require('../middleware/formValidationMiddleware');
const imageController = require('../controllers/imageController');
const upload = require('../middleware/uploadMiddleware');

// Create a separate router for public routes
const publicRouter = express.Router();

// Public API routes
publicRouter.post("/auth/register", validate(schemas.register), authController.register);
publicRouter.post("/submit-form", validate(formSchemas.submitForm), formController.submitForm);
publicRouter.get("/current-user", authController.getCurrentUser);

// Mount public routes at the root level
router.use(publicRouter);

// Protected API routes - everything after this middleware requires authentication
router.use(authenticateSession);

// Protected routes go here
router.get("/dashboard/forms", formController.getForms);
router.delete("/dashboard/forms", restrictTo("admin"), formController.deleteAllForms);
router.delete("/dashboard/forms/:id", restrictTo("admin"), formController.deleteForm);

// Allowed email routes
router.get("/allowed-emails", restrictTo("admin"), allowedEmailController.getAllowedEmails);
router.post("/allowed-emails", restrictTo("admin"), validate(schemas.allowedEmailWithRole), allowedEmailController.addAllowedEmail);
router.patch("/allowed-emails/:id", restrictTo("admin"), allowedEmailController.updateAllowedEmail);
router.delete("/allowed-emails/:id", restrictTo("admin"), allowedEmailController.deleteAllowedEmail);

// Gallery routes
router.post("/gallery/images", 
    restrictTo("admin"),
    upload.single('image'),
    imageController.createImage
);

router.route('/gallery/images/:id')
    .patch(restrictTo("admin"), imageController.updateImage)
    .delete(restrictTo("admin"), imageController.deleteImage);

module.exports = router;