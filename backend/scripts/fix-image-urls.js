const mongoose = require("mongoose");
require("dotenv").config();

// Import the Experience model
const Experience = require("../models/Experience");

const fixImageUrls = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Find all experiences with HTTP image URLs
    const experiences = await Experience.find({
      images: { $regex: /^http:\/\/.*\.herokuapp\.com/ },
    });

    console.log(`Found ${experiences.length} experiences with HTTP image URLs`);

    let updatedCount = 0;

    for (const experience of experiences) {
      // Update HTTP URLs to HTTPS
      const updatedImages = experience.images.map((imageUrl) => {
        if (
          imageUrl.startsWith("http://") &&
          imageUrl.includes("herokuapp.com")
        ) {
          return imageUrl.replace("http://", "https://");
        }
        return imageUrl;
      });

      // Save the updated experience
      experience.images = updatedImages;
      await experience.save();
      updatedCount++;

      console.log(`Updated experience: ${experience.title}`);
    }

    console.log(`Successfully updated ${updatedCount} experiences`);
  } catch (error) {
    console.error("Error fixing image URLs:", error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log("Database connection closed");
  }
};

// Run the script
fixImageUrls();
