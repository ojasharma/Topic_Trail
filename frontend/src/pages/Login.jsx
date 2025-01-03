import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../utils";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../components/ThemeContext";
import styles from "./login.module.css";

const baseUrl = import.meta.env.VITE_BASE_URL;

function Login() {
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const { isDarkMode } = useContext(ThemeContext); // Access theme context
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const copyLoginInfo = { ...loginInfo };
    copyLoginInfo[name] = value;
    setLoginInfo(copyLoginInfo);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return; // Prevent multiple submissions
    const { email, password } = loginInfo;
    if (!email || !password) {
      return handleError("All fields are mandatory.");
    }

    setLoading(true); // Start loading
    try {
      const url = `${baseUrl}auth/login`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginInfo),
      });
      const result = await response.json();
      const { success, message, jwtToken, name, error } = result;
      if (success) {
        handleSuccess(message);
        localStorage.setItem("token", jwtToken);
        localStorage.setItem("loggedInUser", name);
        setTimeout(() => {
          navigate("/home");
        }, 1000);
      } else if (error) {
        const details = error?.details[0]?.message || "Something went wrong.";
        handleError(details);
      } else {
        handleError(message);
      }
    } catch (err) {
      handleError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false); // Stop loading
    }
  };


  return (
    <>
      <img
        src={isDarkMode ? "/logo_dark.png" : "/logo.png"} // Dynamic logo based on theme
        alt="Topic Trail Logo"
        className={styles.logo}
      />
      <div className={styles.page}>
        <div className={styles.formside}>
          <div className={styles.container}>
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
              <div>
                <label
                  htmlFor="email"
                  className={`${
                    isDarkMode ? "text-white" : "text-black"
                  } transition-colors duration-300`}
                >
                  Email address
                </label>
                <input
                  onChange={handleChange}
                  type="email"
                  name="email"
                  autoFocus
                  placeholder="Enter your Email"
                  value={loginInfo.email}
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className={`${
                    isDarkMode ? "text-white" : "text-black"
                  } transition-colors duration-300`}
                >
                  Password
                </label>
                <input
                  onChange={handleChange}
                  type="password"
                  name="password"
                  placeholder="Enter a Password"
                  value={loginInfo.password}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className={`${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#392759] hover:bg-opacity-90"
                } text-white font-roboto py-2 px-4 rounded transition-all duration-300`}
              >
                {loading ? "Logging in..." : "Login"}
              </button>

              <span
                className={`${
                  isDarkMode ? "text-white" : "text-black"
                } transition-colors duration-300`}
              >
                Don't have an account? <Link to="/signup">Signup</Link>
              </span>
            </form>
          </div>
        </div>
        <div className={styles.imgside}>
          <img src="/bg.jpg" alt="bg" className={styles.sideimg} />
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

export default Login;
