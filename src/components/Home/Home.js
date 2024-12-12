import React from "react";
import { Link } from "react-router-dom";
import home1 from "../assets/home1.png";
import home2 from "../assets/home2.png";
import home3 from "../assets/home3.png";
import home4 from "../assets/home4.mp4";
import home5 from "../assets/home5.png";
import home6 from "../assets/home6.png";
import "./Home.css";

const Home = () => {
  return (
    <main>
      <div className="button-container" >
        <Link to="/LoginRegister" className="book-now">
          Book Now
        </Link>
      </div>
      <div className="heading">
        <h3>
          <b>Largest Automobile Service providers in Sri Lanka</b>
        </h3>
        <br />
      </div>
      <div className="content">
        <div className="column1">
          <img src={home1} alt="Left Image" />
        </div>
        <div className="column1">
          <h4>
            <b>
              Over 28 Years of Excellence in the automotive service industry
            </b>
          </h4>
          <p>
            AutoCare Lanka being Sri Lanka's largest and the best auto service
            network, has the most diverse service portfolio. AutoCare Lanka is
            your one stop station for all of your maintenance, repairs, and
            services. AutoCare Lanka Family drives to success based on three
            main pillars which are Promptness, Respect & Oneness
          </p>
        </div>
      </div>
      <br />
      <br />
      <br />
      <div className="cent-img">
        <img src={home2} alt="Landscape Image" />
      </div>
      <br />
      <br />
      <div className="latest-news">
        <h3>
          <b>Latest News</b>
        </h3>
      </div>
      <br />
      <br />
      <br />
      <div className="content">
        <div className="column">
          <img src={home3} alt="Small Image 1" />
          <br />
          <br />
          <p>
            Proud that... AutoCare Lanka has won the trophy for best Toyota
            Dealer in the year of 2022
          </p>
        </div>
        <div className="column">
          <video width="400" height="200" controls>
            <source src={home4} type="video/mp4" />
          </video>
          <br />
          <br />
          <p>
            AutoCare Lanka has won the Best Automobile Service center trophy at
            Nations Lanka Convention in the year of 2023
          </p>
        </div>
      </div>
      <br />
      <br />
      <h3 className="serpart">
        <b>Our Service Partners</b>
      </h3>
      <br />
      <br />
      <div className="logos">
        <img src={home5} alt="logo1" />
        <img src={home6} alt="logo2" />
      </div>
      <br />
    </main>
  );
};

export default Home;
