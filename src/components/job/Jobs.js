import React, { useEffect, useState } from "react";
import './Jobs.css'; // Ensure you have this CSS file for custom styling
import { Link } from 'react-router-dom';
import axios from 'axios';
import WorkIcon from '@mui/icons-material/Work'; // Ensure you have this icon imported
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter'; // Ensure you have this icon imported
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'; // Ensure you have this icon imported
import EventIcon from '@mui/icons-material/Event'; // Ensure you have this icon imported

export default function Jobs() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getJobs();
    }, []);

    const getJobs = async () => {
        try {
            const response = await axios.get('http://localhost/Backend/api/indexjob.php'); // Adjust API endpoint
            console.log('API Response:', response.data);
            if (Array.isArray(response.data)) {
                setJobs(response.data);
            } else {
                console.error('Unexpected response data format:', response.data);
                setJobs([]);
            }
        } catch (error) {
            console.error('Error fetching jobs:', error);
            setError('Error fetching jobs: ' + error.message); // Set a more informative error message
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-danger">{error}</p>; // Display error in red text

    return (
        <div>
            <h1 className='text-center my-5'>Job Vacancies</h1>
            <div className="container my-5">
                <div className="row g-4">
                    {jobs.map((job) => (
                        <div className="col-md-4" key={job.id}>
                            <div className="job-card">
                                <div className="company-logo">
                                    <img 
                                        src={`http://localhost/Backend/images/${job.jobId}/${job.image1}`} 
                                        alt={job.jobTitle} 
                                        className="img-fluid"
                                    />
                                </div>
                                <h4>{job.jobTitle}</h4>
                                <p>
                                    <WorkIcon className="me-2" /> {job.experience} years
                                </p>
                                <p>
                                    <BusinessCenterIcon className="me-2" /> {job.jobType} - time job
                                </p>
                                <p>
                                    <AttachMoneyIcon className="me-2" /> {job.salary} 
                                </p>
                                <p>
                                    <EventIcon className="me-2" /> Closing Date: {job.closingDate}
                                </p>
                                <div className="jobs">
                                    <Link to={`/jobs/${job.id}`} className="apply-button btn btn-danger">Read More</Link>
                                </div>
                            </div>
                        </div>
                        
                    ))}
                </div>
            </div>
        </div>
    );
}