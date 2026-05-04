import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MyApplications.css';
import { Assignment } from '@mui/icons-material';

const MyApplications = () => {
    const [courseApplications, setCourseApplications] = useState([]);
    const [jobApplications, setJobApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const email = sessionStorage.getItem('email');
                if (!email) return;
                
                const response = await fetch(
                    `/Backend/getMyApplications.php?email=${encodeURIComponent(email)}`
                );
                const data = await response.json();
                
                if (data.success) {
                    setCourseApplications(data.applications || []);
                    setJobApplications(data.jobApplications || []);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchApplications();
    }, []);

    const getStatusLabel = (status) => {
        const labels = {
            submitted: '● Submitted',
            under_review: '◉ Under Review',
            approved: '✓ Approved',
            rejected: '✗ Rejected'
        };
        return labels[status] || status || '● Submitted';
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric'
        });
    };

    const allEmpty = courseApplications.length === 0 && jobApplications.length === 0;

    const filteredCourses = activeTab === 'all' || activeTab === 'courses' ? courseApplications : [];
    const filteredJobs = activeTab === 'all' || activeTab === 'jobs' ? jobApplications : [];

    const totalCount = courseApplications.length + jobApplications.length;

    return (
        <div className="my-applications-page">
            {/* Header */}
            <div className="page-header">
                <h1>My Applications</h1>
                <p>Track your course and job application status</p>
            </div>

            {/* Tab Filters */}
            {!loading && !allEmpty && (
                <div className="app-tab-filters">
                    <button 
                        className={`app-tab-btn ${activeTab === 'all' ? 'active' : ''}`}
                        onClick={() => setActiveTab('all')}
                    >
                        All ({totalCount})
                    </button>
                    <button 
                        className={`app-tab-btn ${activeTab === 'courses' ? 'active' : ''}`}
                        onClick={() => setActiveTab('courses')}
                    >
                        🎓 Courses ({courseApplications.length})
                    </button>
                    <button 
                        className={`app-tab-btn ${activeTab === 'jobs' ? 'active' : ''}`}
                        onClick={() => setActiveTab('jobs')}
                    >
                        💼 Jobs ({jobApplications.length})
                    </button>
                </div>
            )}

            {/* Loading */}
            {loading && (
                <div className="loading-state">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="skeleton-card"></div>
                    ))}
                </div>
            )}

            {/* Empty State */}
            {!loading && allEmpty && (
                <div className="empty-state">
                    <Assignment sx={{ fontSize: 64, color: '#9ca3af', marginBottom: '16px' }} />
                    <h3>No applications yet</h3>
                    <p>Apply for courses or jobs to see them here</p>
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button onClick={() => navigate('/courses')}>
                            Explore Courses
                        </button>
                        <button onClick={() => navigate('/jobs')} style={{ background: '#1e3a8a' }}>
                            Browse Jobs
                        </button>
                    </div>
                </div>
            )}

            {/* Course Application Cards */}
            {!loading && filteredCourses.map((app) => (
                <div className="application-card" key={`course-${app.id}`}>
                    {/* Left: Icon */}
                    <div className="app-icon course-icon">🎓</div>
                    
                    {/* Middle: Details */}
                    <div className="app-details">
                        <h3>{app.course_name}</h3>
                        <span className="type-badge course">Course</span>
                        <p>Course ID: {app.course_id}</p>
                        <p>Name: {app.full_name}</p>
                        <p>Email: {app.email}</p>
                        <p>Phone: {app.phone}</p>
                        <p>Applied on: {formatDate(app.created_at)}</p>
                    </div>

                    {/* Right: Status */}
                    <div className="app-status">
                        <span className={`status-badge ${app.status || 'submitted'}`}>
                            {getStatusLabel(app.status || 'submitted')}
                        </span>
                    </div>
                </div>
            ))}

            {/* Job Application Cards */}
            {!loading && filteredJobs.map((app) => (
                <div className="application-card" key={`job-${app.id}`}>
                    {/* Left: Icon */}
                    <div className="app-icon job-icon">💼</div>
                    
                    {/* Middle: Details */}
                    <div className="app-details">
                        <h3>{app.jobTitle}</h3>
                        <span className="type-badge job">Job</span>
                        <p>Job ID: {app.jobId}</p>
                        <p>Name: {app.name}</p>
                        <p>Email: {app.email}</p>
                        <p>Phone: {app.phone}</p>
                        <p>Applied on: {formatDate(app.application_date)}</p>
                    </div>

                    {/* Right: Status */}
                    <div className="app-status">
                        <span className="status-badge submitted">
                            {getStatusLabel('submitted')}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MyApplications;
