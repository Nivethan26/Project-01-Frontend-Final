import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Groups, WorkspacePremium, School, Handshake } from '@mui/icons-material';
import img1 from '../assets/A17.jpg';
import './Career2.css';

export default function CareerPeople() {
    return (
        <div className="career-people-section">
            <div className="container">
                <div className="text-center mt-5 mb-5 career-people-header">
                    <h3>OUR PEOPLE</h3>
                    <div className="title-underline"></div>
                </div>
                
                <div className="row career-people-content">
                    {/* Left Column: Content Sections */}
                    <div className="col-lg-7">
                        <div className="people-card">
                            <div className="people-card-header">
                                <Groups className="people-icon" />
                                <h4>Team Culture</h4>
                            </div>
                            <p>
                                At AutoCare Lanka, we pride ourselves on fostering a positive and collaborative work environment. Our people are known for their friendly attitudes and genuine care for our customers. They listen attentively, communicate clearly, and go the extra mile to ensure customer satisfaction. This customer-centric mindset is a hallmark of our company culture, driving us to consistently exceed expectations.
                            </p>
                        </div>

                        <div className="people-card">
                            <div className="people-card-header">
                                <WorkspacePremium className="people-icon" />
                                <h4>Expertise</h4>
                            </div>
                            <p>
                                Our team is composed of experienced professionals who bring a wealth of expertise and passion to everything they do. Each member of our staff is highly skilled in their respective fields, from seasoned mechanics and engineers to customer service specialists and administrative personnel. Their deep knowledge and dedication ensure that every vehicle we service receives the utmost care and precision.
                            </p>
                        </div>

                        <div className="people-card">
                            <div className="people-card-header">
                                <School className="people-icon" />
                                <h4>Growth & Learning</h4>
                            </div>
                            <p>
                                Our team members are not just experts; they are also lifelong learners who continually seek to enhance their skills and stay ahead of industry trends. This commitment to professional growth is evident in their proactive approach to problem-solving and their ability to tackle even the most complex automotive challenges with cutting-edge technologies.
                            </p>
                        </div>

                        <div className="people-card">
                            <div className="people-card-header">
                                <Handshake className="people-icon" />
                                <h4>Work Environment</h4>
                            </div>
                            <p>
                                Our team is characterized by a unique blend of talents and characteristics that make AutoCare Lanka a dynamic and innovative place to work. From master technicians who can diagnose and fix the trickiest issues to passionate customer service representatives who make every client feel valued, our people are the heart and soul of AutoCare Lanka.
                            </p>
                        </div>
                    </div>

                    {/* Right Column: Image */}
                    <div className="col-lg-5">
                        <div className="people-image-wrapper">
                            <img src={img1} className="img-fluid people-image" alt="Our People" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
