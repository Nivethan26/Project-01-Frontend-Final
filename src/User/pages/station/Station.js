import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./station.css";

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
  

  const user_role = sessionStorage.getItem("user-role");

  useEffect(() => {
    if(user_role != "user"){
      sessionStorage.clear();
      navigate("/LoginRegister")
    }
  },[])

  const navigate = useNavigate();

  const handleBookClick = (stationId) => {
    if (stationId === "01") {
      navigate("/bookingStation01");
    }
    if (stationId === "02") {
      navigate("/bookingStation02");
    }
    if (stationId === "03") {
      navigate("/bookingStation03");
    }
    if (stationId === "04") {
      navigate("/bookingStation04");
    }

    // You can handle navigation for other stations here if needed
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
