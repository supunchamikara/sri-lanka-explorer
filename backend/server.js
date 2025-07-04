const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

const app = express();

// Middleware
app.use(helmet());
app.use(
  cors({
    origin:
      process.env.CORS_ORIGIN ||
      process.env.FRONTEND_URL ||
      "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" })); // Increase limit for base64 images
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

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

// Routes
app.use("/api/experiences", experienceRoutes);
app.use("/api/auth", authRoutes);

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
