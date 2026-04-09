import React from "react";
import "./usersidebar.css";
import {
  BookOnline,
  LineStyle,
} from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";

export default function UserSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Booking</h3>
          <ul className="sidebarList">
            <Link to="/User" className="link">
              <li className={`sidebarListItem ${currentPath === "/User" || currentPath === "/User/" ? "active" : ""}`}>
                <LineStyle className="sidebarIcon" />
                Book A Service
              </li>
            </Link>
          </ul>
        </div>

        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Refund</h3>
          <ul className="sidebarList">
            <Link to="/User/ReservationInfo" className="link">
              <li className={`sidebarListItem ${currentPath === "/User/ReservationInfo" ? "active" : ""}`}>
                <BookOnline className="sidebarIcon" />
                Refund Policy
              </li>
            </Link>
          </ul>
        </div>
      </div>
    </div>
  );
}
