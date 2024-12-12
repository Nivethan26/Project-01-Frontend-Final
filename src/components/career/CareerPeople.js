import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import img1 from '../assets/A17.jpg';

export default function CareerPeople() {
    return (
        <div className="container ">
            <h3 className='text-center mt-5'>OUR PEOPLE</h3>
            <div className='row'>
                <div className='col-md-6 mt-5'>
                    <p>
                        At AutoCare Lanka, our greatest asset is our people. Our team is composed of experienced professionals who bring a wealth of expertise and passion to everything they do. Each member of our staff is highly skilled in their respective fields, from seasoned mechanics and engineers to customer service specialists and administrative personnel. Their deep knowledge and dedication ensure that every vehicle we service receives the utmost care and precision.
                    </p>
                    <p>
                        Our team members are not just experts; they are also lifelong learners who continually seek to enhance their skills and stay ahead of industry trends. This commitment to professional growth is evident in their proactive approach to problem-solving and their ability to tackle even the most complex automotive challenges. With certifications from leading institutions and hands-on experience with cutting-edge technologies, our workforce is well-equipped to deliver top-notch service.
                    </p>
                    <p>
                        At AutoCare Lanka, we pride ourselves on fostering a positive and collaborative work environment. Our people are known for their friendly attitudes and genuine care for our customers. They listen attentively, communicate clearly, and go the extra mile to ensure customer satisfaction. This customer-centric mindset is a hallmark of our company culture, driving us to consistently exceed expectations.
                    </p>
                    <p>
                        Our team is characterized by a unique blend of talents and characteristics that make AutoCare Lanka a dynamic and innovative place to work. Creativity, attention to detail, and a strong work ethic are just a few of the qualities that define our staff. They bring a diverse range of perspectives and ideas, which fuels our ability to innovate and adapt in a rapidly changing industry.
                    </p>
                    <p>
                        From master technicians who can diagnose and fix the trickiest issues to passionate customer service representatives who make every client feel valued, our people are the heart and soul of AutoCare Lanka. Their collective talent, dedication, and positive energy create an exceptional experience for everyone who walks through our doors. Join us and experience the difference that our extraordinary team makes every day.
                    </p>
                </div>
                <div className='col-md-1 mt-5'></div>
                <div className='col-md-5 mt-5'>
                    <img src={img1} className="img-fluid career-image" alt="Career" />
                </div>
            </div>
        </div>
    );
}