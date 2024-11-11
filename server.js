require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const compression = require("compression");
const path = require("path");
const { connectDB, closeDatabase } = require("./config/db");
const { errorHandler } = require("./middleware/errorHandler");
const logger = require("./logger");

const app = express();

// Middleware
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: false,
}));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use((req, res, next) => {
  if (req.url.endsWith(".css")) {
    res.type("text/css");
  }
  if (req.url.endsWith(".js")) {
    res.type("application/javascript");
  }
  next();
});


// Database connection
connectDB().then(() => {
  logger.info('Connected to MongoDB');
}).catch((err) => {
  logger.error('MongoDB connection error:', err);
  process.exit(1);
});

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    collectionName: "sessions",
  }),
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Routes
const apiRoutes = require('./routes/apiRoutes');
const authRoutes = require('./routes/authRoutes');
const publicRoutes = require('./routes/publicRoutes');

// Mount routes
app.use('/api', apiRoutes);
app.use('/auth', authRoutes);
app.use('/', publicRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "public", "404.html"));
});

// Error handling middleware
app.use(errorHandler);

// Start server
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  logger.info(`Server is running on http://localhost:${port}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    closeDatabase().then(() => {
      logger.info('Database connection closed');
      process.exit(0);
    });
  });
});

module.exports = app;