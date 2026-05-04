import React from 'react';
import { Routes, Route } from 'react-router-dom';
import EmployeeStationList from './BookingFlow/EmployeeStationList';
import EmployeeBookingCalendar from './BookingFlow/EmployeeBookingCalendar';
import EmployeeBookingTimeslot from './BookingFlow/EmployeeBookingTimeslot';

const EmployeeBookings = () => {
  return (
    <div style={{ height: '100%' }}>
      <Routes>
        <Route path="/" element={<EmployeeStationList />} />
        <Route path="/station/:stationId" element={<EmployeeBookingCalendar />} />
        <Route path="/station/:stationId/timeslot/:date" element={<EmployeeBookingTimeslot />} />
      </Routes>
    </div>
  );
};

export default EmployeeBookings;
