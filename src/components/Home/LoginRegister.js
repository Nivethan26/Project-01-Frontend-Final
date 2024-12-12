import React, { useState } from "react";
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import axios from "axios";
import "./LoginRegister.css";

const LoginRegister = () => {
  const [action, setAction] = useState("");
  const [formError, setFormError] = useState("");
  const [formData, setFormData] = useState({
    user: "",
    email: "",
    pass: "",
    cpass: "",
    rememberMe: false,
  });

  const navigate = useNavigate();

  const registerLink = () => {
    setAction(" active");
    setFormError("");
  };

  const loginLink = () => {
    setAction("");
    setFormError("");
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
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
  

const handleRegister = async (e) => {
    e.preventDefault();
    const { user, email, pass, cpass } = formData;

    // Validate the form data
    if (!validateUsername(user)) {
      setFormError(
        "Username must be between 4 and 20 characters and may include letters, numbers, @, and _."
      );
      return;
    }

    if (!validateEmail(email)) {
      setFormError("Please enter a valid email address.");
      return;
    }

    if (!validatePassword(pass)) {
      setFormError(
        "Password must contain 8 to 20 characters and it should contain at least one uppercase letter, at least one lowercase letter, and at least one special character (@,!,?,/,_,-)."
      );
      return;
    }

    if (pass !== cpass) {
      setFormError("Password does not match!");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost/Backend/register.php",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.error) {
        setFormError(response.data.error);
      } else {
        setFormError("");
        setFormData({
          user: "",
          email: "",
          pass: "",
          cpass: "",
          rememberMe: false,
        });

        // SweetAlert2 popup for successful registration
        await Swal.fire({
          title: 'Registration Successful!',
          text: 'You have successfully registered.',
          icon: 'success',
          confirmButtonText: 'OK'
        });

        navigate("/LoginRegister");
      }
    } catch (error) {
      console.error("There was an error!", error);
      setFormError("An error occurred during registration. Please try again.");
    }
};


const handleLogin = async (e) => {
  e.preventDefault();
  const { user, pass, rememberMe } = formData;

  if (!user || !pass) {
    setFormError("Username and Password are required.");
    return;
  }

  try {
    const response = await axios.post(
      "http://localhost/Backend/login.php",
      { user, pass, rememberMe },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Check the success status
    if (response.data.success === 0) {
      // Display error popup without the loading style
      Swal.fire({
        title: 'Login Failed',
        text: response.data.error,
        icon: 'error',
        confirmButtonText: 'Try Again',
        confirmButtonColor: '#e74c3c',
      });
    } else {
      console.log(response.data.userrole)
      // Successful login
      setFormError("");
      sessionStorage.setItem("username", user);
      sessionStorage.setItem("user-role", response.data.userrole);

      const sessionUsername = sessionStorage.getItem("username");
      const sessionUserRole = sessionStorage.getItem("user-role");

      // Display success popup without the loading style
      Swal.fire({
        title: 'Login Successful!',
        html: `Welcome back, <strong>${sessionUsername}</strong>!`,
        icon: 'success',
        confirmButtonText: 'Continue',
        confirmButtonColor: '#28a745',
      }).then(() => {
        // Navigate based on user role
        if (response.data.userrole === "admin") {
          navigate("/admin");
        } else if (response.data.userrole === "user") {
          navigate("/User");
        } else {
          navigate("/Default");
        }
      });
    }
  } catch (error) {
    console.error("There was an error!", error);

    // Display error popup for unexpected errors without the loading style
    Swal.fire({
      title: 'Login Error!',
      text: 'An error occurred during login. Please try again.',
      icon: 'error',
      confirmButtonText: 'Retry',
      confirmButtonColor: '#e74c3c',
    });
  }
};


  

  return (
    <div className="body">
      <div className={`wrapper1 ${action}`}>
        <div className="form-box login">
          <form onSubmit={handleLogin}>
            <h1>Login</h1>
            {formError && <div className="form-error">{formError}</div>}
            <div className="input-box">
              <input
                type="text"
                name="user"
                placeholder="Username"
                value={formData.user}
                onChange={handleChange}
                required
              />
              <FaUser className="icon1" />
            </div>
            <div className="input-box">
              <input
                type="password"
                name="pass"
                placeholder="Password"
                value={formData.pass}
                onChange={handleChange}
                required
              />
              <FaLock className="icon1" />
            </div>
            <div className="remember-forgot">
              <label>
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                />
                Remember me
              </label>
            </div>
            <button type="submit">Login</button>
            <div className="register-link">
              <p>
                Don't have an account?{" "}
                <a href="#" onClick={registerLink}>
                  Register
                </a>
              </p>
            </div>
            <div className="register-link">
              <p>
                
                <a href="/emLogin" >
                  Login as Employee
                </a>
              </p>
            </div>
          </form>
        </div>
        <div className="form-box register">
          <form onSubmit={handleRegister}>
            <h1>Register</h1>
            {formError && <div className="form-error">{formError}</div>}
            <div className="input-box">
              <input
                type="text"
                name="user"
                placeholder="Username"
                value={formData.user}
                onChange={handleChange}
                required
              />
              <FaUser className="icon1" />
            </div>
            <div className="input-box">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <FaEnvelope className="icon1" />
            </div>
            <div className="input-box">
              <input
                type="password"
                name="pass"
                placeholder="Password"
                value={formData.pass}
                onChange={handleChange}
                required
              />
              <FaLock className="icon1" />
            </div>
            <div className="input-box">
              <input
                type="password"
                name="cpass"
                placeholder="Confirm Password"
                value={formData.cpass}
                onChange={handleChange}
                required
              />
              <FaLock className="icon1" />
            </div>
            <div className="remember-forgot">
              <label>
                <input type="checkbox" />I agree to the{" "}
                <b>Terms of Use & Privacy Policy</b>
              </label>
            </div>
            <button type="submit" name="submit">
              Register
            </button>
            <div className="register-link">
              <p>
                Already have an account?{" "}
                <a href="#" onClick={loginLink}>
                  Login
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginRegister;
