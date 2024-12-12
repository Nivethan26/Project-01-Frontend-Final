import React from "react";
import { Routes, Route } from "react-router-dom";
import Calendar from "../bookingStation02/components/Calendar/Calendar";
import Timeslot from "../bookingStation02/components/Timeslot/Timeslot";
import TimeslotForm from "../bookingStation02/components/TimeslotForm/TimeslotForm";

const BookingStation02 = () => {
  return (
    <div className="BookingStation02">
      <Routes>
        <Route path="/timeslot/:date" element={<Timeslot />} />
        <Route path="/" element={<Calendar />} />
      </Routes>
    </div>
  );
};

export default BookingStation02;
