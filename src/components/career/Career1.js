import React from "react";
import { Link } from "react-router-dom";
import img1 from "../assets/A19.jpg";
import img2 from "../assets/A16.jpg";
import img3 from "../assets/A18.jpg";
import img4 from "../assets/A17.jpg";
import "./Career2.css";

export default function Career1() {
  return (
    <div>
      <h1 className="text-center  my-5">Careers</h1>
      <div className="container">
        <div className="row">
          <div className="col-md-6 mb-5">
            <div className="card">
              <div className="thumbnail">
                <div className="img-container mt-5">
                  <img
                    src={img1}
                    className="img-fluid career-image rounded custom-image"
                    alt="Career"
                  />
                  <div className="overlay"></div>
                </div>
              </div>
              <div className="card-body">
                <h5 className="card-title">AUTOMOBILE ENGINEERING COURSES</h5>
                <Link to="/course" className="btn btn-danger">
                  Read more
                </Link>
              </div>
            </div>
          </div>
          <div className="col-md-6 mb-5">
            <div className="card">
              <div className="thumbnail">
                <div className="img-container mt-5">
                  <img
                    src={img2}
                    className="img-fluid career-image rounded custom-image"
                    alt="Career"
                  />
                  <div className="overlay"></div>
                </div>
              </div>
              <div className="card-body">
                <h5 className="card-title">LIFE AT AUTOCARE LANKA</h5>
                <Link to="/careerlife" className="btn btn-danger">
                  Read more
                </Link>
              </div>
            </div>
          </div>
          <div className="col-md-6 mb-5">
            <div className="card">
              <div className="thumbnail">
                <div className="img-container mt-5">
                  <img
                    src={img3}
                    className="img-fluid career-image rounded custom-image"
                    alt="Career"
                  />
                  <div className="overlay"></div>
                </div>
              </div>
              <div className="card-body">
                <h5 className="card-title">JOB OPENINGS</h5>
                <Link to="/careerjob" className="btn btn-danger">
                  Read more
                </Link>
              </div>
            </div>
          </div>
          <div className="col-md-6 mb-5">
            <div className="card">
              <div className="thumbnail">
                <div className="img-container mt-5">
                  <img
                    src={img4}
                    className="img-fluid career-image rounded custom-image"
                    alt="Career"
                  />
                  <div className="overlay"></div>
                </div>
              </div>
              <div className="card-body">
                <h5 className="card-title">OUR PEOPLE</h5>
                <Link to="/careerpeople" className="btn btn-danger">
                  Read more
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
