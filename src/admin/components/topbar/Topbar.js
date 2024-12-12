import React, { useState, useEffect } from "react";
import Swal from 'sweetalert2';
import "./topbar.css";
import { NotificationsNone, Language, Settings } from '@mui/icons-material';

export default function Topbar() {

  const [username, setUsername] = useState("");

  useEffect(() => {
    // Fetch the username from the session or API
    const fetchUser = async () => {
      const response = await fetch("http://localhost/Backend/getUser.php");
      const data = await response.json();
      setUsername(data.username);
      const username = sessionStorage.getItem("username");
      if (username) {
        setUsername(username);
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
      confirmButtonText: '<i class="fa fa-sign-out-alt"></i> Yes, logout!',
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
      await fetch("http://localhost/Backend/logout.php", { method: "POST" });
      sessionStorage.clear();
      window.location.href = "/LoginRegister"; // Redirect to login page
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