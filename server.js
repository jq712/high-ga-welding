require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const compression = require("compression");
const path = require("path");
const { connectDB, closeDatabase } = require("./config/db");
const pageRoutes = require("./routes/pageRoutes");
const formRoutes = require("./routes/formRoutes");
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const { errorHandler } = require("./middleware/errorHandler");
const logger = require("./logger");
const { authenticateSession } = require("./middleware/authMiddleware");
const { restrictTo } = require("./controllers/authController");

const app = express();
app.use((err, req, res, next) => {
  console.error("Error:", err);
  if (err instanceof AppError) {
    if (err.statusCode === 401) {
      console.log("Unauthorized access attempt, redirecting to login");
      return res.redirect("/login");
    }
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
  }
  res.status(500).json({
    status: "error",
    message: "Something went wrong!",
  });
});

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
});

// Middleware
app.use(limiter);
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: false,
  })
);
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  if (req.url.endsWith(".css")) {
    res.type("text/css");
  }
  next();
});

let sessionStore;
if (process.env.NODE_ENV === "test") {
  sessionStore = new session.MemoryStore();
} else {
  sessionStore = MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    collectionName: "sessions",
    ttl: 24 * 60 * 60, // 1 day in seconds
  });
}

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    },
    proxy: true,
  })
);

// Routes
app.use("/", pageRoutes); // Moved up to handle routes before static files

app.use("/api/forms", formRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use(
  // Serve public static files
  express.static(path.join(__dirname, "public"), {
    index: false,
    extensions: ["js", "css", "png", "jpg", "gif", "svg"],
  })
);

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "public", "404.html"));
});

// Error handling middleware
app.use(errorHandler);

// Connect to MongoDB and start server
if (require.main === module) {
  connectDB()
    .then(() => {
      const port = process.env.PORT || 3000;
      const server = app.listen(port, () => {
        logger.info(`Server is running on http://localhost:${port}`);
      });

      // Graceful shutdown
      process.on("SIGTERM", () => {
        logger.info("SIGTERM signal received: closing HTTP server");
        server.close(() => {
          logger.info("HTTP server closed");
          closeDatabase().then(() => {
            logger.info("Database connection closed");
            process.exit(0);
          });
        });
      });
    })
    .catch((err) => {
      logger.error("Failed to connect to MongoDB:", err);
      process.exit(1);
    });
}

module.exports = { app, sessionStore };
