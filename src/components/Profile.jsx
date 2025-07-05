import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../hooks/useToast";
import Toast from "./Toast";
import { API_BASE_URL } from "../utils/api";

const Profile = () => {
  const { user, isAuthenticated, updateUser } = useAuth();
  const { toast, showSuccess, showError, hideToast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userExperiences, setUserExperiences] = useState([]);
  const [experiencesLoading, setExperiencesLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        username: user.username,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  }, [user]);

  // Load user's experiences
  useEffect(() => {
    const loadUserExperiences = async () => {
      try {
        setExperiencesLoading(true);
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_BASE_URL}/experiences`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          // Filter experiences created by current user
          const myExperiences = data.data.filter(
            (exp) => exp.createdBy === user?.id || exp.createdBy === user?._id
          );
          setUserExperiences(myExperiences);
        }
      } catch (error) {
        console.error("Error loading user experiences:", error);
      } finally {
        setExperiencesLoading(false);
      }
    };

    if (user && isAuthenticated) {
      loadUserExperiences();
    }
  }, [user, isAuthenticated]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      showError("Name is required");
      return;
    }

    // If changing password, validate it
    if (formData.newPassword) {
      if (!formData.currentPassword) {
        showError("Current password is required to change password");
        return;
      }
      if (formData.newPassword !== formData.confirmPassword) {
        showError("New passwords do not match");
        return;
      }
      if (formData.newPassword.length < 6) {
        showError("New password must be at least 6 characters");
        return;
      }
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const updateData = {
        name: formData.name,
      };

      // Only include password fields if user wants to change password
      if (formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (data.status === "success") {
        showSuccess("Profile updated successfully!");
        setIsEditing(false);
        // Clear password fields
        setFormData({
          ...formData,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        // Update user in context
        updateUser(data.data.user);
      } else {
        showError(data.message || "Failed to update profile");
      }
    } catch (error) {
      showError("An error occurred while updating profile");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-light-gray pt-20 pb-8 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-navy-blue mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-gray pt-20 pb-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-navy-blue mb-2">My Profile</h1>
          <p className="text-lg text-gray-600">
            Manage your account settings and view your travel experiences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-navy-blue">
                  Profile Information
                </h2>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-accent-gold text-navy-blue rounded-lg hover:bg-navy-blue hover:text-white transition-colors"
                  >
                    Edit Profile
                  </button>
                )}
              </div>

              {isEditing ? (
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-navy-blue mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-gold focus:border-accent-gold outline-none transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-navy-blue mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      value={formData.username}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                      disabled
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Username cannot be changed
                    </p>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold text-navy-blue mb-4">
                      Change Password (Optional)
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-navy-blue mb-2">
                          Current Password
                        </label>
                        <input
                          type="password"
                          name="currentPassword"
                          value={formData.currentPassword}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-gold focus:border-accent-gold outline-none transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-navy-blue mb-2">
                          New Password
                        </label>
                        <input
                          type="password"
                          name="newPassword"
                          value={formData.newPassword}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-gold focus:border-accent-gold outline-none transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-navy-blue mb-2">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-gold focus:border-accent-gold outline-none transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-4 pt-6">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-accent-gold text-navy-blue font-semibold py-3 px-4 rounded-lg hover:bg-navy-blue hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? "Updating..." : "Update Profile"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({
                          name: user.name,
                          username: user.username,
                          currentPassword: "",
                          newPassword: "",
                          confirmPassword: "",
                        });
                      }}
                      className="flex-1 bg-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Full Name
                    </label>
                    <p className="text-lg text-navy-blue font-medium">
                      {user?.name}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Username
                    </label>
                    <p className="text-lg text-navy-blue font-medium">
                      @{user?.username}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Member Since
                    </label>
                    <p className="text-lg text-navy-blue font-medium">
                      {user?.createdAt
                        ? new Date(user.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "Unknown"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Profile Stats */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-navy-blue mb-4">
                Your Statistics
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Experiences</span>
                  <span className="text-2xl font-bold text-accent-gold">
                    {userExperiences.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Places Visited</span>
                  <span className="text-2xl font-bold text-accent-gold">
                    {
                      new Set(
                        userExperiences.map(
                          (exp) =>
                            `${exp.provinceName}-${exp.districtName}-${exp.cityName}`
                        )
                      ).size
                    }
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Provinces Explored</span>
                  <span className="text-2xl font-bold text-accent-gold">
                    {
                      new Set(userExperiences.map((exp) => exp.provinceName))
                        .size
                    }
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-navy-blue mb-4">
                Recent Activity
              </h3>
              {experiencesLoading ? (
                <p className="text-gray-500">Loading...</p>
              ) : userExperiences.length > 0 ? (
                <div className="space-y-3">
                  {userExperiences.slice(0, 3).map((exp) => (
                    <div
                      key={exp._id || exp.id}
                      className="border-l-4 border-accent-gold pl-3"
                    >
                      <p className="font-medium text-navy-blue text-sm">
                        {exp.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {exp.cityName} •{" "}
                        {new Date(exp.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">
                  No experiences shared yet
                </p>
              )}
            </div>
          </div>
        </div>

        {/* User's Experiences */}
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-navy-blue mb-6">
              My Travel Experiences ({userExperiences.length})
            </h2>

            {experiencesLoading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Loading your experiences...</p>
              </div>
            ) : userExperiences.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userExperiences.map((experience) => (
                  <div
                    key={experience._id || experience.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    {experience.images && experience.images.length > 0 && (
                      <img
                        src={experience.images[0]}
                        alt={experience.title}
                        className="w-full h-32 object-cover rounded-md mb-3"
                      />
                    )}
                    <h3 className="font-semibold text-navy-blue mb-2">
                      {experience.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {experience.cityName}, {experience.districtName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(experience.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">
                  You haven't shared any travel experiences yet
                </p>
                <a
                  href="/add-experience"
                  className="inline-flex items-center px-4 py-2 bg-accent-gold text-navy-blue rounded-lg hover:bg-navy-blue hover:text-white transition-colors"
                >
                  Share Your First Experience
                </a>
              </div>
            )}
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

export default Profile;
