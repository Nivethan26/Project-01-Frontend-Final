import { toast } from 'react-toastify';
import React, { useState } from "react";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import "./AuthCommon.css";
import "./Login.css";

const API_DEBUG_ENABLED = String(process.env.REACT_APP_API_DEBUG || "false").toLowerCase() === "true";

const Login = () => {
  const navigate = useNavigate();
  const [formError, setFormError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    user: "",
    pass: "",
    rememberMe: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    navigate("/forgot-password");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { user, pass, rememberMe } = formData;

    const loginErrors = {};

    if (!user) {
      loginErrors.user = "Username or email is required.";
    }

    if (!pass) {
      loginErrors.pass = "Password is required.";
    }

    if (Object.keys(loginErrors).length > 0) {
      setFieldErrors(loginErrors);
      setFormError("Please fix the highlighted fields.");
      return;
    }

    setFieldErrors({});

    if (!user || !pass) {
      setFormError("Username/Email and Password are required.");
      return;
    }

    try {
      if (API_DEBUG_ENABLED) {
        console.log('[Login] API call start: /Backend/login.php', { user, rememberMe });
      }
      const response = await axios.post(
        "/Backend/login.php",
        { user, pass, remember: rememberMe },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (API_DEBUG_ENABLED) {
        console.log('[Login] API call success', {
          status: response?.status,
          success: response?.data?.success,
          role: response?.data?.role || response?.data?.userrole,
        });
      }

      const successFlag = response?.data?.success;
      const rawRole = response?.data?.role || response?.data?.userrole;
      const userRole = typeof rawRole === "string" ? rawRole.toLowerCase() : "";
      const userId = response?.data?.user?.id;

      if (successFlag === 0 || successFlag === "0") {
        toast.error(response?.data?.error || "Invalid credentials.");
      } else {
        if (!["admin", "employee", "user"].includes(userRole)) {
          toast.error("Unexpected role returned from server.");
          return;
        }

        setFormError("");
        sessionStorage.removeItem("user-id");
        localStorage.removeItem("userId");

        // Avoid persisting auth state in localStorage. Use server session + cookies.
        sessionStorage.setItem("username", response?.data?.user?.username || user);
        if (response?.data?.user?.email) {
          sessionStorage.setItem("email", response?.data?.user?.email);
        }
        sessionStorage.setItem("user-role", userRole);
        if (userId) {
          sessionStorage.setItem("user-id", String(userId));
        }

        const sessionUsername = sessionStorage.getItem("username");

        ( toast.success(<span>Welcome back, <strong>{sessionUsername}</strong>!</span>), new Promise(res => setTimeout(res, 2000)) ).then(() => {
          const redirectPath = sessionStorage.getItem('redirectAfterLogin');
          if (redirectPath) {
            sessionStorage.removeItem('redirectAfterLogin');
            navigate(redirectPath);
          } else if (userRole === "admin") {
            navigate("/admin");
          } else if (userRole === "employee") {
            navigate("/employee/dashboard");
          } else {
            navigate("/user-dashboard");
          }
        });
      }
    } catch (error) {
      if (API_DEBUG_ENABLED) {
        console.error('[Login] API call failed', {
          status: error?.response?.status,
          message: error?.message,
          data: error?.response?.data,
        });
      }

      toast.error("An error occurred during login. Please try again.");
    }
  };

  return (
    <div className="auth-page login-enterprise-page">
      <div className="login-enterprise-shell">
        <section className="login-brand-panel">
          <img src="/assets/Logo.png" alt="AutoCare Lanka" className="login-brand-logo" />
          <p className="login-brand-kicker">Enterprise Access Portal</p>
          <h1 className="login-brand-title">AutoCare Lanka</h1>
          <p className="login-brand-tagline">Precision. Performance. Perfection.</p>
          <p className="login-brand-description">
            Securely manage bookings, customer operations, and workshop workflows from a
            unified platform built for premium automotive service teams.
          </p>
        </section>

        <section className="login-form-panel">
          <div className="login-card">
            <form onSubmit={handleLogin}>
              <h2 className="login-heading">Sign In</h2>
              <p className="login-subtitle">Access your account (User, Employee & Admin)</p>
              {formError && <div className="auth-form-error">{formError}</div>}
              <div className="auth-input-box">
                <label htmlFor="login-user" className="auth-input-label">Username or Email</label>
                <input
                  id="login-user"
                  type="text"
                  name="user"
                  placeholder="Enter your username or email"
                  value={formData.user}
                  onChange={handleChange}
                  className={fieldErrors.user ? "auth-has-error" : ""}
                  required
                />
                <FaUser className="auth-input-icon" />
                {fieldErrors.user && <span className="auth-input-error">{fieldErrors.user}</span>}
              </div>
              <div className="auth-input-box">
                <label htmlFor="login-pass" className="auth-input-label">Password</label>
                <input
                  id="login-pass"
                  type={showPassword ? "text" : "password"}
                  name="pass"
                  placeholder="Enter your password"
                  value={formData.pass}
                  onChange={handleChange}
                  className={fieldErrors.pass ? "auth-has-error" : ""}
                  required
                />
                <FaLock className="auth-input-icon" />
                <button
                  type="button"
                  className="auth-password-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
                {fieldErrors.pass && <span className="auth-input-error">{fieldErrors.pass}</span>}
              </div>
              <div className="login-remember-forgot">
                <label>
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                  />
                  Remember me
                </label>
                <a href="/forgot-password" onClick={handleForgotPassword} className="login-forgot-password-link">
                  Forgot Password?
                </a>
              </div>
              <button type="submit" className="auth-primary-btn login-submit-btn">Login</button>
              <div className="login-form-divider" aria-hidden="true">
                <span>OR</span>
              </div>
              <div className="login-register-link">
                <p>
                  Don't have an account?{" "}
                  <a
                    href="/register"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate("/register");
                    }}
                  >
                    Register
                  </a>
                </p>
              </div>
            </form>
          </div>
          <p className="login-footer">© {new Date().getFullYear()} AutoCare Lanka. All rights reserved.</p>
        </section>
      </div>
    </div>
  );
};

export default Login;
