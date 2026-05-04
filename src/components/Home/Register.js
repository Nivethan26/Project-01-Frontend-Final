import { toast } from 'react-toastify';
import React, { useState } from "react";
import {
  FaUser,
  FaLock,
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaUserTag,
  FaIdBadge,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import "./AuthCommon.css";
import "./Register.css";

const Register = () => {
  const navigate = useNavigate();
  const [fieldErrors, setFieldErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    user: "",
    email: "",
    pass: "",
    cpass: "",
    role: "user",
    name: "",
    phone: "",
    address: "",
    termsAccepted: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => {
      const nextState = { ...prev, [name]: type === "checkbox" ? checked : value };
      return nextState;
    });
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateUsername = (username) => {
    const usernameRegex = /^[a-zA-Z0-9@_]{4,20}$/;
    return usernameRegex.test(username);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@!?/_-])[A-Za-z\d@!?/_-]{8,20}$/;
    return passwordRegex.test(password);
  };

  const getPasswordStrength = (password) => {
    if (!password) {
      return { label: "No password", score: 0, className: "register-strength-none" };
    }

    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/\d/.test(password)) score += 1;
    if (/[@!?/_-]/.test(password)) score += 1;

    if (score <= 2) {
      return { label: "Weak", score, className: "register-strength-weak" };
    }
    if (score === 3 || score === 4) {
      return { label: "Medium", score, className: "register-strength-medium" };
    }
    return { label: "Strong", score, className: "register-strength-strong" };
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const { user, email, pass, cpass, role, name, phone, address, termsAccepted } = formData;
    setFieldErrors({});

    if (!validateUsername(user)) {
      setFieldErrors({ user: "Please enter a valid username." });
      await ( toast.error("Username must be between 4 and 20 characters and may include letters, numbers, @, and _."), new Promise(res => setTimeout(res, 2000)) );
      return;
    }

    if (!validateEmail(email)) {
      setFieldErrors({ email: "Please enter a valid email address." });
      await ( toast.error("Please enter a valid email address."), new Promise(res => setTimeout(res, 2000)) );
      return;
    }

    if (!validatePassword(pass)) {
      setFieldErrors({ pass: "Please provide a stronger password." });
      await ( toast.error("Password must contain 8 to 20 characters and it should contain at least one uppercase letter, at least one lowercase letter, and at least one special character (@,!,?,/,_,-)."), new Promise(res => setTimeout(res, 2000)) );
      return;
    }

    if (pass !== cpass) {
      setFieldErrors({ cpass: "Passwords do not match." });
      await ( toast.error("Passwords do not match."), new Promise(res => setTimeout(res, 2000)) );
      return;
    }

    if (!["user", "employee"].includes(role)) {
      setFieldErrors({ role: "Please select a valid role." });
      await ( toast.error("Invalid role selected."), new Promise(res => setTimeout(res, 2000)) );
      return;
    }

    const detailErrors = {};
    if (!name.trim()) detailErrors.name = "Full name is required.";
    if (!phone.trim()) detailErrors.phone = "Phone number is required.";
    if (!address.trim()) detailErrors.address = "Address is required.";

    if (Object.keys(detailErrors).length > 0) {
      setFieldErrors(detailErrors);
      await ( toast.error("Please complete all required details."), new Promise(res => setTimeout(res, 2000)) );
      return;
    }

    if (!termsAccepted) {
      await ( toast.error("Please accept the Terms of Use and Privacy Policy to continue."), new Promise(res => setTimeout(res, 2000)) );
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost/Backend/register.php",
        {
          user,
          email,
          pass,
          cpass,
          role,
          name: name.trim(),
          phone: phone.trim(),
          address: address.trim(),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.error) {
        await ( toast.error(response.data.error), new Promise(res => setTimeout(res, 2000)) );
      } else {
        setFieldErrors({});
        setFormData({
          user: "",
          email: "",
          pass: "",
          cpass: "",
          role: "user",
          name: "",
          phone: "",
          address: "",
          termsAccepted: false,
        });

        await ( toast.success("You have successfully registered."), new Promise(res => setTimeout(res, 2000)) );

        navigate("/login");
      }
    } catch (error) {
      console.error("There was an error!", error);
      await ( toast.error("An error occurred during registration. Please try again."), new Promise(res => setTimeout(res, 2000)) );
    }
  };

  const passwordStrength = getPasswordStrength(formData.pass);

  return (
    <div className="auth-page register-enterprise-page">
      <div className="register-enterprise-shell">
        <section className="register-brand-panel">
          <img src="/assets/Logo.png" alt="AutoCare Lanka" className="register-brand-logo" />
          <p className="register-brand-kicker">Enterprise Access Portal</p>
          <h1 className="register-brand-title">AutoCare Lanka</h1>
          <p className="register-brand-tagline">Precision. Performance. Perfection.</p>
          <p className="register-brand-description">
            Create your secure account to manage services, monitor operations, and streamline
            high-performance automotive workflows.
          </p>
        </section>

        <section className="register-form-panel">
          <div className="register-card">
            <form onSubmit={handleRegister}>
              <h2 className="register-heading">Create Account</h2>
              <p className="register-subtitle">Set up your AutoCare Lanka access profile</p>

              <div className="register-form-grid">
                <div className="auth-input-box">
                  <label htmlFor="register-user" className="auth-input-label">Username</label>
                  <input
                    id="register-user"
                    type="text"
                    name="user"
                    placeholder="Create a username"
                    value={formData.user}
                    onChange={handleChange}
                    className={fieldErrors.user ? "auth-has-error" : ""}
                    required
                  />
                  <FaUser className="auth-input-icon" />
                  {fieldErrors.user && <span className="auth-input-error">{fieldErrors.user}</span>}
                </div>

                <div className="auth-input-box">
                  <label htmlFor="register-email" className="auth-input-label">Email</label>
                  <input
                    id="register-email"
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    className={fieldErrors.email ? "auth-has-error" : ""}
                    required
                  />
                  <FaEnvelope className="auth-input-icon" />
                  {fieldErrors.email && <span className="auth-input-error">{fieldErrors.email}</span>}
                </div>

                <div className="auth-input-box">
                  <label htmlFor="register-pass" className="auth-input-label">Password</label>
                  <input
                    id="register-pass"
                    type={showPassword ? "text" : "password"}
                    name="pass"
                    placeholder="Create a password"
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

                <div className="auth-input-box">
                  <label htmlFor="register-cpass" className="auth-input-label">Confirm Password</label>
                  <input
                    id="register-cpass"
                    type={showConfirmPassword ? "text" : "password"}
                    name="cpass"
                    placeholder="Confirm your password"
                    value={formData.cpass}
                    onChange={handleChange}
                    className={fieldErrors.cpass ? "auth-has-error" : ""}
                    required
                  />
                  <FaLock className="auth-input-icon" />
                  <button
                    type="button"
                    className="auth-password-toggle"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                  {fieldErrors.cpass && <span className="auth-input-error">{fieldErrors.cpass}</span>}
                </div>

                <div className="auth-input-box register-grid-span-2">
                  <label className="auth-input-label" htmlFor="register-role">Role</label>
                  <select
                    id="register-role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className={fieldErrors.role ? "auth-has-error" : ""}
                  >
                    <option value="user">User</option>
                    <option value="employee">Employee</option>
                  </select>
                  <FaUserTag className="auth-input-icon" />
                  {fieldErrors.role && <span className="auth-input-error">{fieldErrors.role}</span>}
                </div>
              </div>

              {formData.pass && (
                <div className="register-password-strength">
                  <div className="register-password-strength-meta">
                    <span>Password Strength</span>
                    <strong className={passwordStrength.className}>{passwordStrength.label}</strong>
                  </div>
                  <div className="register-password-strength-track" aria-hidden="true">
                    <div
                      className={`register-password-strength-fill ${passwordStrength.className}`}
                      style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="register-form-grid register-employee-grid">
                <div className="auth-input-box">
                  <label className="auth-input-label">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter full name"
                    value={formData.name}
                    onChange={handleChange}
                    className={fieldErrors.name ? "auth-has-error" : ""}
                    required
                  />
                  <FaIdBadge className="auth-input-icon" />
                  {fieldErrors.name && <span className="auth-input-error">{fieldErrors.name}</span>}
                </div>

                <div className="auth-input-box">
                  <label className="auth-input-label">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    className={fieldErrors.phone ? "auth-has-error" : ""}
                    required
                  />
                  <FaPhone className="auth-input-icon" />
                  {fieldErrors.phone && <span className="auth-input-error">{fieldErrors.phone}</span>}
                </div>

                <div className="auth-input-box register-grid-span-2">
                  <label className="auth-input-label">Address</label>
                  <input
                    type="text"
                    name="address"
                    placeholder="Enter your address"
                    value={formData.address}
                    onChange={handleChange}
                    className={fieldErrors.address ? "auth-has-error" : ""}
                    required
                  />
                  <FaMapMarkerAlt className="auth-input-icon" />
                  {fieldErrors.address && <span className="auth-input-error">{fieldErrors.address}</span>}
                </div>
              </div>

              <div className="register-terms">
                <label>
                  <input
                    type="checkbox"
                    name="termsAccepted"
                    checked={formData.termsAccepted}
                    onChange={handleChange}
                  />
                  I agree to the
                  <a href="/terms" className="register-inline-link"> Terms of Use </a>
                  and
                  <a href="/privacy-policy" className="register-inline-link"> Privacy Policy</a>
                </label>
              </div>

              <button type="submit" name="submit" className="auth-primary-btn register-submit-btn">Register</button>

              <div className="register-login-link">
                <p>
                  Already have an account?{" "}
                  <a
                    href="/login"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate("/login");
                    }}
                  >
                    Login
                  </a>
                </p>
              </div>
            </form>
          </div>
          <p className="register-footer">© {new Date().getFullYear()} AutoCare Lanka. All rights reserved.</p>
        </section>
      </div>
    </div>
  );
};

export default Register;
