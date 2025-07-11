const API_BASE_URL =
  import.meta.env.PROD || import.meta.env.NODE_ENV === "production"
    ? "/api" // Use relative URLs in production (same server)
    : import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Export API_BASE_URL for use in other files
export { API_BASE_URL };

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// API utility functions
export const api = {
  // Test database connection
  testConnection: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/test-connection`);
      return await response.json();
    } catch (error) {
      console.error("Connection test failed:", error);
      throw error;
    }
  },

  // Health check
  healthCheck: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return await response.json();
    } catch (error) {
      console.error("Health check failed:", error);
      throw error;
    }
  },

  // Experience API calls
  experiences: {
    // Get all experiences with optional filters
    getAll: async (filters = {}) => {
      try {
        const params = new URLSearchParams();
        if (filters.provinceId) params.append("provinceId", filters.provinceId);
        if (filters.districtId) params.append("districtId", filters.districtId);
        if (filters.cityName) params.append("cityName", filters.cityName);

        const response = await fetch(`${API_BASE_URL}/experiences?${params}`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch experiences");
        }

        return data.data;
      } catch (error) {
        console.error("Error fetching experiences:", error);
        throw error;
      }
    },

    // Get single experience by ID
    getById: async (id) => {
      try {
        const response = await fetch(`${API_BASE_URL}/experiences/${id}`, {
          headers: getAuthHeaders(),
        });
        const data = await response.json();

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("Authentication required - please log in");
          }
          throw new Error(data.message || "Failed to fetch experience");
        }

        return data.data;
      } catch (error) {
        console.error("Error fetching experience:", error);
        throw error;
      }
    },

    // Create new experience
    create: async (experienceData) => {
      try {
        const response = await fetch(`${API_BASE_URL}/experiences`, {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(experienceData),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to create experience");
        }

        return data.data;
      } catch (error) {
        console.error("Error creating experience:", error);
        throw error;
      }
    },

    // Update experience
    update: async (id, experienceData) => {
      try {
        const response = await fetch(`${API_BASE_URL}/experiences/${id}`, {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify(experienceData),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to update experience");
        }

        return data.data;
      } catch (error) {
        console.error("Error updating experience:", error);
        throw error;
      }
    },

    // Delete experience
    delete: async (id) => {
      try {
        const response = await fetch(`${API_BASE_URL}/experiences/${id}`, {
          method: "DELETE",
          headers: getAuthHeaders(),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to delete experience");
        }

        return data;
      } catch (error) {
        console.error("Error deleting experience:", error);
        throw error;
      }
    },
  },

  // Upload API calls
  upload: {
    // Upload multiple images
    images: async (files) => {
      try {
        const formData = new FormData();

        // Add each file to the form data
        files.forEach((file) => {
          formData.append("images", file);
        });

        const token = localStorage.getItem("token");
        const response = await fetch(`${API_BASE_URL}/upload`, {
          method: "POST",
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
            // Don't set Content-Type for FormData, let browser set it with boundary
          },
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to upload images");
        }

        return data.data.urls; // Return array of image URLs
      } catch (error) {
        console.error("Error uploading images:", error);
        throw error;
      }
    },

    // Delete an image by filename
    deleteImage: async (filename) => {
      try {
        const response = await fetch(`${API_BASE_URL}/upload/${filename}`, {
          method: "DELETE",
          headers: getAuthHeaders(),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to delete image");
        }

        return data;
      } catch (error) {
        console.error("Error deleting image:", error);
        throw error;
      }
    },
  },
};
