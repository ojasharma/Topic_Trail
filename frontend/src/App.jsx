import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeContext"; // Make sure ThemeProvider is imported
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import ClassDetails from "./pages/ClassDetails";
import VideoDetails from "./pages/VideoDetails";

function App() {
  // The theme state and toggle logic will now be handled by the ThemeProvider.
  return (
    <ThemeProvider>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <Navigate to="/login" />
            </Layout>
          }
        />
        <Route
          path="/login"
          element={
            <Layout>
              <Login />
            </Layout>
          }
        />
        <Route
          path="/signup"
          element={
            <Layout>
              <Signup />
            </Layout>
          }
        />
        <Route
          path="/home"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route
          path="/class/:id"
          element={
            <Layout>
              <ClassDetails />
            </Layout>
          }
        />
        <Route
          path="/video/:videoId"
          element={
            <Layout>
              <VideoDetails />
            </Layout>
          }
        />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
