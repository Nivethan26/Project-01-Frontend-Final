import React, { useState } from "react";
import "./usersidebar.css";
import {
  BookOnline,
  LineStyle,
} from "@mui/icons-material";
import { Link } from "react-router-dom";

export default function UserSidebar() {
  const [activeItem, setActiveItem] = useState("BookService");

  const handleItemClick = (item) => {
    setActiveItem(item);
  };

  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Booking</h3>
          <ul className="sidebarList">
            <Link to="/User" className="link" onClick={() => handleItemClick("BookService")}>
            <li className={`sidebarListItem ${activeItem === "BookService" ? "active" : ""}`}>
                <LineStyle className="sidebarIcon" />
                Book A Service
              </li>
            </Link>
          </ul>
        </div>

        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Refund</h3>
          <ul className="sidebarList">
            <Link to="/User/ReservationInfo" className="link" onClick={() => handleItemClick("ReservationInfo")}>
            <li className={`sidebarListItem ${activeItem === "ReservationInfo" ? "active" : ""}`}>
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
