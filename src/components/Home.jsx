import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../hooks/useToast";
import Toast from "./Toast";

const Home = () => {
  const [recentExperiences, setRecentExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroImageIndex, setHeroImageIndex] = useState(0);
  const [selectedImages, setSelectedImages] = useState({}); // Track selected image for each experience
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast, showError, hideToast } = useToast();

  // Hero images for the carousel
  const heroImages = [
    "https://www.andbeyond.com/wp-content/uploads/sites/5/colombo-sri-lanka.jpg",
    "https://groundviews.org/wp-content/uploads/2024/01/Sahan-Gooneratne-Wildlife-Photograpy.jpg",
    "https://www.yogawinetravel.com/wp-content/uploads/2016/05/Sigiriya-Lion-Rock-drone-photo-in-Sri-Lanka.jpg",
    "https://www.andbeyond.com/wp-content/uploads/sites/5/Ruwanwelisaya-Stupa-Anuradhapura-golden-triangle-sri-lanka.jpg",
  ];

  // Auto-rotate hero images
  useEffect(() => {
    const interval = setInterval(() => {
      setHeroImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  // Load recent experiences for all users
  useEffect(() => {
    const loadRecentExperiences = async () => {
      try {
        setLoading(true);
        const data = await api.experiences.getAll();
        // Get the last 8 experiences
        const recent = data.slice(0, 8);
        setRecentExperiences(recent);
      } catch (error) {
        console.error("Error loading recent experiences:", error);
        if (
          error.message &&
          error.message.includes("Authentication required")
        ) {
          // Don't show error for unauthenticated users on home page
          setRecentExperiences([]);
        } else {
          showError("Failed to load recent experiences");
        }
      } finally {
        setLoading(false);
      }
    };

    loadRecentExperiences();
  }, [showError]);

  const handleExploreClick = () => {
    if (isAuthenticated) {
      navigate("/experience");
    } else {
      navigate("/auth");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Date not available";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Date not available";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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
    <div className="min-h-screen bg-light-gray">
      {/* Hero Section */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Images */}
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-2000 ease-in-out ${
              index === heroImageIndex ? "opacity-100" : "opacity-0"
            }`}
            style={{
              backgroundImage: `url(${image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        ))}

        {/* Overlay */}
        <div className="absolute inset-0 bg-navy-blue bg-opacity-60" />

        {/* Content */}
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in-up">
            Explore Beautiful
            <span className="text-accent-gold block animate-fade-in-up animation-delay-200">
              Sri Lanka
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-white mb-8 animate-fade-in-up animation-delay-400 leading-relaxed">
            Discover hidden gems, share your adventures, and connect with fellow
            travelers exploring the pearl of the Indian Ocean.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-600">
            <Link
              to="/provinces"
              className="bg-accent-gold text-navy-blue px-8 py-4 rounded-lg font-semibold text-lg hover:bg-yellow-500 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Browse Provinces
            </Link>
            <button
              onClick={handleExploreClick}
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-navy-blue transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {isAuthenticated ? "View Experiences" : "Join Community"}
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="animate-fade-in-up">
              <div className="text-4xl font-bold text-accent-gold mb-2">9</div>
              <div className="text-navy-blue font-semibold">Provinces</div>
              <div className="text-gray-600">to explore</div>
            </div>
            <div className="animate-fade-in-up animation-delay-200">
              <div className="text-4xl font-bold text-accent-gold mb-2">25</div>
              <div className="text-navy-blue font-semibold">Districts</div>
              <div className="text-gray-600">with unique cultures</div>
            </div>
            <div className="animate-fade-in-up animation-delay-400">
              <div className="text-4xl font-bold text-accent-gold mb-2">
                {recentExperiences.length}+
              </div>
              <div className="text-navy-blue font-semibold">Experiences</div>
              <div className="text-gray-600">shared by travelers</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Experiences Section */}
      <div className="py-16 bg-light-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-navy-blue mb-4 animate-fade-in-up">
              Recent Adventures
            </h2>
            <p className="text-xl text-gray-600 animate-fade-in-up animation-delay-200">
              Discover the latest experiences shared by our community
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-gold"></div>
            </div>
          ) : recentExperiences.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentExperiences.map((experience, index) => {
                const experienceId = experience._id || experience.id;
                const selectedImageIndex = getSelectedImageIndex(experienceId);
                const hasMultipleImages =
                  experience.images && experience.images.length > 1;

                return (
                  <Link
                    key={experienceId}
                    to={`/province/${experience.provinceId}/district/${
                      experience.districtId
                    }/city/${encodeURIComponent(experience.cityName)}`}
                    className="block"
                  >
                    <div
                      className={`bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300 hover:shadow-2xl animate-fade-in-up cursor-pointer`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {experience.images && experience.images.length > 0 && (
                        <div className="relative">
                          {/* Main Image */}
                          <div className="h-48 overflow-hidden">
                            <img
                              src={experience.images[selectedImageIndex]}
                              alt={experience.title}
                              className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                            />
                          </div>

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
                                      alt={`${experience.title} ${
                                        imgIndex + 1
                                      }`}
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
                      <div className="p-6">
                        <h3 className="font-bold text-lg text-navy-blue mb-2 line-clamp-2">
                          {experience.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                          {experience.description}
                        </p>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-accent-gold font-semibold">
                            {experience.cityName}
                          </span>
                          <span className="text-gray-500">
                            {formatDate(experience.createdAt)}
                          </span>
                        </div>
                        {experience.createdByName && (
                          <div className="mt-3 text-xs text-gray-500">
                            by {experience.createdByName}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🌟</div>
              <h3 className="text-xl font-semibold text-navy-blue mb-2">
                No experiences yet
              </h3>
              <p className="text-gray-600 mb-6">
                {isAuthenticated
                  ? "Be the first to share your Sri Lankan adventure!"
                  : "Join our community to share your Sri Lankan adventures!"}
              </p>
              {isAuthenticated ? (
                <Link
                  to="/add-experience"
                  className="bg-accent-gold text-navy-blue px-6 py-3 rounded-lg font-semibold hover:bg-yellow-500 transform hover:scale-105 transition-all duration-300"
                >
                  Share Your Experience
                </Link>
              ) : (
                <Link
                  to="/auth"
                  className="bg-accent-gold text-navy-blue px-6 py-3 rounded-lg font-semibold hover:bg-yellow-500 transform hover:scale-105 transition-all duration-300"
                >
                  Join Community
                </Link>
              )}
            </div>
          )}

          {recentExperiences.length > 0 && (
            <div className="text-center mt-12">
              <Link
                to="/experience"
                className="bg-navy-blue text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-900 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                View All Experiences
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Call to Action for Non-authenticated Users */}
      {!isAuthenticated && (
        <div className="py-16 bg-navy-blue">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-white mb-6 animate-fade-in-up">
              Join Our Travel Community
            </h2>
            <p className="text-xl text-gray-300 mb-8 animate-fade-in-up animation-delay-200">
              Share your experiences, discover hidden gems, and connect with
              fellow travelers exploring the beauty of Sri Lanka.
            </p>
            <Link
              to="/auth"
              className="bg-accent-gold text-navy-blue px-8 py-4 rounded-lg font-semibold text-lg hover:bg-yellow-500 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl animate-fade-in-up animation-delay-400"
            >
              Get Started Today
            </Link>
          </div>
        </div>
      )}

      {toast.show && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
    </div>
  );
};

export default Home;
