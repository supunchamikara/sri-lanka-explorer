import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../hooks/useToast";
import Toast from "./Toast";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const { toast, showSuccess, showError, hideToast } = useToast();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // Login
        if (!formData.username || !formData.password) {
          showError("Please fill in all fields");
          setLoading(false);
          return;
        }

        const result = await login(formData.username, formData.password);
        if (result.success) {
          showSuccess("Login successful!");
          navigate("/");
        } else {
          showError(result.message || "Login failed");
        }
      } else {
        // Register
        if (!formData.name || !formData.username || !formData.password) {
          showError("Please fill in all fields");
          setLoading(false);
          return;
        }

        if (formData.password !== formData.confirmPassword) {
          showError("Passwords do not match");
          setLoading(false);
          return;
        }

        if (formData.password.length < 6) {
          showError("Password must be at least 6 characters long");
          setLoading(false);
          return;
        }

        const result = await register(
          formData.name,
          formData.username,
          formData.password,
          formData.confirmPassword
        );
        if (result.success) {
          showSuccess("Registration successful! You are now logged in.");
          navigate("/");
        } else {
          showError(result.message || "Registration failed");
        }
      }
    } catch (error) {
      showError(
        error.message || `${isLogin ? "Login" : "Registration"} failed`
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      name: "",
      username: "",
      password: "",
      confirmPassword: "",
    });
  };

  return (
    <div className="min-h-screen bg-light-gray pt-20 pb-8 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-navy-blue mb-2">
              {isLogin ? "Welcome Back" : "Join Us"}
            </h1>
            <p className="text-gray-600">
              {isLogin
                ? "Sign in to your account to continue exploring"
                : "Create an account to start sharing your experiences"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-gold focus:border-transparent"
                  placeholder="Enter your full name"
                  required={!isLogin}
                />
              </div>
            )}

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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-gold focus:border-transparent"
                placeholder="Enter your username"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-gold focus:border-transparent"
                placeholder="Enter your password"
                required
              />
            </div>

            {!isLogin && (
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-gold focus:border-transparent"
                  placeholder="Confirm your password"
                  required={!isLogin}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent-gold text-navy-blue py-2 px-4 rounded-md font-medium hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-accent-gold focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? isLogin
                  ? "Signing in..."
                  : "Creating account..."
                : isLogin
                ? "Sign In"
                : "Create Account"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={toggleAuthMode}
                className="ml-2 text-accent-gold hover:text-yellow-600 font-medium transition-colors duration-200"
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>
        </div>
      </div>

      {toast.show && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
    </div>
  );
};

export default Auth;
