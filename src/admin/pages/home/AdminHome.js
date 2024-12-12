// import Chart from "../../components/chart/Chart";
// import FeaturedInfo from "../../components/featuredInfo/FeaturedInfo";
// import "./home.css";
// import { userData } from "../../dummyData";
// import WidgetSm from "../../components/widgetSm/WidgetSm";
// import WidgetLg from "../../components/widgetLg/WidgetLg";

// export default function Home() {
//   return (
//     <div className="home">
//       <FeaturedInfo />
//       <Chart
//         data={userData}
//         title="User Analytics"
//         grid
//         dataKey="Active User"
//       />
//       <div className="homeWidgets">
//         <WidgetSm />
//         <WidgetLg />
//       </div>
//     </div>
//   );
// }

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
