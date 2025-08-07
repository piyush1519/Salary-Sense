import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { SignIn, SignUp, SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";

import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";

import Home from "./pages/Home";
import DeveloperDashboard from "./pages/DeveloperDashboard";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/common/ProtectedRoute";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        {/* Auth Pages */}
        <Route path="/sign-in" element={<SignIn routing="path" path="/sign-in" />} />
        <Route path="/sign-up" element={<SignUp routing="path" path="/sign-up" />} />

        {/* Home - only signed in users */}
        <Route
          path="/"
          element={
            <>
              <SignedIn>
                <Home />
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            </>
          }
        />

        {/* Developer Route */}
        <Route
          path="/developer"
          element={
            <ProtectedRoute allowedRoles={["developer"]}>
              <DeveloperDashboard />
            </ProtectedRoute>
          }
        />

        {/* Recruiter Route */}
        <Route
          path="/recruiter"
          element={
            <ProtectedRoute allowedRoles={["recruiter"]}>
              <RecruiterDashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin Route */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
