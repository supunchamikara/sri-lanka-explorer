import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { sriLankaData } from "../data/sriLankaData";
import { api } from "../utils/api";
import { useToast } from "../hooks/useToast";
import Toast from "./Toast";

const CityExperiences = () => {
  const { provinceId, districtId, cityName } = useParams();
  const navigate = useNavigate();
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImages, setSelectedImages] = useState({}); // Track selected image for each experience
  const { toast, showSuccess, showError, hideToast } = useToast();

  const province = sriLankaData.find((p) => p.id === parseInt(provinceId));
  const district = province?.districts.find(
    (d) => d.id === parseInt(districtId)
  );

  useEffect(() => {
    // Load experiences from API and filter by current city
    const loadCityExperiences = async () => {
      try {
        setLoading(true);
        const allExperiences = await api.experiences.getAll();
        const cityExperiences = allExperiences.filter(
          (exp) =>
            exp.provinceId === provinceId &&
            exp.districtId === districtId &&
            exp.cityName === decodeURIComponent(cityName)
        );
        setExperiences(cityExperiences);
      } catch (error) {
        console.error("Error loading city experiences:", error);
        // If authentication error, redirect to login
        if (
          error.message &&
          error.message.includes("Authentication required")
        ) {
          showError("Please log in to view experiences");
          navigate("/auth");
          return;
        }
        showError("Failed to load experiences");
      } finally {
        setLoading(false);
      }
    };

    loadCityExperiences();
  }, [provinceId, districtId, cityName, navigate, showError]);

  const deleteExperience = async (id) => {
    try {
      await api.experiences.delete(id);
      const updatedExperiences = experiences.filter(
        (exp) => (exp._id || exp.id) !== id
      );
      setExperiences(updatedExperiences);
      showSuccess("Experience deleted successfully!");
    } catch (error) {
      console.error("Error deleting experience:", error);
      showError("Failed to delete experience");
    }
  };

  const handleImageSelect = (experienceId, imageIndex) => {
    setSelectedImages((prev) => ({
      ...prev,
      [experienceId]: imageIndex,
    }));
  };

  const getSelectedImageIndex = (experienceId) => {
    return selectedImages[experienceId] || 0;
  };

  if (!province || !district) {
    return (
      <div className="min-h-screen bg-light-gray pt-20 pb-8 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-navy-blue mb-4">
            City Not Found
          </h1>
          <Link to="/" className="text-accent-gold hover:underline">
            Return to Provinces
          </Link>
        </div>
      </div>
    );
  }

  const decodedCityName = decodeURIComponent(cityName);

  return (
    <div className="min-h-screen bg-light-gray pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center space-x-4 mb-6">
            <button
              onClick={() => navigate("/")}
              className="flex items-center text-accent-gold hover:text-navy-blue transition-colors"
            >
              <svg
                className="w-4 h-4 mr-1"
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
              Provinces
            </button>
            <span className="text-gray-400">/</span>
            <button
              onClick={() => navigate(`/province/${provinceId}`)}
              className="text-accent-gold hover:text-navy-blue transition-colors"
            >
              {province.name}
            </button>
            <span className="text-gray-400">/</span>
            <button
              onClick={() =>
                navigate(`/province/${provinceId}/district/${districtId}`)
              }
              className="text-accent-gold hover:text-navy-blue transition-colors"
            >
              {district.name}
            </button>
          </div>

          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-navy-blue mb-2">
              {decodedCityName}
            </h1>
            <p className="text-lg text-accent-gold mb-4">
              {district.name}, {province.name}
            </p>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6">
              Discover travel experiences and stories from {decodedCityName}.
            </p>

            <Link
              to="/add-experience"
              className="inline-flex items-center px-6 py-3 bg-accent-gold text-navy-blue font-semibold rounded-lg hover:bg-navy-blue hover:text-white transition-all duration-300 shadow-md hover:shadow-lg"
            >
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Share Your Experience in {decodedCityName}
            </Link>
          </div>
        </div>

        {/* Experiences Section */}
        {loading ? (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <svg
                className="w-12 h-12 mx-auto mb-4 animate-spin"
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
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Loading Experiences...
            </h3>
          </div>
        ) : experiences.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <svg
                className="w-24 h-24 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No Experiences in {decodedCityName} Yet
            </h3>
            <p className="text-gray-500 mb-6">
              Be the first to share your amazing experience in {decodedCityName}
              !
            </p>
            <Link
              to="/add-experience"
              className="inline-flex items-center px-6 py-3 bg-accent-gold text-navy-blue font-semibold rounded-lg hover:bg-navy-blue hover:text-white transition-all duration-300"
            >
              Share Your First Experience
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-navy-blue">
                Travel Experiences in {decodedCityName}
                <span className="text-lg text-gray-500 ml-2">
                  ({experiences.length})
                </span>
              </h2>
            </div>

            {experiences.map((experience) => {
              const experienceId = experience._id || experience.id;
              const selectedImageIndex = getSelectedImageIndex(experienceId);
              const hasMultipleImages =
                experience.images && experience.images.length > 1;

              return (
                <div
                  key={experienceId}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
                >
                  <div className="md:flex">
                    {/* Images Section */}
                    {experience.images && experience.images.length > 0 && (
                      <div className="md:w-1/3 relative">
                        <div className="h-64 md:h-full">
                          <img
                            src={experience.images[selectedImageIndex]}
                            alt={experience.title}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Image Gallery Thumbnails */}
                        {hasMultipleImages && (
                          <div className="absolute bottom-2 left-2 right-2">
                            <div className="flex space-x-1 bg-black bg-opacity-50 rounded-lg p-2">
                              {experience.images.map((image, imgIndex) => (
                                <button
                                  key={imgIndex}
                                  onClick={() =>
                                    handleImageSelect(experienceId, imgIndex)
                                  }
                                  className={`w-10 h-10 rounded overflow-hidden transition-all duration-200 ${
                                    imgIndex === selectedImageIndex
                                      ? "ring-2 ring-accent-gold scale-110"
                                      : "opacity-70 hover:opacity-100"
                                  }`}
                                >
                                  <img
                                    src={image}
                                    alt={`${experience.title} ${imgIndex + 1}`}
                                    className="w-full h-full object-cover"
                                  />
                                </button>
                              ))}
                            </div>

                            {/* Image Counter */}
                            <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                              {selectedImageIndex + 1} /{" "}
                              {experience.images.length}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Content Section */}
                    <div className="md:w-2/3 p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-2xl font-bold text-navy-blue mb-2">
                            {experience.title}
                          </h3>
                          <div className="flex items-center text-sm text-gray-600 mb-2">
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                            Shared by{" "}
                            {experience.createdByName || "Unknown User"}
                          </div>
                          <div className="flex items-center text-sm text-gray-600 mb-2">
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7V3a4 4 0 118 0v4m-4 8l-6-6 2.5-2.5a1.5 1.5 0 112.121 2.121L9 15"
                              />
                            </svg>
                            {new Date(
                              experience.createdAt
                            ).toLocaleDateString()}
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <Link
                            to={`/edit-experience/${
                              experience._id || experience.id
                            }`}
                            className="p-2 text-accent-gold hover:text-navy-blue transition-colors"
                            title="Edit Experience"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </Link>
                          <button
                            onClick={() =>
                              deleteExperience(experience._id || experience.id)
                            }
                            className="p-2 text-red-500 hover:text-red-700 transition-colors"
                            title="Delete Experience"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>

                      <p className="text-gray-700 leading-relaxed mb-4">
                        {experience.description}
                      </p>

                      {/* Additional Images */}
                      {experience.images && experience.images.length > 1 && (
                        <div className="flex space-x-2 overflow-x-auto">
                          {experience.images.slice(1, 4).map((image, index) => (
                            <img
                              key={index}
                              src={image}
                              alt={`${experience.title} ${index + 2}`}
                              className="w-20 h-20 object-cover rounded-md flex-shrink-0"
                            />
                          ))}
                          {experience.images.length > 4 && (
                            <div className="w-20 h-20 bg-gray-200 rounded-md flex items-center justify-center text-sm text-gray-600 flex-shrink-0">
                              +{experience.images.length - 4}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* City Information Card */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-navy-blue mb-4">
            About {decodedCityName}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-accent-gold mb-2">
                {experiences.length}
              </div>
              <div className="text-gray-600">Experiences Shared</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent-gold mb-2">
                {district.name.replace(" District", "")}
              </div>
              <div className="text-gray-600">District</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent-gold mb-2">
                {province.name.replace(" Province", "")}
              </div>
              <div className="text-gray-600">Province</div>
            </div>
          </div>
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

export default CityExperiences;
