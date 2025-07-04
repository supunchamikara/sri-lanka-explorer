import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../hooks/useToast";
import Toast from "./Toast";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { toast, showSuccess, showError, hideToast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.username ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      showError("Please fill in all fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      showError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      showError("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      const result = await register(
        formData.name,
        formData.username,
        formData.password,
        formData.confirmPassword
      );

      if (result.success) {
        showSuccess("Registration successful! Welcome to Sri Lanka Explorer!");
        setTimeout(() => {
          navigate("/experience");
        }, 1500);
      } else {
        showError(result.message || "Registration failed");
      }
    } catch (error) {
      showError("An error occurred during registration");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-light-gray pt-20 pb-8">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-navy-blue mb-2">
              Join Sri Lanka Explorer
            </h1>
            <p className="text-gray-600">
              Create an account to share your travel experiences
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-navy-blue mb-2"
              >
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-gold focus:border-accent-gold outline-none transition-colors"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-navy-blue mb-2"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-gold focus:border-accent-gold outline-none transition-colors"
                placeholder="Choose a username"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-navy-blue mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-gold focus:border-accent-gold outline-none transition-colors"
                placeholder="Create a password (min. 6 characters)"
                required
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-navy-blue mb-2"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-gold focus:border-accent-gold outline-none transition-colors"
                placeholder="Confirm your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent-gold text-navy-blue font-semibold py-3 px-4 rounded-lg hover:bg-navy-blue hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating Account...
                </div>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-accent-gold hover:text-navy-blue font-medium transition-colors"
              >
                Sign in here
              </Link>
            </p>
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

export default Register;
