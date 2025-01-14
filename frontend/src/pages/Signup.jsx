import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../utils";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../components/ThemeContext";
import styles from "./signup.module.css";
import OTPModal from "../components/OTPmodal"; // Import the new OTP Modal

const baseUrl = import.meta.env.VITE_BASE_URL;

function Signup() {
  const [signupInfo, setSignupInfo] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);

  const navigate = useNavigate();
  const { isDarkMode } = useContext(ThemeContext);

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
    setLoading(true);
    try {
      const url = `${baseUrl}auth/signup`;
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
        handleSuccess("Signup successful! Please verify your email.");
        setShowOTPModal(true); // Show OTP modal instead of redirecting
      } else if (error) {
        const details = error?.details[0].message;
        handleError(details);
      } else if (!success) {
        handleError(message);
      }
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (otpString) => {
    try {
      const response = await fetch(`${baseUrl}auth/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: signupInfo.email,
          otp: otpString,
        }),
      });
      const result = await response.json();
      if (result.success) {
        handleSuccess("Email verified successfully!");
        setShowOTPModal(false);
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } else {
        handleError(result.message || "Invalid OTP");
      }
    } catch (err) {
      handleError("Failed to verify OTP");
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
      <OTPModal
        isOpen={showOTPModal}
        onClose={() => setShowOTPModal(false)}
        email={signupInfo.email}
        onVerify={handleVerifyOTP}
      />
      <ToastContainer />
    </>
  );
}

export default Signup;
