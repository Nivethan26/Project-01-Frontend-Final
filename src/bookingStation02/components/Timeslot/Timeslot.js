import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import TimeslotForm from "../TimeslotForm/TimeslotForm";
import "./Timeslot.css";

const Timeslot = () => {
  const { date } = useParams();
  const [timeslotStatus, setTimeslotStatus] = useState({});
  const [selectedTimeslot, setSelectedTimeslot] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    fetchTimeslotStatus();
  }, [date]);

  const fetchTimeslotStatus = async () => {
    try {
      const response = await fetch(
        `http://localhost/Backend/api2.php?action=get_timeslot_status&date=${date}`
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

  return (
    <div className="timeslot">
      <h2>Book for Date: {date}</h2>
      <div className="timeslot-buttons">
        {Object.keys(timeslotStatus).length === 0 ? (
          <p>No timeslots available</p>
        ) : (
          Object.keys(timeslotStatus).map((slot) => (
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
          ))
        )}
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
