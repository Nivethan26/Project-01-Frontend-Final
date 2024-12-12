// DeclinedApplications.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import './DeclinedApplications.css'; // Make sure this file exists

const DeclinedApplications = () => {
    const navigate = useNavigate(); // Initialize navigate
    const [declinedApplications, setDeclinedApplications] = useState([]); // State for declined applications
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState(''); // State for search term

    useEffect(() => {
        const fetchDeclinedApplications = async () => {
            try {
                const response = await axios.get('http://localhost/Backend/api/declinedApplications.php');
                setDeclinedApplications(response.data); // Assuming the API returns data as expected
            } catch (err) {
                setError('Error fetching declined leave applications. Please try again later.');
                console.error('Error fetching declined applications:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchDeclinedApplications();
    }, []);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value); // Update search term when input changes
    };

    // Filter applications based on search term (search by Employee ID for example)
    const filteredApplications = declinedApplications.filter(application =>
        application.employee_id.toString().includes(searchTerm)
    );

    if (loading) {
        return <div className="loading-spinner">Loading declined applications...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="main-content">
            <h1 style={{ textAlign: 'center' }}>Declined Leave Applications</h1>
            <div className="search-container">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearch}
                    placeholder="Search by Employee ID"
                    className="search-input"
                />
               
            </div>
            <table className="leave-table">
                <thead>
                    <tr>
                        <th>Employee ID</th>
                        <th>Username</th>
                        <th>Full Name</th>
                        <th>Email</th>
                        <th>Phone Number</th>
                        <th>Leave Type</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Reason</th>
                        <th>Status</th>
                        <th>Actions</th> {/* Added actions header */}
                    </tr>
                </thead>
                <tbody>
                    {filteredApplications.length > 0 ? (
                        filteredApplications.map(application => (
                            <tr key={application.id}>
                                <td>{application.employee_id}</td>
                                <td>{application.username}</td>
                                <td>{application.full_name}</td>
                                <td>{application.email}</td>
                                <td>{application.phone_number}</td>
                                <td>{application.leave_type}</td>
                                <td>{application.start_date}</td>
                                <td>{application.end_date}</td>
                                <td>{application.reason}</td>
                                <td style={{ color: application.status.toLowerCase() === 'declined' ? 'orange' : 'inherit' }}>
                                    {application.status}
                                </td>
                                <td>
                                    <button
                                        onClick={() => navigate(`/admin/adminEm/ViewEmployeeDetails/${application.employee_id}`)}
                                        className="action-button view-details-button"
                                    >
                                        View Details
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="11" className="no-data">No declined applications found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default DeclinedApplications;
