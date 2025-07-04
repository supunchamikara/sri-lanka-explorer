const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Experience = require("../models/Experience");

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Authentication middleware
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        status: "error",
        message: "Access token required",
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

    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).json({
      status: "error",
      message: "Invalid or expired token",
    });
  }
};

// GET /api/experiences - Get all experiences (requires authentication)
router.get("/", authenticateToken, async (req, res) => {
  try {
    const { provinceId, districtId, cityName } = req.query;

    let query = {};
    if (provinceId) query.provinceId = provinceId;
    if (districtId) query.districtId = districtId;
    if (cityName) query.cityName = cityName;

    const experiences = await Experience.find(query).sort({ createdAt: -1 });

    res.json({
      status: "success",
      count: experiences.length,
      data: experiences,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

// GET /api/experiences/:id - Get single experience (requires authentication)
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);

    if (!experience) {
      return res.status(404).json({
        status: "error",
        message: "Experience not found",
      });
    }

    res.json({
      status: "success",
      data: experience,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

// POST /api/experiences - Create new experience
router.post("/", authenticateToken, async (req, res) => {
  try {
    const experienceData = {
      ...req.body,
      createdBy: req.user._id,
      createdByName: req.user.name,
    };

    const experience = new Experience(experienceData);
    await experience.save();

    res.status(201).json({
      status: "success",
      message: "Experience created successfully",
      data: experience,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
});

// PUT /api/experiences/:id - Update experience
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const experience = await Experience.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!experience) {
      return res.status(404).json({
        status: "error",
        message: "Experience not found",
      });
    }

    res.json({
      status: "success",
      message: "Experience updated successfully",
      data: experience,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
});

// DELETE /api/experiences/:id - Delete experience
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const experience = await Experience.findByIdAndDelete(req.params.id);

    if (!experience) {
      return res.status(404).json({
        status: "error",
        message: "Experience not found",
      });
    }

    res.json({
      status: "success",
      message: "Experience deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

module.exports = router;
