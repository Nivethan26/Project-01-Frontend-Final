import React, { useEffect, useState } from "react";
import './Course.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export default function Courses() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [appliedIds, setAppliedIds] = useState([]);

    useEffect(() => {
        getCourses();
        fetchAppliedCourses();
    }, []);

    const fetchAppliedCourses = async () => {
        const email = sessionStorage.getItem("email");
        if (!email) return;
        try {
            const response = await fetch(`/Backend/checkApplication.php?email=${encodeURIComponent(email)}&getAllIds=true`);
            const data = await response.json();
            if (data.appliedCourseIds) {
                setAppliedIds(data.appliedCourseIds);
            }
        } catch (err) {
            console.error("Failed to fetch applied courses:", err);
        }
    };

    const getCourses = async () => {
        console.log('[Courses] useEffect triggered, fetching course list...');
        try {
            console.log('[Courses] API call start: /Backend/api/index.php');
            const response = await axios.get('http://localhost/Backend/api/index.php/');
            console.log('API Response:', response.data);
            console.log('[Courses] API call success');
            if (Array.isArray(response.data)) {
                setCourses(response.data);
            } else {
                console.error('Unexpected response data format:', response.data);
                setCourses([]);
            }
        } catch (error) {
            console.error('Error fetching courses:', error);
            console.error('[Courses] API call failed', error?.response?.status, error?.message);
            setError(error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) return <div className="container text-center my-5"><p>Loading Courses...</p></div>;
    if (error) return <div className="container text-center my-5"><p>Error fetching courses!</p></div>;

    return (
        <div style={{ backgroundColor: "#fafafa", minHeight: "100vh", paddingBottom: "80px" }}>
            
            {/* 1. Typography & Hero Title */}
            <div className="container courses-hero">
                <h1 className="course-anim-st" style={{ animationDelay: '0.1s' }}>Automobile Engineering Courses</h1>
                <p className="course-anim-st" style={{ animationDelay: '0.2s' }}>
                    Master the mechanics of tomorrow. Enroll in our industry-recognized training programs to fast-track your technical career.
                </p>
            </div>

            {/* Main Course Grid Container */}
            <div className="container" style={{ maxWidth: "1200px" }}>
                <div className="row g-4 justify-content-center">
                    {courses.map((course, index) => (
                        /* Responsive Grid: 1 Mobile, 2 Tablet, 3 Desktop */
                        <div className="col-12 col-md-6 col-lg-4 course-anim-st" style={{ animationDelay: `${0.2 + (index * 0.1)}s` }} key={course.id}>
                            <div className="course-card-modern">
                                {/* Badges */}
                                {index === 0 && <span className="course-badge">Popular</span>}
                                {index === 1 && <span className="course-badge" style={{ backgroundColor: '#190103' }}>New</span>}
                                
                                {/* Image Container (Hover Zoom) */}
                                <div className="course-img-container">
                                    <img
                                        src={`http://localhost/Backend/images/${course.courseId}/${course.image1}`}
                                        alt={course.courseName}
                                    />
                                </div>
                                
                                {/* Card Body Container */}
                                <div className="course-card-body">
                                    <h5 className="course-title">{course.courseName}</h5>
                                    
                                    {/* Short Description */}
                                    <p className="course-desc">
                                      Comprehensive professional training covering everything from foundational mechanics to advanced diagnostic systems tailored for today's vehicles.
                                    </p>

                                    {/* Course Details Data Row */}
                                    <div className="course-details-row">
                                        <div className="course-detail-item">
                                            <span className="label">Duration</span>
                                            <span className="value">6 Months</span>
                                        </div>
                                        <div className="course-detail-item">
                                            <span className="label">Level</span>
                                            <span className="value">Intermediate</span>
                                        </div>
                                        <div className="course-detail-item">
                                            <span className="label">Mode</span>
                                            <span className="value">Hybrid</span>
                                        </div>
                                    </div>

                                    {/* Modernized Full Card CTA button */}
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <Link to={`/courses/${course.id}`} className="btn-course-enroll" style={{ flex: 1, textAlign: 'center' }}>
                                            View Details
                                        </Link>
                                        {appliedIds.includes(course.courseId) ? (
                                            <button disabled className="btn-course-enroll" style={{ flex: 1, backgroundColor: '#9ca3af', color: 'white', border: 'none', cursor: 'not-allowed' }}>
                                                ✓ Applied
                                            </button>
                                        ) : (
                                            <button className="btn-course-enroll" style={{ flex: 1, backgroundColor: '#da1727', color: 'white', border: 'none' }} onClick={() => window.location.href = `/courses/${course.id}`}>
                                                Apply Now
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
