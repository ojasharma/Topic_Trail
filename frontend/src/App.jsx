import React from "react";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeContext";
import Layout from "./components/Layout";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import ClassDetails from "./pages/ClassDetails";
import VideoDetails from "./pages/VideoDetails";

function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
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
