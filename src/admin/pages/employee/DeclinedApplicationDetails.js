// DeclinedApplicationDetails.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const DeclinedApplicationDetails = () => {
    const { id } = useParams();
    const [application, setApplication] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchApplicationDetails = async () => {
            try {
                const response = await axios.get(`http://localhost/Backend/api/getDeclinedApplicationDetails.php?id=${id}`);
                setApplication(response.data);
            } catch (err) {
                setError('Error fetching application details. Please try again later.');
                console.error('Error fetching application details:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchApplicationDetails();
    }, [id]);

    if (loading) {
        return <div>Loading application details...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!application) {
        return <div>Application not found.</div>;
    }

    return (
        <div>
            <h2>{application.full_name}'s Application Details</h2>
            <p><strong>Employee ID:</strong> {application.employee_id}</p>
            <p><strong>Email:</strong> {application.email}</p>
            <p><strong>Leave Type:</strong> {application.leave_type}</p>
            <p><strong>Start Date:</strong> {application.start_date}</p>
            <p><strong>End Date:</strong> {application.end_date}</p>
            <p><strong>Reason:</strong> {application.reason}</p>
            <p><strong>Status:</strong> {application.status}</p>
        </div>
    );
};

export default DeclinedApplicationDetails;
