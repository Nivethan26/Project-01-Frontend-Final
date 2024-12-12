import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import img1 from '../assets/A16.jpg';
export default function CareerLife() {

    return (

            <div className="container ">
            <h3 className='text-center mt-5'>LIFE AT AUTOCARE LANKA</h3>
            <div className='row'>
                <div className='col-md-6 mt-5'>
                    <p>At AutoCare Lanka, we believe that a thriving workplace is built on more than just professional excellence; it's also about fostering a vibrant, supportive community. Our annual events are a cornerstone of this ethos, offering employees the chance to connect, celebrate, and create lasting memories. From our grand year-end gala to festive celebrations, we ensure that every milestone is marked with joy and camaraderie.</p>
                    <p>Our commitment to employee well-being extends beyond the office. Every year, we organize exciting trips that take our team to some of the most beautiful destinations, providing a perfect blend of relaxation and adventure. These trips are more than just a getaway; they are an opportunity to strengthen bonds and rejuvenate together.</p>
                    <p>Giving back to the community is at the heart of AutoCare Lanka. We regularly engage in social service activities such as blood donation drives and educational donations for rural areas. Our initiatives aim to make a meaningful impact, reflecting our dedication to social responsibility. By supporting education and healthcare, we strive to uplift and empower the communities around us.</p>
                    <p>In addition to these enriching experiences, AutoCare Lanka ensures that our employees' needs are well taken care of. We offer a range of beneficial goods, including wellness programs, fitness memberships, and family support services. Our holistic approach to employee benefits underscores our commitment to fostering a balanced and fulfilling life for our team members.</p>
                    <p>Join us at AutoCare Lanka, where professional growth meets personal fulfillment, and every day brings new opportunities to thrive and make a difference.</p>
                </div>
                <div className='col-md-1 mt-5'></div>
                <div className='col-md-5 mt-5'>
                    <img src={img1} className="img-fluid career-image transform-hover" alt="Career" />
                </div>
            </div>
        </div>


    );

}