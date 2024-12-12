import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios';
import SearchIcon from '@mui/icons-material/Search'; // Import Material-UI Search Icon
import './LeaveApplication.css';

const LeaveApplication = () => {
    const navigate = useNavigate(); // Initialize navigate
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedApplicationId, setSelectedApplicationId] = useState(null);
    const [searchTerm, setSearchTerm] = useState(''); // State for search term

    useEffect(() => {
        fetchLeaveApplications();
    }, []);

    const fetchLeaveApplications = async () => {
        try {
            const response = await axios.get('http://localhost/Backend/api/getLeaveApplications.php');
            const today = new Date();

            const formattedApplications = response.data.applications.map(application => {
                const leaveEndDate = new Date(application.end_date);

                if (today > leaveEndDate && application.status.toLowerCase() === 'pending') {
                    return {
                        ...application,
                        status: 'Declined',
                    };
                }

                return {
                    ...application,
                    status: formatStatus(application.status),
                };
            });

            setApplications(formattedApplications);
        } catch (err) {
            setError('Error fetching leave applications. Please try again later.');
            console.error('Error fetching leave applications:', err);
        } finally {
            setLoading(false);
        }
    };

    const formatStatus = (status) => {
        const statusMap = {
            approved: 'Approved',
            rejected: 'Rejected',
            pending: 'Pending',
            declined: 'Declined'
        };
        return statusMap[status.toLowerCase()] || 'Unknown';
    };

    const updateStatus = async (applicationId, newStatus) => {
        console.log('Updating status for:', applicationId, 'New Status:', newStatus);
        try {
            const response = await axios.post('http://localhost/Backend/api/updateStatus.php', {
                id: applicationId,
                status: newStatus,
            });

            console.log('Update response:', response.data); // Log the response

            if (response.data.success) {
                await fetchLeaveApplications(); // Fetch updated applications
            } else {
                setError(response.data.error || 'Unknown error occurred.');
                console.error('Server error:', response.data.error);
            }

            setSelectedApplicationId(null);
        } catch (err) {
            setError('Error updating application status. Please try again later.');
            console.error('Error updating application status:', err);
        }
    };

    const handleRowClick = (applicationId) => {
        setSelectedApplicationId(prevId => (prevId === applicationId ? null : applicationId));
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredApplications = applications.filter(application => 
        application.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        application.employee_id.toString().includes(searchTerm)
    );

    const today = new Date().toISOString().split('T')[0]; // Get today's date in 'YYYY-MM-DD' format
    const approvedLeaveCount = applications.filter(application => {
        const startDate = new Date(application.start_date).toISOString().split('T')[0];
        const endDate = new Date(application.end_date).toISOString().split('T')[0];

        return application.status === 'Approved' && (
            (startDate <= today && endDate >= today) || // Currently on leave
            startDate === today || // Starts today
            endDate === today // Ends today
        );
    }).length;

    if (loading) {
        return <div className="loading-spinner">Loading leave applications...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="main-content" style={{ minHeight: '150vh' }}>
            <h1 style={{ textAlign: 'center', color: 'red' }}>Leave Applications</h1>
            <div className="leave-status" style={{ marginTop: '0px' }}>
                <h4>{approvedLeaveCount} Employees did not come to work today due to approved leave.</h4>
            </div>
            <div className="search-container" style={{ marginTop: '0px', display: 'flex', alignItems: 'center' }}>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearch}
                    placeholder="Search by Employee ID"
                    className="search-input"
                />
               
            </div>
            
            <table className="leave-table" style={{ marginTop: '0px' }}>
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
                    </tr>
                </thead>
                <tbody>
                    {filteredApplications.length > 0 ? (
                        [...filteredApplications].reverse().map((application) => (
                            <React.Fragment key={application.id}>
                                <tr onClick={() => handleRowClick(application.id)} className="clickable-row">
                                    <td>{application.employee_id}</td>
                                    <td>{application.username}</td>
                                    <td>{application.full_name}</td>
                                    <td>{application.email}</td>
                                    <td>{application.phone_number}</td>
                                    <td>{application.leave_type}</td>
                                    <td>{application.start_date}</td>
                                    <td>{application.end_date}</td>
                                    <td>{application.reason}</td>
                                    <td className={getStatusColorClass(application.status)}>
                                        {application.status}
                                    </td>
                                </tr>
                                {selectedApplicationId === application.id && (
                                    <tr>
                                        <td colSpan="10" className="action-buttons-row">
                                            <button
                                                onClick={() => updateStatus(application.id, 'Approved')}
                                                className="action-button approve-button"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => updateStatus(application.id, 'Rejected')}
                                                className="action-button reject-button"
                                            >
                                                Reject
                                            </button>
                                            <button
                                                onClick={() => navigate(`/admin/adminEm/ViewEmployeeDetails/${application.employee_id}`)}
                                                className="action-button view-details-button"
                                            >
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="10" className="no-data">No leave applications found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

const getStatusColorClass = (status) => {
    const statusClasses = {
        Approved: 'status-approved',
        Rejected: 'status-rejected',
        Pending: 'status-pending',
        Declined: 'status-declined',
        Unknown: 'status-unknown'
    };
    return statusClasses[status] || statusClasses.Unknown;
};

export default LeaveApplication;
