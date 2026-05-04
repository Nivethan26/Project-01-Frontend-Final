import React from "react";
import { Routes, Route } from "react-router-dom";
import UserSidebar from "../User/components/usersidebar/UserSidebar";
import Station from "../User/pages/station/Station";
import ReservationInfo from "../User/pages/reservationInfo/ReservationInfo";
import Messages from "../User/pages/messages/Messages";
import Profile from "../User/pages/profile/Profile";
import MyApplications from "../User/pages/MyApplications/MyApplications";
import UserBookings from "../User/pages/bookings/UserBookings";

import "./User.css";
import "bootstrap/dist/css/bootstrap.min.css";

const User = () => {
  return (
    <>
      <div className="user_container">
        <UserSidebar />
        <div className="user-content">
          <Routes>
            <Route path="/" element={<Station />} /> {/* Default route -> Dashboard */}
            <Route path="/refund" element={<ReservationInfo />} /> {/* Refund Policy */}
            <Route path="/bookings" element={<UserBookings />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/applications" element={<MyApplications />} />
          </Routes>
        </div>
      </div>
    </>
  );
};

export default User;
