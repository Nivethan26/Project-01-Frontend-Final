import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TimeslotForm from "../TimeslotForm/TimeslotForm";
import "./Timeslot.css";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import LightModeIcon from '@mui/icons-material/LightMode';
import NightsStayIcon from '@mui/icons-material/NightsStay';

const Timeslot = () => {
  const { date } = useParams();
  const navigate = useNavigate();
  const [timeslotStatus, setTimeslotStatus] = useState({});
  const [selectedTimeslot, setSelectedTimeslot] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    fetchTimeslotStatus();
  }, [date]);

  const fetchTimeslotStatus = async () => {
    try {
      const response = await fetch(
        `http://localhost/Backend/api1.php?action=get_timeslot_status&date=${date}`
      );
      const data = await response.json();
      setTimeslotStatus(data);
      console.log("Timeslot Status:", data); // Debugging line
    } catch (error) {
      console.error("Error fetching timeslot status:", error);
    }
  };

  const openModal = (timeslot) => {
    setSelectedTimeslot(timeslot);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  // Helper function to format the date
  const getFormattedDate = (dateString) => {
    if (!dateString) return "";
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Helper function to figure out the time of day categorization
  const categorizeSlots = (slotsData) => {
    const categories = {
      Morning: [],
      Afternoon: [],
      Evening: []
    };

    Object.keys(slotsData).forEach(slotStr => {
      // Extract just the start time to prevent end-time AM/PM from interfering
      const startTimeStr = slotStr.split('-')[0].trim().toLowerCase();
      const match = startTimeStr.match(/(\d+)/);
      let hour = match ? parseInt(match[1], 10) : 0;
      
      if (startTimeStr.includes('pm') && hour < 12) hour += 12;
      if (startTimeStr.includes('am') && hour === 12) hour = 0;

      if (hour < 12) {
        categories.Morning.push(slotStr);
      } else if (hour >= 12 && hour < 16) {
        categories.Afternoon.push(slotStr);
      } else {
        categories.Evening.push(slotStr);
      }
    });

    return categories;
  };

  const slotGroups = categorizeSlots(timeslotStatus);

  const renderSlotGroup = (title, icon, slots) => {
    if (slots.length === 0) return null;
    
    return (
      <div className="timeslot-section" key={title}>
        <h3>{icon} {title}</h3>
        <div className="timeslot-buttons">
          {slots.map((slot) => (
            <button
              key={slot}
              className={`timeslot-button ${
                timeslotStatus[slot] === "booked" ? "booked" : "available"
              }`}
              onClick={() =>
                timeslotStatus[slot] === "available" && openModal(slot)
              }
              disabled={timeslotStatus[slot] === "booked"}
            >
              {slot}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="timeslot-wrapper">
      <div className="timeslot-card">
        <header className="timeslot-header">
          <button className="back-button" onClick={() => navigate(-1)}>
            <ArrowBackIcon fontSize="small" /> Back to Calendar
          </button>
          <h2>Select a Time Slot</h2>
          <div className="formatted-date">
             <CalendarMonthIcon className="date-icon" fontSize="small" />
             {getFormattedDate(date)}
          </div>
        </header>

        <div className="timeslot-sections">
          {Object.keys(timeslotStatus).length === 0 ? (
            <div className="no-slots">
              <p>No timeslots available for this date.</p>
            </div>
          ) : (
            <>
              {renderSlotGroup("Morning", <WbSunnyIcon style={{ color: '#f59e0b' }} />, slotGroups.Morning)}
              {renderSlotGroup("Afternoon", <LightModeIcon style={{ color: '#ef4444' }} />, slotGroups.Afternoon)}
              {renderSlotGroup("Evening", <NightsStayIcon style={{ color: '#3b82f6' }} />, slotGroups.Evening)}
            </>
          )}
        </div>
      </div>

      <TimeslotForm
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        timeslot={selectedTimeslot}
        date={date}
      />
    </div>
  );
};

export default Timeslot;
