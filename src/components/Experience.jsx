import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../utils/api";
import { useToast } from "../hooks/useToast";
import { useAuth } from "../context/AuthContext";
import { SEOHelmet } from "../context/SEOContext";
import Toast from "./Toast";
import RichTextDisplay from "./RichTextDisplay";

const Experience = () => {
  const { isAuthenticated, user } = useAuth();
  const [experiences, setExperiences] = useState([]);
  const [filteredExperiences, setFilteredExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImages, setSelectedImages] = useState({}); // Track selected image for each experience
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
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

        // Reset to first page when data changes
        setCurrentPage(1);
      } catch (error) {
        console.error("Error loading experiences:", error);
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

  // Check if current user owns the experience
  const isOwner = (experience) => {
    return isAuthenticated && user && experience.createdBy === user._id;
  };

  // Pagination calculations
  const totalPages = Math.ceil(filteredExperiences.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentExperiences = filteredExperiences.slice(startIndex, endIndex);

  // Pagination handlers
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page
  };

  const getPaginationNumbers = () => {
    const delta = 2; // Number of pages to show around current page
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  return (
    <div className="min-h-screen bg-light-gray pt-20 pb-8">
      <SEOHelmet
        title={
          searchParams.get("search")
            ? `Search Results for "${searchParams.get(
                "search"
              )}" - Sri Lanka Experiences`
            : "Travel Experiences in Sri Lanka - Real Stories & Reviews"
        }
        description={
          searchParams.get("search")
            ? `Find travel experiences related to "${searchParams.get(
                "search"
              )}" in Sri Lanka. Discover real stories, reviews, and recommendations from fellow travelers.`
            : "Browse authentic travel experiences shared by travelers across Sri Lanka. Discover hidden gems, local insights, and travel tips from real people who've explored the island."
        }
        keywords={`Sri Lanka experiences, travel stories, ${
          searchParams.get("search") || "travel reviews"
        }, travel recommendations, authentic experiences, local insights, traveler stories`}
        canonicalUrl="/experience"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Sri Lanka Travel Experiences",
          description:
            "Collection of authentic travel experiences in Sri Lanka",
          numberOfItems: filteredExperiences.length,
          itemListElement: filteredExperiences
            .slice(0, 10)
            .map((experience, index) => ({
              "@type": "ListItem",
              position: index + 1,
              item: {
                "@type": "TouristAttraction",
                name: experience.title,
                description: experience.description,
                location: {
                  "@type": "Place",
                  name: `${experience.cityName}, ${experience.districtName}, ${experience.provinceName}`,
                  containedInPlace: {
                    "@type": "Country",
                    name: "Sri Lanka",
                  },
                },
              },
            })),
        }}
      />

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

          {isAuthenticated ? (
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
          ) : (
            <Link
              to="/auth"
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
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                />
              </svg>
              Login to Add Experience
            </Link>
          )}
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
                <div className="text-6xl mb-4">🔍</div>
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
                <div className="text-6xl mb-4">✨📝</div>
                <h2 className="text-2xl font-semibold text-navy-blue mb-4">
                  No experiences yet
                </h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Start sharing your Sri Lankan adventures! Add your first
                  experience to inspire other travelers.
                </p>
                {isAuthenticated ? (
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
                ) : (
                  <Link
                    to="/auth"
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
                        d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                      />
                    </svg>
                    Login to Add Experience
                  </Link>
                )}
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

            {/* Results Counter and Pagination Info */}
            {filteredExperiences.length > 0 && (
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 bg-white rounded-lg shadow-sm p-4">
                <div className="text-gray-600 text-sm mb-2 sm:mb-0">
                  Showing {startIndex + 1}-
                  {Math.min(endIndex, filteredExperiences.length)} of{" "}
                  {filteredExperiences.length} experiences
                  {totalPages > 1 && (
                    <span className="ml-2 text-gray-500">
                      (Page {currentPage} of {totalPages})
                    </span>
                  )}
                </div>
                <div className="text-gray-500 text-xs">
                  {itemsPerPage} items per page
                </div>
              </div>
            )}

            {/* Experiences Grid - 4 per row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {currentExperiences.map((experience) => {
                const experienceId = experience._id || experience.id;
                const selectedImageIndex = getSelectedImageIndex(experienceId);
                const hasMultipleImages =
                  experience.images && experience.images.length > 1;

                return (
                  <div
                    key={experienceId}
                    className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:scale-105 group"
                  >
                    {/* Image Section */}
                    {experience.images && experience.images.length > 0 && (
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={experience.images[selectedImageIndex]}
                          alt={experience.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />

                        {/* Image Gallery Thumbnails */}
                        {hasMultipleImages && (
                          <div className="absolute bottom-2 left-2 right-2">
                            <div className="flex space-x-1 bg-black bg-opacity-50 rounded-lg p-2">
                              {experience.images.map((image, imgIndex) => (
                                <button
                                  key={imgIndex}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleImageSelect(experienceId, imgIndex);
                                  }}
                                  className={`w-8 h-8 rounded overflow-hidden transition-all duration-200 ${
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

                        {/* Action Buttons for Owner */}
                        {isAuthenticated && isOwner(experience) && (
                          <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <Link
                              to={`/edit-experience/${experienceId}`}
                              className="p-2 bg-accent-gold text-navy-blue rounded-lg hover:bg-yellow-500 transition-colors shadow-lg"
                              title="Edit Experience"
                            >
                              <svg
                                className="w-4 h-4"
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
                              className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-lg"
                              title="Delete Experience"
                            >
                              <svg
                                className="w-4 h-4"
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
                        )}
                      </div>
                    )}

                    {/* Content Section */}
                    <div className="p-6">
                      <h3 className="font-bold text-lg text-navy-blue mb-2 line-clamp-2 min-h-[56px]">
                        {experience.title}
                      </h3>

                      <div className="text-gray-600 text-sm mb-3 min-h-[60px]">
                        <RichTextDisplay
                          content={experience.description}
                          preview={true}
                          maxLength={150}
                        />
                      </div>

                      {/* Location */}
                      <div className="flex items-center text-sm text-gray-600 mb-3">
                        <svg
                          className="w-4 h-4 mr-1 text-accent-gold"
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
                        <span className="text-accent-gold font-semibold truncate">
                          {experience.cityName}
                        </span>
                      </div>

                      {/* Date and Author */}
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center">
                          <svg
                            className="w-3 h-3 mr-1"
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
                          <span>
                            {experience.createdAt
                              ? new Date(
                                  experience.createdAt
                                ).toLocaleDateString()
                              : "Date not available"}
                          </span>
                        </div>
                        {experience.createdByName && (
                          <span className="truncate ml-2">
                            by {experience.createdByName}
                          </span>
                        )}
                      </div>

                      {/* View Experience Link */}
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <Link
                          to={`/province/${experience.provinceId}/district/${
                            experience.districtId
                          }/city/${encodeURIComponent(experience.cityName)}`}
                          className="text-accent-gold hover:text-navy-blue font-semibold text-sm transition-colors flex items-center"
                        >
                          View Experience
                          <svg
                            className="w-4 h-4 ml-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination - Below Experiences Grid */}
            {totalPages > 1 && (
              <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center space-y-4 lg:space-y-0">
                  {/* Items per Page Selector */}
                  <div className="flex items-center justify-center lg:justify-start">
                    <span className="text-gray-700 text-sm mr-3">
                      Items per page:
                    </span>
                    <select
                      value={itemsPerPage}
                      onChange={(e) =>
                        handleItemsPerPageChange(Number(e.target.value))
                      }
                      className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-gold focus:border-transparent bg-white shadow-sm"
                    >
                      <option value={12}>12</option>
                      <option value={24}>24</option>
                      <option value={36}>36</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                  </div>

                  {/* Pagination Numbers */}
                  <div className="flex flex-wrap justify-center lg:justify-end items-center gap-2">
                    {/* Previous Button */}
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`px-4 py-2 rounded-md text-sm font-semibold transition-all duration-300 flex items-center ${
                        currentPage === 1
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-white text-navy-blue hover:bg-accent-gold border border-gray-300 hover:border-accent-gold"
                      }`}
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
                      Previous
                    </button>

                    {/* Page Numbers */}
                    {getPaginationNumbers().map((page, index) => {
                      if (page === "...") {
                        return (
                          <span
                            key={index}
                            className="px-2 py-2 text-gray-500 text-sm"
                          >
                            ...
                          </span>
                        );
                      }

                      return (
                        <button
                          key={index}
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-2 rounded-md text-sm font-semibold transition-all duration-300 min-w-[40px] ${
                            page === currentPage
                              ? "bg-accent-gold text-navy-blue shadow-md"
                              : "bg-white text-navy-blue hover:bg-accent-gold border border-gray-300 hover:border-accent-gold"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}

                    {/* Next Button */}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`px-4 py-2 rounded-md text-sm font-semibold transition-all duration-300 flex items-center ${
                        currentPage === totalPages
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-white text-navy-blue hover:bg-accent-gold border border-gray-300 hover:border-accent-gold"
                      }`}
                    >
                      Next
                      <svg
                        className="w-4 h-4 ml-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )}
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
