import React from "react";
import { Routes, Route } from "react-router-dom";
import Calendar from "../bookingStation04/components/Calendar/Calendar";
import Timeslot from "../bookingStation04/components/Timeslot/Timeslot";
import TimeslotForm from "../bookingStation04/components/TimeslotForm/TimeslotForm";

const BookingStation04 = () => {
  return (
    <div className="BookingStation04">
      <Routes>
        <Route path="/timeslot/:date" element={<Timeslot />} />
        <Route path="/" element={<Calendar />} />
      </Routes>
    </div>
  );
};

export default BookingStation04;
