import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { 
    Groups, 
    SelfImprovement, 
    VolunteerActivism, 
    TrendingUp 
} from '@mui/icons-material';
import img1 from '../assets/A16.jpg';
import './Career2.css'; // Make sure to import the CSS for styling

export default function CareerLife() {
    return (
        <div className="container career-life-container">
            <h3 className='career-life-heading'>LIFE AT AUTOCARE LANKA</h3>
            
            <div className='career-life-grid'>
                {/* Content Column */}
                <div className='career-life-content-card'>
                    <div className="career-life-section">
                        <h4 className="career-life-subheading">
                            <Groups className="career-life-icon" /> Work Culture
                        </h4>
                        <p>
                            At AutoCare Lanka, we believe that a thriving workplace is built on more than just professional excellence; it's also about fostering a vibrant, supportive community. Our annual events are a cornerstone of this ethos, offering employees the chance to connect, celebrate, and create lasting memories. <strong>From our grand year-end gala to festive celebrations, we ensure that every milestone is marked with joy and camaraderie.</strong>
                        </p>
                    </div>

                    <div className="career-life-section">
                        <h4 className="career-life-subheading">
                            <SelfImprovement className="career-life-icon" /> Employee Wellbeing
                        </h4>
                        <p>
                            Our commitment to employee well-being extends beyond the office. Every year, we organize exciting trips that take our team to some of the most beautiful destinations, providing a perfect blend of relaxation and adventure. <strong>These trips are more than just a getaway; they are an opportunity to strengthen bonds and rejuvenate together.</strong>
                        </p>
                    </div>

                    <div className="career-life-section">
                        <h4 className="career-life-subheading">
                            <VolunteerActivism className="career-life-icon" /> Community Engagement
                        </h4>
                        <p>
                            Giving back to the community is at the heart of AutoCare Lanka. We regularly engage in social service activities such as blood donation drives and educational donations for rural areas. Our initiatives aim to make a meaningful impact, reflecting our dedication to social responsibility. By supporting education and healthcare, we strive to uplift and empower the communities around us.
                        </p>
                    </div>

                    <div className="career-life-section">
                        <h4 className="career-life-subheading">
                            <TrendingUp className="career-life-icon" /> Benefits & Growth
                        </h4>
                        <p>
                            In addition to these enriching experiences, AutoCare Lanka ensures that our employees' needs are well taken care of. We offer a range of beneficial goods, including wellness programs, fitness memberships, and family support services.
                        </p>
                        <p>
                            Join us at AutoCare Lanka, where professional growth meets personal fulfillment, and every day brings new opportunities to thrive and make a difference.
                        </p>
                    </div>
                </div>

                {/* Image Column */}
                <div className='career-life-image-wrapper'>
                    <img src={img1} className="career-life-image" alt="Life at AutoCare Lanka" />
                </div>
            </div>
        </div>
    );
}