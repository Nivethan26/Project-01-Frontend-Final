// ApprovedApplications.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './ApprovedApplications.css'; // Ensure this file exists

const ApprovedApplications = () => {
    const navigate = useNavigate(); // Initialize navigate
    const [approvedApplications, setApprovedApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState(''); // State for search term

    useEffect(() => {
        const fetchApprovedApplications = async () => {
            try {
                const response = await axios.get('http://localhost/Backend/api/approvedApplications.php');
                console.log('API response:', response.data);

                // Check if the response is an array and set it accordingly
                const data = response.data;
                setApprovedApplications(Array.isArray(data) ? data : []);
            } catch (err) {
                setError('Error fetching approved leave applications. Please try again later.');
                console.error('Error fetching approved applications:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchApprovedApplications();
    }, []);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value); // Update search term when input changes
    };

    // Filter applications based on search term (search by Employee ID for example)
    const filteredApplications = Array.isArray(approvedApplications)
        ? approvedApplications.filter(application =>
            application.employee_id.toString().includes(searchTerm)
        )
        : [];

    if (loading) {
        return <div className="loading-spinner">Loading approved applications...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="main-content">
            <h1 style={{ textAlign: 'center' }}>Approved Leave Applications</h1>
            <div className="search-container">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearch}
                    placeholder="Search by Employee ID"
                    className="search-input"
                />
                <i className="fa fa-search search-icon" aria-hidden="true"></i>
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
                        <th>Actions</th>
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
                                <td style={{ color: application.status.toLowerCase() === 'approved' ? 'green' : 'inherit' }}>
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
                            <td colSpan="11" className="no-data">No approved applications found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ApprovedApplications;
