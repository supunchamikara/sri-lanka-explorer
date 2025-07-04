const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// JWT secret (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Register user
router.post("/register", async (req, res) => {
  try {
    const { name, username, password, confirmPassword } = req.body;

    // Validation
    if (!name || !username || !password || !confirmPassword) {
      return res.status(400).json({
        status: "error",
        message: "All fields are required",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        status: "error",
        message: "Passwords do not match",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        status: "error",
        message: "Password must be at least 6 characters",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({
        status: "error",
        message: "Username already exists",
      });
    }

    // Create user
    const user = new User({ name, username, password });
    await user.save();

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      status: "success",
      message: "User registered successfully",
      data: {
        user,
        token,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
});

// Login user
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validation
    if (!username || !password) {
      return res.status(400).json({
        status: "error",
        message: "Username and password are required",
      });
    }

    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "Invalid credentials",
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: "error",
        message: "Invalid credentials",
      });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      status: "success",
      message: "Login successful",
      data: {
        user,
        token,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
});

// Get current user (protected route)
router.get("/me", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        status: "error",
        message: "No token provided",
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "User not found",
      });
    }

    res.json({
      status: "success",
      data: { user },
    });
  } catch (error) {
    console.error("Auth error:", error);
    res.status(401).json({
      status: "error",
      message: "Invalid token",
    });
  }
});

// Update user profile (protected route)
router.put("/profile", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        status: "error",
        message: "No token provided",
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "User not found",
      });
    }

    const { name, currentPassword, newPassword } = req.body;

    // Update name if provided
    if (name) {
      user.name = name.trim();
    }

    // Update password if provided
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({
          status: "error",
          message: "Current password is required to change password",
        });
      }

      // Verify current password
      const isCurrentPasswordValid = await user.comparePassword(
        currentPassword
      );
      if (!isCurrentPasswordValid) {
        return res.status(400).json({
          status: "error",
          message: "Current password is incorrect",
        });
      }

      // Validate new password
      if (newPassword.length < 6) {
        return res.status(400).json({
          status: "error",
          message: "New password must be at least 6 characters",
        });
      }

      user.password = newPassword;
    }

    await user.save();

    res.json({
      status: "success",
      message: "Profile updated successfully",
      data: { user },
    });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
});

module.exports = router;
