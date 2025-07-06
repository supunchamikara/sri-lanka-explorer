import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { sriLankaData } from "../data/sriLankaData";
import { api } from "../utils/api";
import { useToast } from "../hooks/useToast";
import Toast from "./Toast";

const AddExperience = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // For editing existing experience
  const isEditing = Boolean(id);
  const { toast, showSuccess, showError, hideToast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    provinceId: "",
    districtId: "",
    cityName: "",
    images: [],
  });

  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditing) {
      // Load existing experience for editing from API
      const loadExperience = async () => {
        try {
          setLoading(true);
          const experience = await api.experiences.getById(id);
          setFormData({
            title: experience.title,
            description: experience.description,
            provinceId: experience.provinceId,
            districtId: experience.districtId,
            cityName: experience.cityName,
            images: experience.images || [],
          });

          // Set selected province and district
          const province = sriLankaData.find(
            (p) => p.id === parseInt(experience.provinceId)
          );
          if (province) {
            setSelectedProvince(province);
            const district = province.districts.find(
              (d) => d.id === parseInt(experience.districtId)
            );
            if (district) {
              setSelectedDistrict(district);
            }
          }
        } catch (error) {
          console.error("Error loading experience:", error);
          showError("Failed to load experience data");
        } finally {
          setLoading(false);
        }
      };

      loadExperience();
    }
  }, [id, isEditing, showError]);

  const handleProvinceChange = (e) => {
    const provinceId = e.target.value;
    setFormData({ ...formData, provinceId, districtId: "", cityName: "" });

    const province = sriLankaData.find((p) => p.id === parseInt(provinceId));
    setSelectedProvince(province);
    setSelectedDistrict(null);
  };

  const handleDistrictChange = (e) => {
    const districtId = e.target.value;
    setFormData({ ...formData, districtId, cityName: "" });

    if (selectedProvince) {
      const district = selectedProvince.districts.find(
        (d) => d.id === parseInt(districtId)
      );
      setSelectedDistrict(district);
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);

    if (files.length === 0) return;

    try {
      setLoading(true);

      // Get ImageKit authentication from backend
      const token = localStorage.getItem("token");
      const authResponse = await fetch(
        `${
          import.meta.env.PROD ? "/api" : "http://localhost:5000/api"
        }/upload/imagekit-auth`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({}),
        }
      );

      if (!authResponse.ok) {
        throw new Error("Failed to get ImageKit authentication");
      }

      const authData = await authResponse.json();
      const { token: authToken, expire, signature, publicKey } = authData.data;

      // Upload files to ImageKit
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();

        // Create a unique filename
        const timestamp = Date.now();
        const randomId = Math.round(Math.random() * 1e9);
        const fileExtension = file.name.split(".").pop();
        const fileName = `experience-${timestamp}-${randomId}.${fileExtension}`;

        formData.append("file", file);
        formData.append("fileName", fileName);
        formData.append("folder", "/experiences/");
        formData.append("publicKey", publicKey);
        formData.append("signature", signature);
        formData.append("expire", expire);
        formData.append("token", authToken);

        const response = await fetch(
          "https://upload.imagekit.io/api/v1/files/upload",
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) {
          const errorData = await response.text();
          console.error("ImageKit upload error:", errorData);
          throw new Error(`Failed to upload ${file.name}`);
        }

        const data = await response.json();
        return data.url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);

      // Add uploaded URLs to form data
      setFormData({
        ...formData,
        images: [...formData.images, ...uploadedUrls],
      });

      showSuccess(`${files.length} image(s) uploaded successfully!`);
    } catch (error) {
      console.error("Upload error:", error);
      showError(`Failed to upload images: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const removeImage = async (index) => {
    const imageUrl = formData.images[index];

    try {
      // For ImageKit images, we can try to delete them, but it's not critical if it fails
      // ImageKit deletion requires authentication and proper API setup
      console.log("Removing image from UI:", imageUrl);

      // Note: In production, you might want to implement ImageKit deletion
      // using the file ID if you store it during upload
    } catch (error) {
      console.error("Error deleting image:", error);
      // Continue with removal from UI even if server deletion fails
    }

    const updatedImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: updatedImages });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.description ||
      !formData.provinceId ||
      !formData.districtId ||
      !formData.cityName
    ) {
      showError("Please fill in all required fields");
      return;
    }

    const provinceName = selectedProvince?.name;
    const districtName = selectedDistrict?.name;

    const experienceData = {
      ...formData,
      provinceName,
      districtName,
    };

    try {
      setLoading(true);

      if (isEditing) {
        // Update existing experience
        await api.experiences.update(id, experienceData);
        showSuccess("Experience updated successfully!");
      } else {
        // Create new experience
        await api.experiences.create(experienceData);
        showSuccess("Experience created successfully!");
      }

      navigate("/experience");
    } catch (error) {
      console.error("Error saving experience:", error);
      showError(
        `Failed to ${isEditing ? "update" : "create"} experience: ${
          error.message
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-light-gray pt-20 pb-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <button
            onClick={() => navigate("/experience")}
            className="flex items-center text-accent-gold hover:text-navy-blue transition-colors mb-4"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Experiences
          </button>

          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-navy-blue mb-4">
              {isEditing ? "Edit Experience" : "Add New Experience"}
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {isEditing
                ? "Update your travel experience"
                : "Share your amazing travel experience in Sri Lanka"}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Location Selection */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-navy-blue mb-2">
                  Province *
                </label>
                <select
                  value={formData.provinceId}
                  onChange={handleProvinceChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-gold focus:border-transparent"
                  required
                >
                  <option value="">Select Province</option>
                  {sriLankaData.map((province) => (
                    <option key={province.id} value={province.id}>
                      {province.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-navy-blue mb-2">
                  District *
                </label>
                <select
                  value={formData.districtId}
                  onChange={handleDistrictChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-gold focus:border-transparent"
                  required
                  disabled={!selectedProvince}
                >
                  <option value="">Select District</option>
                  {selectedProvince?.districts.map((district) => (
                    <option key={district.id} value={district.id}>
                      {district.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-navy-blue mb-2">
                  City *
                </label>
                <select
                  value={formData.cityName}
                  onChange={(e) =>
                    setFormData({ ...formData, cityName: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-gold focus:border-transparent"
                  required
                  disabled={!selectedDistrict}
                >
                  <option value="">Select City</option>
                  {selectedDistrict?.cities.map((city, index) => (
                    <option key={index} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-navy-blue mb-2">
                Experience Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-gold focus:border-transparent"
                placeholder="Give your experience a memorable title..."
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-navy-blue mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-gold focus:border-transparent"
                placeholder="Share the details of your amazing experience..."
                required
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-navy-blue mb-2">
                Upload Images
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className={`cursor-pointer inline-flex items-center px-4 py-2 rounded-md transition-colors ${
                    loading
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-accent-gold text-navy-blue hover:bg-navy-blue hover:text-white"
                  }`}
                >
                  {loading ? (
                    <>
                      <svg
                        className="w-5 h-5 mr-2 animate-spin"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      Choose Images
                    </>
                  )}
                </label>
                <p className="text-gray-500 text-sm mt-2">
                  Upload multiple images (max 5MB each) to showcase your
                  experience
                </p>
              </div>

              {/* Image Preview */}
              {formData.images.length > 0 && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-24 object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate("/experience")}
                disabled={loading}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-accent-gold text-navy-blue font-semibold rounded-md hover:bg-navy-blue hover:text-white transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50"
              >
                {loading
                  ? isEditing
                    ? "Updating..."
                    : "Saving..."
                  : isEditing
                  ? "Update Experience"
                  : "Save Experience"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  );
};

export default AddExperience;
