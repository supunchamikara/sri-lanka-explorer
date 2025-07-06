// ImageKit utility for uploading images
const IMAGEKIT_ENDPOINT = "https://ik.imagekit.io/rxy27pb0a";
const IMAGEKIT_PUBLIC_KEY = "public_7IutnU1Psb823zilunZU3KP9meo="; // This will need to be set from environment

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

    // Get authentication parameters from backend
    const authResponse = await fetch("/api/upload/imagekit-auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!authResponse.ok) {
      throw new Error("Failed to get ImageKit authentication");
    }

    const authResponseData = await authResponse.json();
    const authData = authResponseData.data;

    // Create form data for ImageKit upload
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", fileName);
    formData.append("folder", "/experiences/");
    formData.append("publicKey", IMAGEKIT_PUBLIC_KEY);
    formData.append("signature", authData.signature);
    formData.append("expire", authData.expire);
    formData.append("token", authData.token);

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
