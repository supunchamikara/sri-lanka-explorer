import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Provinces from "./components/Provinces";
import Districts from "./components/Districts";
import Cities from "./components/Cities";
import CityExperiences from "./components/CityExperiences";
import Experience from "./components/Experience";
import AddExperience from "./components/AddExperience";
import Auth from "./components/Auth";
import Profile from "./components/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-light-gray">
          <Navigation />

          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/provinces" element={<Provinces />} />
              <Route path="/province/:provinceId" element={<Districts />} />
              <Route
                path="/province/:provinceId/district/:districtId"
                element={<Cities />}
              />
              <Route
                path="/province/:provinceId/district/:districtId/city/:cityName"
                element={
                  <ProtectedRoute>
                    <CityExperiences />
                  </ProtectedRoute>
                }
              />
              <Route path="/auth" element={<Auth />} />
              <Route
                path="/experience"
                element={
                  <ProtectedRoute>
                    <Experience />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/add-experience"
                element={
                  <ProtectedRoute>
                    <AddExperience />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/edit-experience/:id"
                element={
                  <ProtectedRoute>
                    <AddExperience />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
