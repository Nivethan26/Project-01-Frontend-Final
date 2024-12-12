import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './ViewEmployeeDetails.css';

const ViewEmployeeDetails = () => {
    const { id } = useParams();  // Get the employee ID from the URL parameters

    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEmployeeDetails = async () => {
            try {
                console.log("Fetching details for employee ID:", id); // Log the employee ID
                const response = await axios.get(`http://localhost/Backend/api/ViewEmployeeDetails.php?employee_id=${id}`);
                const data = response.data;

                console.log("API Response:", data);  // Log the response for debugging

                if (response.status === 200 && data && data.id) {
                    setEmployee(data);  // Set employee data if found
                } else {
                    setError(data.error || 'Employee not found.');  // Handle errors
                }
            } catch (err) {
                setError('Error fetching employee details. Please try again later.');  // Catch any errors
                console.error('Error fetching employee details:', err);
            } finally {
                setLoading(false);  // Set loading to false after fetch
            }
        };

        fetchEmployeeDetails();
    }, [id]);

    if (loading) {
        return <div>Loading employee details...</div>;  // Loading state
    }

    if (error) {
        return <div className="error-message">{error}</div>;  // Error state
    }

    return (
        <div>
            <h1>Employee Details</h1>
            {employee ? (
                <form className="employee-details">
                    <div className="details-row">
                        <div className="detail-column">
                            <label>Employee ID:</label>
                            <input type="text" value={employee.id} readOnly />
                        </div>
                        <div className="detail-column">
                            <label>Username:</label>
                            <input type="text" value={employee.username} readOnly />
                        </div>
                        <div className="detail-column">
                            <label>Full Name:</label>
                            <input type="text" value={employee.name} readOnly />
                        </div>
                    </div>
                    <div className="details-row">
                        <div className="detail-column">
                            <label>Email:</label>
                            <input type="email" value={employee.email} readOnly />
                        </div>
                        <div className="detail-column">
                            <label>Phone Number:</label>
                            <input type="text" value={employee.phone} readOnly />
                        </div>
                        <div className="detail-column">
                            <label>Address:</label>
                            <input type="text" value={employee.address} readOnly />
                        </div>
                    </div>
                </form>
            ) : (
                <div>No employee details found.</div>
            )}

            <div className="back-links">
                <a href="/admin/adminEm" className="back-button">Back to Admin</a>
                <a href="/admin/adminEm/leaveApplication" className="back-button">Back to Leave Applications</a>
            </div>
        </div>
    );
};

export default ViewEmployeeDetails;
