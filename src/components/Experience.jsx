import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../utils/api";
import { useToast } from "../hooks/useToast";
import Toast from "./Toast";

const Experience = () => {
  const [experiences, setExperiences] = useState([]);
  const [filteredExperiences, setFilteredExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImages, setSelectedImages] = useState({}); // Track selected image for each experience
  const { toast, showSuccess, showError, hideToast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Load experiences from API
    const loadExperiences = async () => {
      try {
        setLoading(true);
        const data = await api.experiences.getAll();
        setExperiences(data);

        // Handle search filtering
        const searchQuery = searchParams.get("search");
        if (searchQuery) {
          const filtered = data.filter(
            (exp) =>
              exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              exp.description
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              exp.cityName.toLowerCase().includes(searchQuery.toLowerCase())
          );
          setFilteredExperiences(filtered);
        } else {
          setFilteredExperiences(data);
        }
      } catch (error) {
        console.error("Error loading experiences:", error);
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

    loadExperiences();
  }, [navigate, showError, searchParams]);

  const deleteExperience = async (id) => {
    try {
      await api.experiences.delete(id);
      const updatedExperiences = experiences.filter(
        (exp) => (exp._id || exp.id) !== id
      );
      setExperiences(updatedExperiences);

      // Also update filtered experiences
      const updatedFilteredExperiences = filteredExperiences.filter(
        (exp) => (exp._id || exp.id) !== id
      );
      setFilteredExperiences(updatedFilteredExperiences);

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

  return (
    <div className="min-h-screen bg-light-gray pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-navy-blue mb-4">
            {searchParams.get("search")
              ? "Search Results"
              : "My Travel Experiences"}
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
            {searchParams.get("search")
              ? `Showing ${filteredExperiences.length} result${
                  filteredExperiences.length === 1 ? "" : "s"
                } for "${searchParams.get("search")}"`
              : "Share your amazing travel experiences across Sri Lanka's beautiful provinces, districts, and cities."}
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
            Add New Experience
          </Link>
        </div>

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
            <p className="text-gray-600">Loading your experiences...</p>
          </div>
        ) : filteredExperiences.length === 0 ? (
          <div className="text-center py-16">
            {searchParams.get("search") ? (
              <>
                <div className="text-6xl mb-4">�</div>
                <h2 className="text-2xl font-semibold text-navy-blue mb-4">
                  No results found for "{searchParams.get("search")}"
                </h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Try adjusting your search terms or browse all experiences
                  below.
                </p>
                <Link
                  to="/experience"
                  className="inline-flex items-center px-6 py-3 bg-accent-gold text-navy-blue font-semibold rounded-lg hover:bg-navy-blue hover:text-white transition-all duration-300"
                >
                  View All Experiences
                </Link>
              </>
            ) : (
              <>
                <div className="text-6xl mb-4">�📝</div>
                <h2 className="text-2xl font-semibold text-navy-blue mb-4">
                  No experiences yet
                </h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Start sharing your Sri Lankan adventures! Add your first
                  experience to inspire other travelers.
                </p>
                <Link
                  to="/add-experience"
                  className="inline-flex items-center px-6 py-3 bg-accent-gold text-navy-blue font-semibold rounded-lg hover:bg-navy-blue hover:text-white transition-all duration-300"
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
                  Add Your First Experience
                </Link>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            {/* Search Results Header */}
            {searchParams.get("search") && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold text-navy-blue mb-2">
                  Search Results for "{searchParams.get("search")}"
                </h2>
                <p className="text-gray-600">
                  Found {filteredExperiences.length} experience
                  {filteredExperiences.length === 1 ? "" : "s"}
                </p>
                <Link
                  to="/experience"
                  className="text-accent-gold hover:text-navy-blue transition-colors text-sm"
                >
                  Clear search and view all experiences
                </Link>
              </div>
            )}

            {filteredExperiences.map((experience) => {
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
                          <h2 className="text-2xl font-bold text-navy-blue mb-2">
                            {experience.title}
                          </h2>
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
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                            <span className="text-accent-gold font-semibold">
                              {experience.cityName}, {experience.districtName},{" "}
                              {experience.provinceName}
                            </span>
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
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
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            {new Date(experience.date).toLocaleDateString()}
                            {experience.createdByName && (
                              <>
                                <span className="mx-2">•</span>
                                <span>by {experience.createdByName}</span>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <Link
                            to={`/edit-experience/${experienceId}`}
                            className="p-2 text-accent-gold hover:text-yellow-600 transition-colors"
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
                            onClick={() => deleteExperience(experienceId)}
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

                      {/* Additional Images Display as clickable thumbnails */}
                      {hasMultipleImages && (
                        <div className="flex space-x-2 overflow-x-auto">
                          {experience.images.slice(1).map((image, index) => (
                            <button
                              key={index}
                              onClick={() =>
                                handleImageSelect(experienceId, index + 1)
                              }
                              className={`w-20 h-20 rounded-md flex-shrink-0 transition-all duration-200 ${
                                index + 1 === selectedImageIndex
                                  ? "border-2 border-accent-gold opacity-100"
                                  : "border-2 border-transparent opacity-75 hover:opacity-100 hover:border-gray-300"
                              }`}
                            >
                              <img
                                src={image}
                                alt={`${experience.title} ${index + 2}`}
                                className="w-full h-full object-cover rounded-md"
                              />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Toast Notification */}
      {toast.show && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
    </div>
  );
};

export default Experience;
