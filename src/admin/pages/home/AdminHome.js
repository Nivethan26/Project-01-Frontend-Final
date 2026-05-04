import React from "react";
import { useNavigate } from "react-router-dom";
import "./home.css";

const stations = [
  { id: "01", name: "Station 01", description: "Body Wash Only" },
  { id: "02", name: "Station 02", description: "Body Wash Only" },
  {
    id: "03",
    name: "Station 03",
    description: "Body Wash With Interior Detail",
  },
  { id: "04", name: "Station 04", description: "Full Service" },
];

const Station = () => {
  const navigate = useNavigate();

  const handleBookClick = (stationId) => {
    navigate(`/admin/bookings?station=${parseInt(stationId)}`);
  };

  return (
    <div className="station">
      <div className="station-booking-container">
        <h1>Book A Service</h1>
        <p>Select a station bay with your preferences</p>
        <div className="stations">
          {stations.map((station) => (
            <div key={station.id} className="station-card">
              <h2>{station.name}</h2>
              <p>{station.description}</p>
              <button
                className="book-button"
                onClick={() => handleBookClick(station.id)}
              >
                Book
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Station;
