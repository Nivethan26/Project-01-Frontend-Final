import React from "react";
import { Routes, Route } from "react-router-dom";
import Calendar from "../bookingStation01/components/Calendar/Calendar";
import Timeslot from "../bookingStation01/components/Timeslot/Timeslot";
import TimeslotForm from "../bookingStation01/components/TimeslotForm/TimeslotForm";

const BookingStation01 = () => {
  return (
    <div className="BookingStation01">
      <Routes>
        <Route path="/timeslot/:date" element={<Timeslot />} />
        <Route path="/" element={<Calendar />} />
      </Routes>
    </div>
  );
};

export default BookingStation01;
