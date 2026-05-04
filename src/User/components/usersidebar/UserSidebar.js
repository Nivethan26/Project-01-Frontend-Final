import React, { useState, useEffect } from "react";
import "./usersidebar.css";
import {
  Dashboard,
  BookOnline,
  WorkOutline,
  EventNote,
  MailOutline,
  PersonOutline,
  ExitToApp,
  Receipt,
  Assignment
} from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";
import { useUserAuth } from "../../utils/useUserAuth";
import Swal from "../../../utils/modernAlert";

export default function UserSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const { username } = useUserAuth();
  
  const [avatarUrl, setAvatarUrl] = useState('https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1');

  useEffect(() => {
    const fetchAvatar = async () => {
      const email = sessionStorage.getItem('email');
      if (!email) return;
      try {
        const res = await fetch(`/Backend/getProfile.php?email=${encodeURIComponent(email)}`);
        const data = await res.json();
        if (data.success && data.user && data.user.profile_photo) {
          setAvatarUrl(`/Backend/${data.user.profile_photo}`);
        }
      } catch (err) {
        console.error("Failed to fetch avatar:", err);
      }
    };

    fetchAvatar();

    const handleAvatarUpdate = () => {
      fetchAvatar();
    };

    window.addEventListener('profilePhotoUpdated', handleAvatarUpdate);
    return () => window.removeEventListener('profilePhotoUpdated', handleAvatarUpdate);
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
        url("https://i.gifer.com/ZZ5H.gif") 
        left top
        no-repeat
      `,
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
    <div className="sidebar">
      <div className="sidebarWrapper">

        {/* Logo Section */}
        <div className="sidebarLogo">
          <h2>AutoCare Lanka</h2>
        </div>

        <div className="sidebarMenu">
          <ul className="sidebarList">

            <Link to="/User" className="link">
              <li className={`sidebarListItem ${currentPath === "/User" || currentPath === "/User/" ? "active" : ""}`}>
                <Dashboard className="sidebarIcon" />
                Dashboard
              </li>
            </Link>

            <Link to="/User/bookings" className="link">
              <li className={`sidebarListItem ${currentPath === "/User/bookings" ? "active" : ""}`}>
                <BookOnline className="sidebarIcon" />
                Bookings
              </li>
            </Link>

            <Link to="/User/applications" className="link">
              <li className={`sidebarListItem ${currentPath === "/User/applications" ? "active" : ""}`}>
                <Assignment className="sidebarIcon" />
                My Applications
              </li>
            </Link>

            <Link to="/User/refund" className="link">
              <li className={`sidebarListItem ${currentPath === "/User/refund" ? "active" : ""}`}>
                <Receipt className="sidebarIcon" />
                Refund Policy
              </li>
            </Link>


            <Link to="/User/messages" className="link">
              <li className={`sidebarListItem ${currentPath === "/User/messages" ? "active" : ""}`}>
                <MailOutline className="sidebarIcon" />
                Messages
              </li>
            </Link>

            <Link to="/User/profile" className="link">
              <li className={`sidebarListItem ${currentPath === "/User/profile" ? "active" : ""}`}>
                <PersonOutline className="sidebarIcon" />
                Profile
              </li>
            </Link>

          </ul>
        </div>

        {/* Bottom Profile and Logout */}
        <div className="sidebarBottom">
          <div className="userProfileInfo">
            <img
              src={avatarUrl}
              alt="Avatar"
              className="bottomAvatar"
            />
            <div className="userDetails">
              <span className="userName">{username || "User"}</span>
            </div>
          </div>

          <button className="logoutBtn" onClick={handleLogout}>
            <ExitToApp className="logoutIcon" /> Logout
          </button>
        </div>

      </div>
    </div>
  );
}
