import React from "react";
import { Routes, Route } from "react-router-dom";
import UserSidebar from "../User/components/usersidebar/UserSidebar";
import UserTopbar from "../User/components/usertopbar/UserTopbar";
import Station from "../User/pages/station/Station";
import ReservationInfo from "../User/pages/reservationInfo/ReservationInfo";

import "./User.css";
import "bootstrap/dist/css/bootstrap.min.css";

const User = () => {
  return (
    <>
      <UserTopbar />
      <div className="user_container">
        <UserSidebar />
        <Routes>
          <Route path="/" element={<Station />} /> {/* Default route */}
          <Route path="/ReservationInfo" element={<ReservationInfo />} />
          {/* <Route path="/employees" element={<EmployeesList />} />
          <Route path="/employee/:employeeId" element={<Employee />} />
          <Route path="/newEmployee" element={<NewEmployee />} /> */}
        </Routes>
      </div>
    </>
  );
};

export default User;
