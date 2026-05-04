import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaCheckCircle } from "react-icons/fa";
import "./ForgotPassword.css";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      // Backend intentionally returns a generic success message to prevent email enumeration.
      if (!response.ok) {
        throw new Error('Request failed');
      }

      setIsSubmitted(true);

    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const goToLogin = (e) => {
    e?.preventDefault();
    navigate("/login");
  };

  return (
    <div className="fp-page">
      <div className="fp-card">
        {!isSubmitted ? (
          <form onSubmit={handleSubmit} noValidate>
            <h1 className="fp-title">Forgot Password</h1>
            <p className="fp-subtitle">
              Enter your email address and we will send you a password reset link
            </p>

            <div className="fp-input-group">
              <label htmlFor="forgot-email" className="fp-label">
                Email Address
              </label>
              <div className="fp-input-wrap">
                <FaEnvelope className="fp-icon" />
                <input
                  id="forgot-email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) {
                      setError("");
                    }
                  }}
                  className={error ? "fp-input fp-input-error" : "fp-input"}
                  required
                />
              </div>
              {error && <p className="fp-error">{error}</p>}
            </div>

            <button type="submit" className="fp-primary-btn" disabled={loading}>
              {loading ? "Sending..." : "Send Reset Link"}
            </button>

            <div className="fp-back-link-row">
              <a href="/login" onClick={goToLogin} className="fp-back-link">
                Back to Login
              </a>
            </div>
          </form>
        ) : (
          <div className="fp-success">
            <FaCheckCircle className="fp-success-icon" />
            <h2 className="fp-success-title">Email Sent</h2>
            <p className="fp-success-message">
              If this email exists, a password reset link has been sent.
            </p>
            <button type="button" className="fp-primary-btn" onClick={goToLogin}>
              Return to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;