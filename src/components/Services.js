// Services.js
import './Ser.css';
import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
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
        <div>
            <h1 className='text-center my-5'>Our Services</h1>
            <div className='container align-items-center'>
                <div className='row '>
                    {courses.map((course) => (
                        <div className='col-md-6 mb-5' key={course.id}>
                            <div >
                                <div className="thumbnail">
                                    
                                    <div className="img-container mt-5">
                                    <Link to={`/services/${course.id}`} >
                                        <img 
                                            src={`http://localhost/Backend/images/${course.serviceId}/${course.image1}`}
                                            className="img-fluid career-image rounded custom-image align-items-center " 
                                            alt={course.serviceName} 
                                        />
                                         </Link>
                                        <div className="overlay"></div>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <h5 className="card-title">{course.serviceName}</h5>
                                  
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}