import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../utils/api";

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [experiences, setExperiences] = useState([]);
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsDropdownOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to experiences page with search query
      navigate(`/experience?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setShowSuggestions(false);
    }
  };

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
    if (searchQuery.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleSearchBlur = () => {
    // Delay hiding suggestions to allow clicking on them
    setTimeout(() => {
      setIsSearchFocused(false);
      setShowSuggestions(false);
      setSelectedSuggestionIndex(-1);
    }, 200);
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setSelectedSuggestionIndex(-1);

    if (query.length > 0 && experiences.length > 0) {
      generateSuggestions(query);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || searchSuggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedSuggestionIndex((prev) =>
          prev < searchSuggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedSuggestionIndex((prev) =>
          prev > 0 ? prev - 1 : searchSuggestions.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (selectedSuggestionIndex >= 0) {
          handleSuggestionClick(searchSuggestions[selectedSuggestionIndex]);
        } else {
          handleSearch(e);
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
        break;
    }
  };

  const generateSuggestions = (query) => {
    const lowerQuery = query.toLowerCase();

    // Get unique suggestions from experiences
    const titleSuggestions = experiences
      .filter((exp) => exp.title.toLowerCase().includes(lowerQuery))
      .map((exp) => ({ type: "title", text: exp.title, exp }))
      .slice(0, 3);

    const citySuggestions = experiences
      .filter((exp) => exp.cityName.toLowerCase().includes(lowerQuery))
      .map((exp) => ({ type: "city", text: exp.cityName, exp }))
      .slice(0, 3);

    // Remove duplicates and combine
    const combined = [...titleSuggestions, ...citySuggestions]
      .filter(
        (item, index, self) =>
          index === self.findIndex((t) => t.text === item.text)
      )
      .slice(0, 5);

    setSearchSuggestions(combined);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.text);
    navigate(`/experience?search=${encodeURIComponent(suggestion.text)}`);
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);
    setSearchQuery("");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Load experiences for search suggestions
  useEffect(() => {
    const loadExperiences = async () => {
      try {
        const data = await api.experiences.getAll();
        setExperiences(data);
      } catch (error) {
        console.error("Error loading experiences for search:", error);
      }
    };

    loadExperiences();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-navy-blue shadow-lg fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link
              to="/"
              className="text-accent-gold text-xl font-bold hover:text-white transition-colors duration-200"
            >
              Tapro Sri Lanka
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <div className="relative" ref={searchRef}>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onKeyDown={handleKeyDown}
                  onFocus={handleSearchFocus}
                  onBlur={handleSearchBlur}
                  placeholder="Search experiences..."
                  className={`block w-full pl-10 pr-3 py-2 border border-transparent rounded-md leading-5 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-gold focus:border-accent-gold transition-all duration-200 ${
                    isSearchFocused
                      ? "ring-2 ring-accent-gold border-accent-gold"
                      : "hover:bg-gray-50"
                  }`}
                  autoComplete="off"
                />

                {/* Search Suggestions Dropdown */}
                {showSuggestions && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-64 overflow-y-auto">
                    {searchSuggestions.length > 0
                      ? searchSuggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => handleSuggestionClick(suggestion)}
                            className={`w-full px-4 py-3 text-left border-b border-gray-100 last:border-b-0 flex items-center space-x-3 transition-colors duration-150 ${
                              index === selectedSuggestionIndex
                                ? "bg-accent-gold bg-opacity-10 text-navy-blue"
                                : "hover:bg-gray-50"
                            }`}
                          >
                            <div className="flex-shrink-0">
                              {suggestion.type === "title" ? (
                                <svg
                                  className="w-4 h-4 text-accent-gold"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                  />
                                </svg>
                              ) : (
                                <svg
                                  className="w-4 h-4 text-navy-blue"
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
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-gray-900 truncate">
                                {suggestion.text}
                              </div>
                              <div className="text-xs text-gray-500">
                                {suggestion.type === "title"
                                  ? "Experience"
                                  : "City"}
                                {suggestion.exp.cityName &&
                                  suggestion.type === "title" &&
                                  ` in ${suggestion.exp.cityName}`}
                              </div>
                            </div>
                          </button>
                        ))
                      : searchQuery.length > 0 && (
                          <div className="px-4 py-3 text-sm text-gray-500 text-center">
                            No suggestions found for "{searchQuery}"
                          </div>
                        )}
                  </div>
                )}
              </div>
            </form>
          </div>

          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Mobile Search Icon */}
            <Link
              to="/experience"
              className="md:hidden p-2 text-white hover:text-accent-gold transition-colors duration-200"
              title="Search Experiences"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </Link>

            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                location.pathname === "/"
                  ? "bg-accent-gold text-navy-blue"
                  : "text-white hover:text-accent-gold"
              }`}
            >
              Home
            </Link>

            <Link
              to="/provinces"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                location.pathname === "/provinces" ||
                location.pathname.startsWith("/province")
                  ? "bg-accent-gold text-navy-blue"
                  : "text-white hover:text-accent-gold"
              }`}
            >
              Provinces
            </Link>

            <Link
              to="/experience"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                location.pathname === "/experience"
                  ? "bg-accent-gold text-navy-blue"
                  : "text-white hover:text-accent-gold"
              }`}
            >
              Experiences
            </Link>

            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={toggleDropdown}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-0.5 ${
                    location.pathname.startsWith("/add-experience") ||
                    location.pathname.startsWith("/edit-experience") ||
                    location.pathname === "/profile"
                      ? "bg-accent-gold text-navy-blue"
                      : "text-white hover:text-accent-gold"
                  }`}
                >
                  <span>Welcome, {user?.name}</span>
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                    <Link
                      to="/add-experience"
                      onClick={() => setIsDropdownOpen(false)}
                      className={`block px-4 py-2 text-sm transition-colors duration-200 ${
                        location.pathname.startsWith("/add-experience") ||
                        location.pathname.startsWith("/edit-experience")
                          ? "bg-accent-gold text-navy-blue"
                          : "text-navy-blue hover:bg-light-gray"
                      }`}
                    >
                      Add Experience
                    </Link>
                    <Link
                      to="/profile"
                      onClick={() => setIsDropdownOpen(false)}
                      className={`block px-4 py-2 text-sm transition-colors duration-200 ${
                        location.pathname === "/profile"
                          ? "bg-accent-gold text-navy-blue"
                          : "text-navy-blue hover:bg-light-gray"
                      }`}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-navy-blue hover:bg-light-gray transition-colors duration-200"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/auth"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  location.pathname === "/auth"
                    ? "bg-accent-gold text-navy-blue"
                    : "text-white hover:text-accent-gold"
                }`}
              >
                Login / Register
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
