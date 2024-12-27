import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import ClassDetails from "./pages/ClassDetails";
import VideoDetails from "./pages/VideoDetails";

function App() {
  return (
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
  );
}

export default App;
