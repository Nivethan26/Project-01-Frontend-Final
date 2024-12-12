
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ApprovedApplicationDetails = () => {
    const { id } = useParams(); // Get the application ID from the URL
    const [applicationDetails, setApplicationDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchApplicationDetails = async () => {
            try {
                const response = await axios.get(`http://localhost/Backend/api/approvedApplicationDetails.php?id=${id}`);
                setApplicationDetails(response.data);
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
        return <div className="loading-spinner">Loading application details...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    if (!applicationDetails) {
        return <div>No application details available.</div>;
    }

    return (
        <div className="main-content">
            <h1 style={{ textAlign: 'center' }}>Application Details</h1>
            <table className="details-table">
                <thead>
                    <tr>
                        <th>Field</th>
                        <th>Value</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(applicationDetails).map(([key, value]) => (
                        <tr key={key}>
                            <td>{key.replace(/_/g, ' ').toUpperCase()}</td>
                            <td>{value}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ApprovedApplicationDetails;
