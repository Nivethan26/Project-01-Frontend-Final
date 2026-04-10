import './Ser.css';
import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import Swal from "../utils/modernAlert";
import axios from 'axios';

export default function Courses() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getCourses();
    }, []);

    const getCourses = async () => {
        setLoading(true); // Start loading when fetching begins
    
        try {
            const response = await axios.get('http://localhost/Backend/api/service.php/');
            console.log('API Response:', response.data);
            
            if (Array.isArray(response.data)) {
                setCourses(response.data);
            } else {
                console.error('Unexpected response data format:', response.data);
                // Show error popup for unexpected data format
                await Swal.fire({
                    title: 'Error',
                    text: 'Unexpected response data format received.',
                    icon: 'error',
                    confirmButtonText: 'OK',
                });
                setCourses([]);
            }
        } catch (error) {
            console.error('Error fetching service:', error);
            // Show error popup for API fetch failure
            await Swal.fire({
                title: 'Error',
                text: 'Failed to fetch services. Please check your connection or try again later.',
                icon: 'error',
                confirmButtonText: 'OK',
            });
            setError(error);
        } finally {
            setLoading(false); // Stop loading after fetch completes
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error fetching courses!</p>;

    return (
        <div className="services-page-container">
            <h1 className="services-page-title">Our Services</h1>
            <div className="services-grid-wrapper">
                <div className="services-grid container">
                    {courses.map((course) => (
                        <div className="service-card" key={course.id}>
                            <div className="service-img-container">
                                <Link to={`/services/${course.id}`}>
                                    <img 
                                        src={`http://localhost/Backend/images/${course.serviceId}/${course.image1}`}
                                        className="service-img" 
                                        alt={course.serviceName} 
                                    />
                                    <div className="service-img-overlay"></div>
                                </Link>
                            </div>
                            <div className="service-card-content">
                                <h3 className="service-card-title">{course.serviceName}</h3>
                                {course.content1 && (
                                    <p className="service-card-desc">
                                        {course.content1.length > 80 
                                            ? `${course.content1.substring(0, 80)}...` 
                                            : course.content1}
                                    </p>
                                )}
                                <Link to={`/services/${course.id}`} className="service-card-btn">
                                    View Details
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}