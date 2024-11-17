const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const formController = require("../controllers/formController");
const allowedEmailController = require("../controllers/allowedEmailController");
const { authenticateSession, restrictTo } = require("../middleware/authMiddleware");
const { validate, schemas } = require("../middleware/validationMiddleware");
const { formSchemas } = require('../middleware/formValidationMiddleware');
const imageController = require('../controllers/imageController');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
});
const upload = multer({ storage: storage });

// Create a separate router for public routes
const publicRouter = express.Router();

// Public API routes
publicRouter.post("/auth/register", validate(schemas.register), authController.register);
publicRouter.post("/submit-form", validate(formSchemas.submitForm), formController.submitForm);
publicRouter.get("/current-user", authController.getCurrentUser);
publicRouter.get("/gallery/images", imageController.getAllImages);

// Mount public routes at the root level
router.use(publicRouter);

// Protected API routes - everything after this middleware requires authentication
router.use(authenticateSession);

// Protected routes go here
router.get("/dashboard/forms", authenticateSession, formController.getForms);
router.delete("/dashboard/forms", restrictTo("admin"), formController.deleteAllForms);
router.delete("/dashboard/forms/:id", restrictTo("admin"), formController.deleteForm);

// Allowed email routes
router.get("/allowed-emails", restrictTo("admin"), allowedEmailController.getAllowedEmails);
router.post("/allowed-emails", restrictTo("admin"), validate(schemas.allowedEmailWithRole), allowedEmailController.addAllowedEmail);
router.patch("/allowed-emails/:id", restrictTo("admin"), allowedEmailController.updateAllowedEmail);
router.delete("/allowed-emails/:id", restrictTo("admin"), allowedEmailController.deleteAllowedEmail);

// Add protected route for image deletion
router.delete("/gallery/images/:id", 
    authenticateSession, 
    restrictTo("admin"), 
    imageController.deleteImage
);

// Add protected route for image update
router.patch("/gallery/images/:id", 
    authenticateSession, 
    restrictTo("admin"), 
    imageController.updateImage
);

// Add protected route for image creation
router.post("/gallery/images", 
    authenticateSession, 
    restrictTo("admin"), 
    upload.single('image'),
    imageController.createImage
);

module.exports = router;