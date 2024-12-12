import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Calendar.css";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [days, setDays] = useState([]);
  const [availableSlots, setAvailableSlots] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    generateCalendar();
    fetchAvailableSlots();
  }, [currentDate]);

  const fetchAvailableSlots = async () => {
    try {
      const response = await fetch(
        `http://localhost/Backend/api2.php?action=get_calendar&month=${
          currentDate.getMonth() + 1
        }&year=${currentDate.getFullYear()}`
      );
      const data = await response.json();
      console.log("Available Slots Data:", data);
      setAvailableSlots(data.availableSlots || {});
    } catch (error) {
      console.error("Error fetching available slots:", error);
    }
  };

  const generateCalendar = () => {
    const startOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const endOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );
    const startDate = startOfMonth.getDay();
    const totalDays = endOfMonth.getDate();

    const daysArray = [];
    for (let i = 0; i < startDate; i++) {
      daysArray.push(null);
    }
    for (let i = 1; i <= totalDays; i++) {
      daysArray.push(
        new Date(currentDate.getFullYear(), currentDate.getMonth(), i)
      );
    }
    setDays(daysArray);
  };

  const handlePreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const handleDayClick = (day) => {
    if (day && day >= new Date(new Date().setHours(0, 0, 0, 0))) {
      const formattedDate = day.toLocaleDateString("en-CA");
      navigate(`/bookingStation02/timeslot/${formattedDate}`);
    }
  };

  const renderDay = (day) => {
    if (!day)
      return <div className="day empty" key={`empty-${Math.random()}`}></div>;

    const formattedDate = day.toLocaleDateString("en-CA");
    const available = availableSlots[formattedDate] || 0;
    const isPast = day < new Date(new Date().setHours(0, 0, 0, 0));

    return (
      <div
        className="day"
        onClick={() => handleDayClick(day)}
        key={formattedDate}
      >
        <div>{day.getDate()}</div>
        {isPast ? (
          <div className="status na">N/A</div>
        ) : (
          <div className="status book">
            <button className={available === 0 ? "booked" : "available"}>
              {available === 0 ? "Booked" : "Book"}
            </button>
            <div className="slots">{available} slots left</div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="calendar">
      <div className="header">
        <button onClick={handlePreviousMonth}>Previous Month</button>
        <div className="current-month">
          {currentDate.toLocaleString("default", { month: "long" })}{" "}
          {currentDate.getFullYear()}
        </div>
        <button onClick={handleNextMonth}>Next Month</button>
      </div>
      <div className="days-grid">
        {[
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ].map((day) => (
          <div className="day-name" key={day}>
            {day}
          </div>
        ))}
        {days.map((day) => renderDay(day))}
      </div>
    </div>
  );
};

export default Calendar;
