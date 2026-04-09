import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./station.css";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PaidIcon from '@mui/icons-material/Paid';
import StarIcon from '@mui/icons-material/Star';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const stations = [
  { id: "01", name: "Station 01", description: "Standard exterior body wash and quick dry.", duration: "30 mins", price: "Rs. 800", rating: "4.2" },
  { id: "02", name: "Station 02", description: "Standard exterior body wash and quick dry.", duration: "30 mins", price: "Rs. 800", rating: "4.4" },
  {
    id: "03",
    name: "Station 03",
    description: "Comprehensive exterior wash with detailed interior vacuuming and wipe down.",
    duration: "60 mins",
    price: "Rs. 1500",
    rating: "4.8"
  },
  { id: "04", name: "Station 04", description: "Ultimate full service: body wash, interior detail, engine bay cleaning, and wax.", duration: "90 mins", price: "Rs. 3500", rating: "4.9" },
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
        <p>Select a service station tailored to your vehicle's needs</p>
        <div className="stations">
          {stations.map((station) => (
            <div key={station.id} className="station-card">
              <h2>{station.name}</h2>
              <p className="desc">{station.description}</p>
              
              <div className="card-details">
                <div className="detail-item">
                  <AccessTimeIcon className="icon" fontSize="small" />
                  {station.duration}
                </div>
                <div className="detail-item price">
                  <PaidIcon className="icon" fontSize="small" />
                  {station.price}
                </div>
                <div className="detail-item rating">
                  <StarIcon className="icon" fontSize="small" />
                  {station.rating}
                </div>
              </div>

              <button
                className="book-button"
                onClick={() => handleBookClick(station.id)}
              >
                Book Now <ArrowForwardIcon style={{ marginLeft: '8px', fontSize: '18px' }} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Station;
