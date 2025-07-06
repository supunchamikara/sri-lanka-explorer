const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const multer = require("multer");
const path = require("path");
require("dotenv").config();

const app = express();

// Middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://www.googletagmanager.com",
          "https://www.google-analytics.com",
        ],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:", "http:", "blob:"],
        connectSrc: [
          "'self'",
          "https://www.google-analytics.com",
          "https://analytics.google.com",
          "https://upload.imagekit.io",
          "https://ik.imagekit.io",
        ],
        fontSrc: ["'self'", "data:", "https:"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    },
  })
);
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://srilanka-explorer.netlify.app",
      "https://sri-lanka-explorer.vercel.app",
      "https://tapro-web.herokuapp.com",
      "https://tapro-web-*.herokuapp.com",
      process.env.CORS_ORIGIN,
      process.env.FRONTEND_URL,
    ].filter(Boolean),
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" })); // Reduced from 10mb since no more Base64 images

// Serve static files from uploads directory with CORS headers
app.use(
  "/uploads",
  (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Cross-Origin-Resource-Policy", "cross-origin");
    next();
  },
  express.static(path.join(__dirname, "uploads"))
);
app.use(express.urlencoded({ extended: true, limit: "1mb" })); // Reduced from 10mb since no more Base64 images

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB Atlas connected successfully");
    console.log("📊 Database:", mongoose.connection.db.databaseName);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
};

// Import routes
const experienceRoutes = require("./routes/experiences");
const authRoutes = require("./routes/auth");
const uploadRoutes = require("./routes/upload");
const seoRoutes = require("./routes/seo");

// Routes
app.use("/api/experiences", experienceRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api", seoRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Sri Lanka Explorer API is running",
    timestamp: new Date().toISOString(),
    database:
      mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
  });
});

// Test database connection endpoint
app.get("/api/test-connection", async (req, res) => {
  try {
    const dbState = mongoose.connection.readyState;
    const states = {
      0: "Disconnected",
      1: "Connected",
      2: "Connecting",
      3: "Disconnecting",
    };

    res.json({
      status: "success",
      database: {
        state: states[dbState],
        name: mongoose.connection.db?.databaseName || "Not connected",
        host: mongoose.connection.host || "Not connected",
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// Serve static files from React build (for production)
if (process.env.NODE_ENV === "production") {
  // Serve static files from the dist directory
  app.use(express.static(path.join(__dirname, "../dist")));

  // Handle React Router (return index.html for all non-API routes)
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../dist/index.html"));
  });
} else {
  // Development/API-only mode - show welcome message
  app.get("/", (req, res) => {
    res.json({
      status: "success",
      message: "🇱🇰 Welcome to Sri Lanka Explorer API!",
      version: "1.0.0",
      description: "Backend API for Sri Lanka travel experiences",
      endpoints: {
        health: "/api/health",
        experiences: "/api/experiences",
        auth: "/api/auth",
        upload: "/api/upload",
        testConnection: "/api/test-connection",
      },
      documentation: "All API endpoints are prefixed with /api/",
      frontend: "Deploy your React frontend and connect it to this API",
      timestamp: new Date().toISOString(),
    });
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: "error",
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
  });
});

const PORT = process.env.PORT || 5000;

// Start server
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌐 API available at: http://localhost:${PORT}`);
    console.log(
      `🔗 Test connection: http://localhost:${PORT}/api/test-connection`
    );
  });
};

startServer();
