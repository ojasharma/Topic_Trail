import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../utils";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../components/ThemeContext";
import styles from "./login.module.css";

function Login() {
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const { isDarkMode } = useContext(ThemeContext); // Access theme context

  const handleChange = (e) => {
    const { name, value } = e.target;
    const copyLoginInfo = { ...loginInfo };
    copyLoginInfo[name] = value;
    setLoginInfo(copyLoginInfo);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = loginInfo;
    if (!email || !password) {
      return handleError("All fields are mandatory.");
    }
    try {
      const url = "http://localhost:8080/auth/login"; //backend url
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
        const details = error?.details[0].message;
        handleError(details);
      } else if (!success) {
        handleError(message);
      }
    } catch (err) {
      handleError(err);
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
                <label htmlFor="email">Email address</label>
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
                <label htmlFor="password">Password</label>
                <input
                  onChange={handleChange}
                  type="password"
                  name="password"
                  placeholder="Enter a Password"
                  value={loginInfo.password}
                />
              </div>
              <button type="submit">Login</button>
              <span>
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
