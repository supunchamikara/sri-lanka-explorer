import React, { useState } from "react";
import { api } from "../utils/api";

const DatabaseTest = () => {
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    try {
      const result = await api.testConnection();
      setConnectionStatus({
        status: "success",
        message: "Database connection successful!",
        data: result,
      });
    } catch (error) {
      setConnectionStatus({
        status: "error",
        message: "Database connection failed!",
        error: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const testHealth = async () => {
    setLoading(true);
    try {
      const result = await api.healthCheck();
      setConnectionStatus({
        status: "success",
        message: "API Health check successful!",
        data: result,
      });
    } catch (error) {
      setConnectionStatus({
        status: "error",
        message: "API Health check failed!",
        error: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-light-gray pt-20 pb-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-navy-blue mb-4">
            Database Connection Test
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Test the connection to MongoDB Atlas database
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex justify-center space-x-4 mb-8">
            <button
              onClick={testConnection}
              disabled={loading}
              className="px-6 py-3 bg-accent-gold text-navy-blue font-semibold rounded-lg hover:bg-navy-blue hover:text-white transition-all duration-300 disabled:opacity-50"
            >
              {loading ? "Testing..." : "Test Database Connection"}
            </button>

            <button
              onClick={testHealth}
              disabled={loading}
              className="px-6 py-3 bg-navy-blue text-white font-semibold rounded-lg hover:bg-accent-gold hover:text-navy-blue transition-all duration-300 disabled:opacity-50"
            >
              {loading ? "Testing..." : "Test API Health"}
            </button>
          </div>

          {connectionStatus && (
            <div
              className={`p-6 rounded-lg ${
                connectionStatus.status === "success"
                  ? "bg-green-50 border border-green-200"
                  : "bg-red-50 border border-red-200"
              }`}
            >
              <div className="flex items-center mb-4">
                {connectionStatus.status === "success" ? (
                  <svg
                    className="w-6 h-6 text-green-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-6 h-6 text-red-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
                <h3
                  className={`text-lg font-semibold ${
                    connectionStatus.status === "success"
                      ? "text-green-800"
                      : "text-red-800"
                  }`}
                >
                  {connectionStatus.message}
                </h3>
              </div>

              {connectionStatus.data && (
                <div className="bg-gray-100 p-4 rounded-md">
                  <h4 className="font-medium text-gray-700 mb-2">
                    Response Data:
                  </h4>
                  <pre className="text-sm text-gray-600 overflow-x-auto">
                    {JSON.stringify(connectionStatus.data, null, 2)}
                  </pre>
                </div>
              )}

              {connectionStatus.error && (
                <div className="bg-red-100 p-4 rounded-md">
                  <h4 className="font-medium text-red-700 mb-2">
                    Error Details:
                  </h4>
                  <p className="text-sm text-red-600">
                    {connectionStatus.error}
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="mt-8 text-center">
            <h3 className="text-lg font-semibold text-navy-blue mb-4">
              Connection Instructions:
            </h3>
            <div className="text-left bg-gray-50 p-4 rounded-md">
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                <li>Make sure the backend server is running on port 5000</li>
                <li>
                  Navigate to the backend directory:{" "}
                  <code className="bg-gray-200 px-1 rounded">cd backend</code>
                </li>
                <li>
                  Install dependencies:{" "}
                  <code className="bg-gray-200 px-1 rounded">npm install</code>
                </li>
                <li>
                  Start the server:{" "}
                  <code className="bg-gray-200 px-1 rounded">npm run dev</code>
                </li>
                <li>
                  Click "Test Database Connection" to verify MongoDB Atlas
                  connection
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatabaseTest;
