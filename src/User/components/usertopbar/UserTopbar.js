import React, { useState, useEffect } from "react";
import Swal from "../../../utils/modernAlert";
import "./usertopbar.css";
import { NotificationsNone, Language, Settings } from "@mui/icons-material";

export default function UserTopbar() {
  const [username, setUsername] = useState("");

  useEffect(() => {
    // Read from session first, then hydrate from backend session if available.
    const fetchUser = async () => {
      const cachedUsername = sessionStorage.getItem("username");
      if (cachedUsername) {
        setUsername(cachedUsername);
        return;
      }

      try {
        const response = await fetch("/Backend/getUser.php", {
          credentials: "include",
        });

        if (!response.ok) {
          return;
        }

        const data = await response.json();
        const apiUsername = data?.user?.username || data?.username;

        if (apiUsername) {
          setUsername(apiUsername);
          sessionStorage.setItem("username", apiUsername);
        }
      } catch (_) {
        // Keep UI state from sessionStorage if API call fails.
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    // Display confirmation popup with SweetAlert2
    const { isConfirmed } = await Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to logout?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, logout!',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#d33', // Red color for the confirm button
      cancelButtonColor: '#3085d6', // Blue color for the cancel button
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
  
    // If confirmed, perform logout
    if (isConfirmed) {
      try {
        await fetch("/Backend/logout.php", {
          method: "POST",
          credentials: "include",
        });
      } catch (_) {
        // Even if server logout fails, clear local session to avoid stale auth state.
      }

      sessionStorage.clear();
      localStorage.removeItem("userId");
      window.location.href = "/login";
    }
  };
  
  

  return (
    <div className="topbar">
      <div className="topbarWrapper">
        <div className="topLeft">
          <span className="logo">AutoCare Lanka</span>
        </div>
        <div className="topRight">
          <div className="greeting">
            <span>Hi {username}, Welcome!</span>
          </div>
          <div className="topbarIconContainer">
            <NotificationsNone />
            <span className="topIconBadge">2</span>
          </div>
          <div className="topbarIconContainer">
            <Language />
            <span className="topIconBadge">2</span>
          </div>
          <div className="topbarIconContainer">
            <Settings />
          </div>
          <div className="dropdown">
            <img
              src="https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              alt=""
              className="topAvatar"
              onClick={() => document.querySelector('.dropdown-content').classList.toggle('show')}
            />
            <div className="dropdown-content">
              <button onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}