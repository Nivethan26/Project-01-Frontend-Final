import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // Import useParams
import axios from 'axios';

const History = () => {
    const { id } = useParams(); // Get the id parameter from the URL
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchLeaveApplications();
    }, [id]); // Add id as a dependency to refetch when it changes

    const fetchLeaveApplications = async () => {
        try {
            // Use template literals to insert the id parameter correctly
            const response = await axios.get(`http://localhost/Backend/api/getLeaveApplicationsem.php?employee_id=${id}`);
            const today = new Date();

            const formattedApplications = response.data.applications.map(application => {
                const leaveEndDate = new Date(application.end_date);

                // If the leave has ended and the status is still 'pending', mark it as 'Declined'
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

    if (loading) {
        return <div className="loading-spinner">Loading leave applications...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="main-content" style={{ minHeight: '150vh' }}>
            <style>
                {`
                    .body {
                        margin-top: 100px;
                    }
                    .leave-table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-top: 100px;
                    }
                    .leave-table th, .leave-table td {
                        padding: 10px;
                        text-align: center;
                        border: 1px solid #ddd;
                    }
                    .leave-table th:nth-child(4), 
                    .leave-table td:nth-child(4) {
                        width: 300px;
                        text-align: left;
                        word-wrap: break-word;
                    }
                    .status-approved {
                        color: green;
                    }
                    .status-rejected {
                        color: red;
                    }
                    .status-pending {
                        color: blue;
                    }
                    .status-declined {
                        color: orange;
                    }
                    .status-unknown {
                        color: black;
                    }
                    .no-data {
                        text-align: center;
                        font-style: italic;
                    }
                    .loading-spinner {
                        text-align: center;
                        font-size: 18px;
                        color: #555;
                    }
                `}
            </style>

            <h1 style={{ textAlign: 'center', color: 'red', marginTop: '70px' }}>
                History for Employee ID: {id} {/* Display the employee ID */}
            </h1>
            
            <table className="leave-table" style={{ marginTop: '0px' }}>
                <thead>
                    <tr>
                        <th>Leave Type</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Reason</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {applications.length > 0 ? (
                        [...applications].reverse().map((application) => (
                            <tr key={application.id} className="clickable-row">
                                <td>{application.leave_type}</td>
                                <td>{application.start_date}</td>
                                <td>{application.end_date}</td>
                                <td>{application.reason}</td>
                                <td className={getStatusColorClass(application.status)}>
                                    {application.status}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="no-data">No leave applications found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default History;