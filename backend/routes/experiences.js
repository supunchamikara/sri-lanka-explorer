const express = require("express");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
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

// GET /api/experiences - Get all experiences (public access)
router.get("/", async (req, res) => {
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
router.get("/:id", async (req, res) => {
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
    // First find the experience to check ownership
    const existingExperience = await Experience.findById(req.params.id);

    if (!existingExperience) {
      return res.status(404).json({
        status: "error",
        message: "Experience not found",
      });
    }

    // Check if the user owns this experience
    if (existingExperience.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: "error",
        message: "You can only edit your own experiences",
      });
    }

    // Update the experience
    const experience = await Experience.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

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
    // First find the experience to check ownership
    const experience = await Experience.findById(req.params.id);

    if (!experience) {
      return res.status(404).json({
        status: "error",
        message: "Experience not found",
      });
    }

    // Check if the user owns this experience
    if (experience.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: "error",
        message: "You can only delete your own experiences",
      });
    }

    // Delete associated image files before deleting the experience
    if (experience.images && experience.images.length > 0) {
      console.log(
        `🗑️ Deleting ${experience.images.length} images for experience ${req.params.id}`
      );

      for (const imageUrl of experience.images) {
        try {
          console.log(`🗑️ Processing image: ${imageUrl}`);

          // Check if image is hosted on ImageKit
          if (imageUrl.includes("ik.imagekit.io")) {
            // Extract filename from ImageKit URL
            const urlParts = imageUrl.split("/");
            const filename = urlParts[urlParts.length - 1];

            console.log(`🗑️ Attempting to delete ImageKit image: ${filename}`);

            // Delete from ImageKit using Management API
            try {
              // First, try to find the file by searching with just the filename
              const listResponse = await fetch(
                `https://api.imagekit.io/v1/files?name=${filename}`,
                {
                  method: "GET",
                  headers: {
                    Authorization: `Basic ${Buffer.from(
                      process.env.IMAGEKIT_PRIVATE_KEY + ":"
                    ).toString("base64")}`,
                  },
                }
              );

              console.log(
                `🗑️ ImageKit search response status: ${listResponse.status}`
              );

              if (listResponse.ok) {
                const files = await listResponse.json();
                console.log(
                  `🗑️ Found ${files.length} files with name: ${filename}`
                );

                if (files.length > 0) {
                  // Delete the file using its fileId
                  const fileId = files[0].fileId;
                  console.log(`🗑️ Deleting file with ID: ${fileId}`);

                  const deleteResponse = await fetch(
                    `https://api.imagekit.io/v1/files/${fileId}`,
                    {
                      method: "DELETE",
                      headers: {
                        Authorization: `Basic ${Buffer.from(
                          process.env.IMAGEKIT_PRIVATE_KEY + ":"
                        ).toString("base64")}`,
                      },
                    }
                  );

                  console.log(
                    `🗑️ ImageKit delete response status: ${deleteResponse.status}`
                  );

                  if (deleteResponse.ok) {
                    console.log(
                      `✅ Successfully deleted ImageKit image: ${filename}`
                    );
                  } else {
                    const errorText = await deleteResponse.text();
                    console.error(
                      `❌ Failed to delete ImageKit image: ${filename}`,
                      errorText
                    );
                  }
                } else {
                  console.log(`⚠️ No files found with name: ${filename}`);

                  // Try alternative search - sometimes filenames might be different
                  // Let's try searching for files in the experiences folder
                  const folderResponse = await fetch(
                    `https://api.imagekit.io/v1/files?path=/experiences/`,
                    {
                      method: "GET",
                      headers: {
                        Authorization: `Basic ${Buffer.from(
                          process.env.IMAGEKIT_PRIVATE_KEY + ":"
                        ).toString("base64")}`,
                      },
                    }
                  );

                  if (folderResponse.ok) {
                    const folderFiles = await folderResponse.json();
                    console.log(
                      `🗑️ Found ${folderFiles.length} files in /experiences/ folder`
                    );

                    // Try to find the file by partial URL match
                    const matchedFile = folderFiles.find(
                      (file) =>
                        file.url === imageUrl ||
                        file.name === filename ||
                        imageUrl.includes(file.name)
                    );

                    if (matchedFile) {
                      console.log(
                        `🗑️ Found matched file: ${matchedFile.name} (${matchedFile.fileId})`
                      );

                      const deleteResponse = await fetch(
                        `https://api.imagekit.io/v1/files/${matchedFile.fileId}`,
                        {
                          method: "DELETE",
                          headers: {
                            Authorization: `Basic ${Buffer.from(
                              process.env.IMAGEKIT_PRIVATE_KEY + ":"
                            ).toString("base64")}`,
                          },
                        }
                      );

                      if (deleteResponse.ok) {
                        console.log(
                          `✅ Successfully deleted matched ImageKit image: ${matchedFile.name}`
                        );
                      } else {
                        const errorText = await deleteResponse.text();
                        console.error(
                          `❌ Failed to delete matched ImageKit image: ${matchedFile.name}`,
                          errorText
                        );
                      }
                    } else {
                      console.log(
                        `⚠️ No matching file found for URL: ${imageUrl}`
                      );
                    }
                  }
                }
              } else {
                const errorText = await listResponse.text();
                console.error(`❌ Failed to search ImageKit files:`, errorText);
              }
            } catch (imagekitError) {
              console.error(
                `❌ Error deleting ImageKit image ${filename}:`,
                imagekitError.message
              );
            }
          } else if (imageUrl.includes("/uploads/experiences/")) {
            // Handle local files (legacy)
            const filename = imageUrl.split("/uploads/experiences/").pop();
            const filePath = path.join(
              __dirname,
              "../uploads/experiences",
              filename
            );

            // Delete file if it exists
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
              console.log(`✅ Deleted local image file: ${filename}`);
            }
          }
        } catch (fileError) {
          console.error(`❌ Error deleting image file: ${fileError.message}`);
          // Continue with experience deletion even if file deletion fails
        }
      }
    }

    // Delete the experience
    await Experience.findByIdAndDelete(req.params.id);

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
