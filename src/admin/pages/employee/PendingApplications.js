// PendingApplications.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './PendingApplications.css';

const PendingApplications = () => {
    const navigate = useNavigate(); // Initialize navigate
    const [pendingApplications, setPendingApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState(''); // State for search term

    useEffect(() => {
        const fetchPendingApplications = async () => {
            try {
                const response = await axios.get('http://localhost/Backend/api/pendingApplications.php');
                setPendingApplications(response.data); // Adjust if your response structure is different
            } catch (err) {
                setError('Error fetching pending leave applications. Please try again later.');
                console.error('Error fetching pending applications:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchPendingApplications();
    }, []);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value); // Update the search term
    };

    const filteredApplications = pendingApplications.filter(application =>
        application.employee_id.toString().includes(searchTerm) // Filter by Employee ID
    );

    if (loading) {
        return <div className="loading-spinner">Loading pending applications...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="main-content">
            <h1 style={{ textAlign: 'center' }}>Pending Leave Applications</h1>
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
                                <td style={{ color: application.status.toLowerCase() === 'pending' ? 'blue' : 'inherit' }}>
                                    {application.status}
                                </td>
                                <td>
                                    <button
                                        onClick={() => navigate(`/admin/adminEm/ViewEmployeeDetails/${application.employee_id}`)} // Corrected here
                                        className="action-button view-details-button"
                                    >
                                        View Details
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="11" className="no-data">No pending applications found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default PendingApplications;
