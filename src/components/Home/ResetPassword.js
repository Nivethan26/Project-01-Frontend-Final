import { toast } from 'react-toastify';
import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { FaEye, FaEyeSlash, FaLock } from "react-icons/fa";
import "./ResetPassword.css";

const PASSWORD_REGEX = /^(?=\S{8,64}$)(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).*$/;

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const canSubmit = useMemo(() => {
    return Boolean(token) && password.length > 0 && confirmPassword.length > 0 && !loading;
  }, [token, password, confirmPassword, loading]);

  const validate = () => {
    if (!token) {
      return "Invalid reset link.";
    }

    if (!PASSWORD_REGEX.test(password)) {
      return "Password must be 8-64 chars with upper, lower, number, and a special character.";
    }

    if (password !== confirmPassword) {
      return "Passwords do not match.";
    }

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || data?.success === false) {
        throw new Error(data?.error || data?.message || "Reset failed");
      }

      await ( toast.success("Your password has been reset successfully. You can now log in."), new Promise(res => setTimeout(res, 2000)) );

      navigate("/login");
    } catch (err) {
      setError(err?.message || "Invalid or expired token.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rp-page">
      <div className="rp-card">
        <h1 className="rp-title">Reset Password</h1>
        <p className="rp-subtitle">
          Create a new password for your AutoCare Lanka account.
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="rp-input-group">
            <label className="rp-label" htmlFor="rp-pass">New Password</label>
            <div className="rp-input-wrap">
              <FaLock className="rp-icon" />
              <input
                id="rp-pass"
                type={showPassword ? "text" : "password"}
                className={error ? "rp-input rp-input-error" : "rp-input"}
                placeholder="Enter new password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError("");
                }}
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                className="rp-toggle"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="rp-input-group">
            <label className="rp-label" htmlFor="rp-confirm">Confirm Password</label>
            <div className="rp-input-wrap">
              <FaLock className="rp-icon" />
              <input
                id="rp-confirm"
                type={showConfirm ? "text" : "password"}
                className={error ? "rp-input rp-input-error" : "rp-input"}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (error) setError("");
                }}
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                className="rp-toggle"
                onClick={() => setShowConfirm((v) => !v)}
                aria-label={showConfirm ? "Hide password" : "Show password"}
              >
                {showConfirm ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {error && <div className="rp-error">{error}</div>}

          <button type="submit" className="rp-primary-btn" disabled={!canSubmit}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>

          <div className="rp-helper">
            <button
              type="button"
              className="rp-link"
              onClick={() => navigate("/login")}
            >
              Back to Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
