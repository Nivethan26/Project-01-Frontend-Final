import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminEm.css';

const Admin = () => {
    const [leaveTypeCount, setLeaveTypeCount] = useState(0);
    const [totalEmployees, setTotalEmployees] = useState(0);
    const [pendingApplications, setPendingApplications] = useState(0);
    const [approvedApplicationsCount, setApprovedApplicationsCount] = useState(0);
    const [declinedApplications, setDeclinedApplications] = useState(0);
    const [activeEmployeesCount, setActiveEmployeesCount] = useState(0);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                // Fetch general admin data from API
                const response = await axios.get('http://localhost/Backend/api/Admin.php');
                const data = response.data;

                // Log the data for debugging
                console.log('Admin data:', data);

                // Set state with data from API
                setLeaveTypeCount(data.leaveTypeCount || 0);
                setTotalEmployees(data.totalEmployees || 0);

                // Fetch today's leave count
                const today = new Date().toISOString().split('T')[0];
                const leaveResponse = await axios.get(`http://localhost/Backend/api/todayLeaveCount.php?date=${today}`);

                // Assuming the API returns an object with employeesOnLeave count in `leaveResponse.data`
                const leaveData = leaveResponse.data;  
                const employeesOnLeave = leaveData.employeesOnLeave || 0;  

                // Calculate active employees count by subtracting employees on leave
                const activeCount = data.totalEmployees - employeesOnLeave; 
                setActiveEmployeesCount(activeCount >= 0 ? activeCount : 0); 

                // Fetch counts for applications separately
                const approvedResponse = await axios.get('http://localhost/Backend/api/approvedApplications.php');
                const pendingResponse = await axios.get('http://localhost/Backend/api/pendingApplications.php');
                const declinedResponse = await axios.get('http://localhost/Backend/api/declinedApplications.php');

                // Set counts for applications
                setApprovedApplicationsCount(approvedResponse.data.length || 0);
                setPendingApplications(pendingResponse.data.length || 0);
                setDeclinedApplications(declinedResponse.data.length || 0);

            } catch (err) {
                console.error("There was an error fetching the data!", err);
                setError("There was an error fetching the data.");
            } finally {
                setLoading(false);
            }
        };            

        fetchAdminData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="main-content">
           

            {error && <div className="error-message">{error}</div>}

            <div className="box-container">
                {/* Leave Types Box */}
                <a href="adminEm/leaveTypes" className="box">
                    <div className="icon-container">
                        <i className="fas fa-calendar-alt"></i>
                    </div><br />
                    <div className="number">{leaveTypeCount}</div><br />
                    <div className="description">Leave Types</div>
                </a>

                {/* Employees Box */}
                <a href="adminEm/employ" className="box">
                    <div className="icon-container">
                        <i className="fas fa-users"></i>
                    </div><br />
                    <div className="number">{totalEmployees}</div><br />
                    <div className="description">Employees</div>
                </a>

                {/* Active Employees Box */}
                <a href="adminEm/leaveApplication" className="box">
                    <div className="icon-container">
                        <i className="fas fa-building"></i>
                    </div><br />
                    <div className="number">{activeEmployeesCount}</div><br />
                    <div className="description">Active Employees</div>
                </a>

                {/* Pending Applications Box */}
                <a href="adminEm/pendingApplications" className="box">
                    <div className="icon-container">
                        <i className="fas fa-hourglass-half"></i>
                    </div><br />
                    <div className="number">{pendingApplications}</div><br />
                    <div className="description">Pending Applications</div>
                </a>

                {/* Declined Applications Box */}
                <a href="adminEm/declinedApplications" className="box">
                    <div className="icon-container">
                        <i className="fas fa-times-circle"></i>
                    </div><br />
                    <div className="number">{declinedApplications}</div><br />
                    <div className="description">Declined Applications</div>
                </a>

                {/* Approved Applications Box */}
                <a href="adminEm/approvedApplications" className="box">
                    <div className="icon-container">
                        <i className="fas fa-check-circle"></i>
                    </div><br />
                    <div className="number">{approvedApplicationsCount}</div><br />
                    <div className="description">Approved Applications</div>
                </a>
            </div>
        </div>
    );
};

export default Admin; 
