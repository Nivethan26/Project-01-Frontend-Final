import React from "react";
import { Routes, Route, useParams } from "react-router-dom";
import Calendar from "../booking/components/Calendar/Calendar";
import Timeslot from "../booking/components/Timeslot/Timeslot";

const BookingStation = () => {
  const { stationId } = useParams();

  return (
    <div className="BookingStation">
      <Routes>
        <Route path="/timeslot/:date" element={<Timeslot stationId={stationId} />} />
        <Route path="/" element={<Calendar stationId={stationId} />} />
      </Routes>
    </div>
  );
};

export default BookingStation;
