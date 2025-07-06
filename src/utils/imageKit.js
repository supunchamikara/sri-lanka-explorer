// ImageKit utility for uploading images
const IMAGEKIT_ENDPOINT = "https://ik.imagekit.io/rxy27pb0a/";
const IMAGEKIT_PUBLIC_KEY = "public_MKLeTf6L2Bb0vX4M7N8kZbDk6C4="; // This will need to be set from environment

export const imageKit = {
  // Upload multiple images to ImageKit
  uploadImages: async (files) => {
    try {
      const uploadPromises = files.map((file) => uploadSingleImage(file));
      const results = await Promise.all(uploadPromises);
      return results.map((result) => result.url);
    } catch (error) {
      console.error("Error uploading images to ImageKit:", error);
      throw error;
    }
  },

  // Upload a single image to ImageKit
  uploadSingleImage: async (file) => {
    return uploadSingleImage(file);
  },
};

// Helper function to upload a single image
const uploadSingleImage = async (file) => {
  try {
    // Create a unique filename
    const timestamp = Date.now();
    const randomId = Math.round(Math.random() * 1e9);
    const fileExtension = file.name.split(".").pop();
    const fileName = `experience-${timestamp}-${randomId}.${fileExtension}`;

    // Create form data for ImageKit upload
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", fileName);
    formData.append("folder", "/experiences/");
    formData.append("publicKey", IMAGEKIT_PUBLIC_KEY);

    // Generate authentication parameters (in a real app, this should be done on the server)
    const token = generateImageKitToken();
    formData.append("signature", token.signature);
    formData.append("expire", token.expire);

    const response = await fetch(
      "https://upload.imagekit.io/api/v1/files/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Failed to upload image to ImageKit"
      );
    }

    const data = await response.json();
    return {
      url: data.url,
      fileId: data.fileId,
      name: data.name,
    };
  } catch (error) {
    console.error("Error uploading single image:", error);
    throw error;
  }
};

// Simple token generation for demo (in production, this should be done on server)
const generateImageKitToken = () => {
  const expire = Math.floor(Date.now() / 1000) + 2400; // 40 minutes from now
  // For demo purposes, we'll use a simplified approach
  // In production, you should generate this on your server
  return {
    signature: "demo-signature", // This should be properly generated
    expire: expire,
  };
};
