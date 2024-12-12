import React, { useEffect } from "react";
import img1 from "../assets/img1.jpg";
import img3 from "../assets/img3.jpeg";
import { useNavigate } from "react-router";

const About = () => {

  
  
  return (
    <div className="about-container">
      <style>
        {`
          .about-container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 20px;
          }
          .about-row {
            display: flex;
            align-items: center;
            margin-bottom: 40px;
            flex-wrap: wrap;
          }
          .about-text {
            flex: 1;
            margin-right: 20px;
          }
          .about-text h1 {
            font-weight: bold;
          }
          .about-text p {
            text-align: justify;
          }
          .about-img {
            flex: 1;
            width: 90%;
            border-radius: 8px;
            max-width: 100%;
            height: auto;
          }
          .about-centered-text {
            text-align: center;
            margin-bottom: 40px;
          }
          .about-centered-text h2 {
            font-weight: bold;
          }
          .about-centered-text p {
            margin-top: 20px;
          }
          .about-values {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
          }
          .about-values-img {
            flex: 1;
            margin-right: 20px;
            max-width: 100%;
            height: auto;
            border-radius: 8px;
          }
          .about-values-text {
            flex: 1;
          }
          .about-values-text h1 {
            font-weight: bold;
          }
          .about-values-text ul {
            margin-top: 20px;
            padding-left: 20px;
          }
          .about-values-text li {
            margin-bottom: 10px;
          }
            .about-h2{
            color:#da1727;
            }
        `}
      </style>
      
      <div className="about-row">
        <div className="about-text">
          <h1>About AutoCare Lanka</h1>
          <p>
            AutoCare Lanka has an opportunity to transform the way vehicle
            owners interact with service centres, with a comprehensive online
            booking system, job opportunities, educational resources, and career
            pathways in the automotive industry. Come along and help shape the
            future of automotive education and service.
          </p>
        </div>
        <div className="about-img">
          <img src={img1} alt="About AutoCare Lanka" className="about-img" />
        </div>
      </div>
      
      <div className="about-centered-text">
        <h2 className="about-h2">--OUR VISION--</h2>
        <p>
          Our vision is to revolutionize the vehicle service industry by
          becoming the preferred platform for seamless service reservations,
          education opportunities, and career advancement within the automotive sector.
        </p>
      </div>

      <div className="about-centered-text">
        <h2 className="about-h2">--OUR MISSION--</h2>
        <p>
          Simplify the process of booking service appointments for vehicle
          owners, ensuring convenience and reliability. Provide high-quality
          automotive education and training programs to empower future
          professionals in the automotive industry, and connect job seekers
          with rewarding career opportunities through our integrated platform.
        </p>
      </div>

      <div className="about-values">
        <div className="about-values-img">
          <img src={img3} alt="Goals & Values" className="about-values-img" />
        </div>
        <div className="about-values-text">
          <h1>GOALS & VALUES</h1>
          <ul>
            <li>Simplify the process of booking vehicle service appointments through an intuitive and user-friendly online platform.</li>
            <li>Provide comprehensive automotive courses and training programs to equip students with the skills and knowledge needed for successful careers in the automotive industry.</li>
            <li>Prioritize customer satisfaction by delivering reliable services and personalized experiences.</li>
            <li>Commit to excellence in service delivery, education, and career placement, maintaining high standards at all times.</li>
            <li>Promote environmentally responsible practices within the automotive service sector, striving for sustainable solutions and operations.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default About;