const express = require("express");
const router = express.Router();
const imageController = require('../controllers/imageController');

/**
 * Home page route
 * Renders the main landing page of the website
 * Template: views/index.ejs
 */
router.get("/", (req, res) => {
  res.render("index", { currentPage: 'home' });
});

/**
 * Gallery route
 * Displays all welding images with filtering options
 * Handled by imageController for database queries and image processing
 * Template: views/gallery.ejs
 */
router.get('/gallery', imageController.renderGallery);

/**
 * Static page routes
 * Each route renders its corresponding EJS template
 * The currentPage parameter is used for navigation highlighting
 */

// About page - Company information and history
router.get("/about", (req, res) => {
  res.render("about", { currentPage: 'about' });
});

// Contact page - Contact form and company contact information
router.get("/contact", (req, res) => {
  res.render("contact", { currentPage: 'contact' });
});

// Certifications page - Display company certifications and qualifications
router.get("/certifications", (req, res) => {
  res.render("certifications", { currentPage: 'certifications' });
});

/**
 * Authentication routes
 * These routes handle user authentication pages
 * Access control is handled by middleware in adminRoutes.js
 */

// Login page - User authentication form
router.get("/login", (req, res) => {
  res.render("login", { currentPage: 'login' });
});

// Registration page - New user registration form
router.get("/register", (req, res) => {
  res.render("register", { currentPage: 'register' });
});

module.exports = router;