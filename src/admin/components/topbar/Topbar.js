import React, { useState, useEffect, useRef } from "react";
import Swal from "../../../utils/modernAlert";
import "./topbar.css";
import { NotificationsNone, Language, Settings } from '@mui/icons-material';

export default function Topbar() {

  const [username, setUsername] = useState("");
  const hasFetchedUser = useRef(false);

  useEffect(() => {
    if (hasFetchedUser.current) {
      return;
    }
    hasFetchedUser.current = true;

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
        const apiUsername = data?.user?.username;
        if (apiUsername) {
          setUsername(apiUsername);
          sessionStorage.setItem("username", apiUsername);
        }
      } catch (_) {
        // Keep current UI state from sessionStorage if API call fails.
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
      confirmButtonText: 'Yes, logout',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      reverseButtons: true,
    });
  
    // If confirmed, perform logout
    if (isConfirmed) {
      await fetch("/Backend/logout.php", {
        method: "POST",
        credentials: "include",
      });
      sessionStorage.clear();
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