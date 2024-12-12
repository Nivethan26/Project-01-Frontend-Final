import React from 'react';
import Swal from 'sweetalert2';
import { Link, useParams} from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './NavbarEm.css';

const Navbar = () => {
  const { id } = useParams(); // Get the dynamic user ID from URL
  const navigate = useNavigate();
  const handleLogout = async () => {
    
    // Ask for confirmation before logging out
    const { isConfirmed } = await Swal.fire({
        title: 'Logout Confirmation',
        text: "Do you really want to logout?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: '<i class="fa fa-sign-out-alt"></i> Yes, logout!',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#d33', // Red color for confirm button
        cancelButtonColor: '#28a745', // Green color for cancel button
        background: '#f9f9f9', // Soft background color
        backdrop: `
            rgba(0,0,123,0.4)
            url("https://i.gifer.com/ZZ5H.gif") // Background effect with gif
            left top
            no-repeat
        `,
        customClass: {
            title: 'my-title-class', // Custom title style class
            popup: 'my-popup-class', // Custom popup style class
            confirmButton: 'my-confirm-button-class', // Custom button style class
            cancelButton: 'my-cancel-button-class' // Custom cancel button style class
        }
    });

    // If user confirmed logout, perform logout logic
    if (isConfirmed) {
        // Clear session or local storage
        sessionStorage.clear();
        localStorage.clear();

        // Redirect to the login page or home page after logout
        navigate('/Emlogin');
    }
};


  return (
    <nav className="navbar navbar-expand-lg fixed-top">
      <div className="container">
        <Link className="navbar-brand me-auto" to="/">
          <img src="/assets/logo.png" alt="AutoCare Lanka Logo" className="navbar-logo" />
        </Link>
        <div
          className="offcanvas offcanvas-end"
          tabIndex="-1"
          id="offcanvasNavbar"
          aria-labelledby="offcanvasNavbarLabel"
        >
          <div className="offcanvas-header">
            <h5 className="offcanvas-title" id="offcanvasNavbarLabel">
              AutoCare Lanka
            </h5>
            <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
          </div>
          <div className="offcanvas-body">
            <ul className="navbar-nav justify-content-center flex-grow-1 pe-3">
              <li className="nav-item">
                <Link className="nav-link mx-lg-2" to={`/welcome/${id}`}><b>Home</b></Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link mx-lg-2" to={`/profile/${id}`}><b>Profile</b></Link>
              </li>
              <li className="nav-item dropdown">
                <Link
                  className="nav-link dropdown-toggle mx-lg-2"
                  to="#"
                  id="settingsDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <b>Settings</b>
                </Link>
                <ul className="dropdown-menu" aria-labelledby="settingsDropdown">
                  <li>
                    <Link className="dropdown-item" to={`/profileupdate/${id}`}>Profile Update</Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to={`/changePassword/${id}`}>Change Password</Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to={`/history/${id}`}>History</Link>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
        <button onClick={handleLogout} className="login-button">Logout</button>
        <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar">
          <span className="navbar-toggler-icon"></span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;