const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// ImageKit configuration
const IMAGEKIT_PUBLIC_KEY =
  process.env.IMAGEKIT_PUBLIC_KEY || "public_7IutnU1Psb823zilunZU3KP9meo=";
const IMAGEKIT_PRIVATE_KEY =
  process.env.IMAGEKIT_PRIVATE_KEY || "private_d31D6bzpzOrts6mE4k6RLvqspQo=";
const IMAGEKIT_URL_ENDPOINT =
  process.env.IMAGEKIT_URL_ENDPOINT || "https://ik.imagekit.io/rxy27pb0a/";

// Authentication middleware
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

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

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, "../uploads/experiences");

    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp and user ID
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const userId = req.user ? req.user._id : "anonymous";
    cb(null, `${userId}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

// File filter to only allow images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit per file
  },
  fileFilter: fileFilter,
});

// POST /api/upload/imagekit-auth - Get authentication parameters for ImageKit client-side upload
router.post("/imagekit-auth", authenticateToken, (req, res) => {
  try {
    const crypto = require("crypto");

    // Generate authentication parameters for ImageKit
    const token = req.body.token || crypto.randomUUID();
    const expire = Math.floor(Date.now() / 1000) + 2400; // 40 minutes from now

    // Create signature for ImageKit authentication
    const signature = crypto
      .createHmac("sha1", IMAGEKIT_PRIVATE_KEY)
      .update(token + expire)
      .digest("hex");

    res.json({
      status: "success",
      data: {
        token,
        expire,
        signature,
        publicKey: IMAGEKIT_PUBLIC_KEY,
      },
    });
  } catch (error) {
    console.error("ImageKit auth error:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to generate authentication parameters",
    });
  }
});

// POST /api/upload - Upload multiple images
router.post("/", authenticateToken, upload.array("images", 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        status: "error",
        message: "No files uploaded",
      });
    }

    // Generate URLs for the uploaded files
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const imageUrls = req.files.map((file) => {
      return `${baseUrl}/uploads/experiences/${file.filename}`;
    });

    res.json({
      status: "success",
      message: "Images uploaded successfully",
      data: {
        urls: imageUrls,
        count: imageUrls.length,
      },
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to upload images",
    });
  }
});

// DELETE /api/upload/:filename - Delete an uploaded image
router.delete("/:filename", authenticateToken, (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, "../uploads/experiences", filename);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        status: "error",
        message: "File not found",
      });
    }

    // Delete the file
    fs.unlinkSync(filePath);

    res.json({
      status: "success",
      message: "Image deleted successfully",
    });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to delete image",
    });
  }
});

module.exports = router;
