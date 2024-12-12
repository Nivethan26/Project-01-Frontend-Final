import React from "react";
import { Routes, Route } from "react-router-dom";
// import Calendar from "../bookingStation03/components/Calendar/Calendar";
// import Timeslot from "../bookingStation03/components/Timeslot/Timeslot";
// import TimeslotForm from "../bookingStation03/components/TimeslotForm/TimeslotForm";

import Calendar from "../bookingStation03/components/Calendar/Calendar";
import Timeslot from "../bookingStation03/components/Timeslot/Timeslot";
import TimeslotForm from "../bookingStation03/components/TimeslotForm/TimeslotForm";

const BookingStation03 = () => {
  return (
    <div className="BookingStation03">
      <Routes>
        <Route path="/timeslot/:date" element={<Timeslot />} />
        <Route path="/" element={<Calendar />} />
      </Routes>
    </div>
  );
};

export default BookingStation03;
