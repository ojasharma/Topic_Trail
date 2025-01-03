import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../utils";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../components/ThemeContext"; // Theme Context
import styles from "./signup.module.css";

const baseUrl = import.meta.env.VITE_BASE_URL;

function Signup() {
  const [signupInfo, setSignupInfo] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false); // Track loading state

  const navigate = useNavigate();
  const { isDarkMode } = useContext(ThemeContext); // Access theme context

  const handleChange = (e) => {
    const { name, value } = e.target;
    const copySignupInfo = { ...signupInfo };
    copySignupInfo[name] = value;
    setSignupInfo(copySignupInfo);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const { name, email, password } = signupInfo;
    if (!name || !email || !password) {
      return handleError("All fields are mandatory.");
    }
    setLoading(true); // Set loading state to true
    try {
      const url = `${baseUrl}auth/signup`; // Backend URL
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signupInfo),
      });
      const result = await response.json();
      const { success, message, error } = result;
      if (success) {
        handleSuccess(message);
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } else if (error) {
        const details = error?.details[0].message;
        handleError(details);
      } else if (!success) {
        handleError(message);
      }
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <>
      <img
        src={isDarkMode ? "/logo_dark.png" : "/logo.png"} // Dynamic logo
        alt="Topic Trail Logo"
        className={styles.logo}
      />
      <div className={styles.page}>
        <div className={styles.formside}>
          <div className={styles.container}>
            <h1
              className={`${
                isDarkMode ? "text-white" : "text-black"
              } transition-colors duration-300`}
            >
              Signup
            </h1>
            <form onSubmit={handleSignup}>
              <div>
                <label
                  htmlFor="name"
                  className={`${
                    isDarkMode ? "text-white" : "text-black"
                  } transition-colors duration-300`}
                >
                  Name
                </label>
                <input
                  onChange={handleChange}
                  type="text"
                  name="name"
                  autoFocus
                  placeholder="Enter your name"
                  value={signupInfo.name}
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className={`${
                    isDarkMode ? "text-white" : "text-black"
                  } transition-colors duration-300`}
                >
                  Email
                </label>
                <input
                  onChange={handleChange}
                  type="email"
                  name="email"
                  placeholder="Enter your Email"
                  value={signupInfo.email}
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
                  value={signupInfo.password}
                />
              </div>
              <button
                type="submit"
                disabled={loading} // Disable button while loading
                className={`${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#392759] hover:bg-opacity-90"
                } text-white font-roboto py-2 px-4 rounded transition-all duration-300`}
              >
                {loading ? "Signing up..." : "Signup"}
              </button>
              <span
                className={`${
                  isDarkMode ? "text-white" : "text-black"
                } transition-colors duration-300`}
              >
                Already have an account? <Link to="/login">Login</Link>
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

export default Signup;
