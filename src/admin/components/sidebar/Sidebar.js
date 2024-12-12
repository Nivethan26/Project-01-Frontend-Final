import React, { useState } from "react";
import "./sidebar.css";
import {
  BookOnline,
  LineStyle,
  School,
  Work,
  ContactMail,
  Badge,
} from "@mui/icons-material";
import { Link } from "react-router-dom";

export default function Sidebar() {
  const [activeItem, setActiveItem] = useState(""); // State to track the active item

  const handleItemClick = (item) => {
    setActiveItem(item); // Set the active item when clicked
  };

  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        {/* Booking Section */}
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Booking</h3>
          <ul className="sidebarList">
            <Link to="/admin" className="link" onClick={() => handleItemClick("BookService")}>
              <li className={`sidebarListItem ${activeItem === "BookService" ? "active" : ""}`}>
                <LineStyle className="sidebarIcon" />
                Book A Service
              </li>
            </Link>
          </ul>
        </div>

        {/* Bookings Section */}
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Bookings</h3>
          <ul className="sidebarList">
            <Link to="/admin/bookingList01" className="link" onClick={() => handleItemClick("Station01")}>
              <li className={`sidebarListItem ${activeItem === "Station01" ? "active" : ""}`}>
                <BookOnline className="sidebarIcon" />
                Station-01
              </li>
            </Link>
            <Link to="/admin/bookingList02" className="link" onClick={() => handleItemClick("Station02")}>
              <li className={`sidebarListItem ${activeItem === "Station02" ? "active" : ""}`}>
                <BookOnline className="sidebarIcon" />
                Station-02
              </li>
            </Link>
            <Link to="/admin/bookingList03" className="link" onClick={() => handleItemClick("Station03")}>
              <li className={`sidebarListItem ${activeItem === "Station03" ? "active" : ""}`}>
                <BookOnline className="sidebarIcon" />
                Station-03
              </li>
            </Link>
            <Link to="/admin/bookingList04" className="link" onClick={() => handleItemClick("Station04")}>
              <li className={`sidebarListItem ${activeItem === "Station04" ? "active" : ""}`}>
                <BookOnline className="sidebarIcon" />
                Station-04
              </li>
            </Link>
          </ul>
        </div>

        {/* Applications Section */}
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Applications</h3>
          <ul className="sidebarList">
            <Link to="/admin/courseApply" className="link" onClick={() => handleItemClick("Courses")}>
              <li className={`sidebarListItem ${activeItem === "Courses" ? "active" : ""}`}>
                <School className="sidebarIcon" />
                Courses
              </li>
            </Link>
            <Link to="/admin/jobApply" className="link" onClick={() => handleItemClick("Jobs")}>
              <li className={`sidebarListItem ${activeItem === "Jobs" ? "active" : ""}`}>
                <Work className="sidebarIcon" />
                Jobs
              </li>
            </Link>
          </ul>
        </div>

        {/* Manage Section */}
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Manage</h3>
          <ul className="sidebarList">
            <Link to="/admin/services" className="link" onClick={() => handleItemClick("ManageService")}>
              <li className={`sidebarListItem ${activeItem === "ManageService" ? "active" : ""}`}>
                <School className="sidebarIcon" />
                Manage Service
              </li>
            </Link>
            <Link to="/admin/courses" className="link" onClick={() => handleItemClick("ManageCourse")}>
              <li className={`sidebarListItem ${activeItem === "ManageCourse" ? "active" : ""}`}>
                <School className="sidebarIcon" />
                Manage Course
              </li>
            </Link>
            <Link to="/admin/jobs" className="link" onClick={() => handleItemClick("ManageJob")}>
              <li className={`sidebarListItem ${activeItem === "ManageJob" ? "active" : ""}`}>
                <School className="sidebarIcon" />
                Manage Job
              </li>
            </Link>
          </ul>
        </div>

        {/* Notifications Section */}
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Notifications</h3>
          <ul className="sidebarList">
            <Link to="/admin/messageList" className="link" onClick={() => handleItemClick("Messages")}>
              <li className={`sidebarListItem ${activeItem === "Messages" ? "active" : ""}`}>
                <ContactMail className="sidebarIcon" />
                Messages
              </li>
            </Link>
          </ul>
        </div>

        {/* Staff Section */}
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Staff</h3>
          <ul className="sidebarList">
            <Link to="/admin/adminEm" className="link" onClick={() => handleItemClick("Employees")}>
              <li className={`sidebarListItem ${activeItem === "Employees" ? "active" : ""}`}>
                <Badge className="sidebarIcon" />
                Employees
              </li>
            </Link>
          </ul>
        </div>

        {/* Customers Section */}
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Customers</h3>
          <ul className="sidebarList">
            <Link to="/admin/customer" className="link" onClick={() => handleItemClick("Customers")}>
              <li className={`sidebarListItem ${activeItem === "Customers" ? "active" : ""}`}>
                <Badge className="sidebarIcon" />
                Customers
              </li>
            </Link>
          </ul>
        </div>
      </div>
    </div>
  );
}
