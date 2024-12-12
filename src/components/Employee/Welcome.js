import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';

const Welcome = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [leaveFormVisible, setLeaveFormVisible] = useState(false); // State to control leave form visibility
    const [leaveTypes, setLeaveTypes] = useState([]);
    const [leaveForm, setLeaveForm] = useState({
        employeeId: '',
        username: '',
        fullName: '',
        email: '',
        phoneNumber: '',
        leaveType: '',
        startDate: '',
        endDate: '',
        reason: '',
    });

    useEffect(() => {
        const userId = localStorage.getItem('userId'); // Retrieve user ID from localStorage

        if (!userId) {
            Swal.fire({
                title: 'Authentication Error',
                text: 'User not logged in. Please log in to continue.',
                icon: 'error',
                confirmButtonText: 'OK',
            });
            return;
        }

        // Fetch user details from the API using the userId
        axios.get(`http://localhost/Backend/api/getUserDetails.php?id=${userId}`)
            .then(response => {
                const data = response.data;
                if (data.success) {
                    setUser(data.data);
                    setLeaveForm(prev => ({ ...prev, employeeId: data.data.id })); // Set employee ID in leave form
                } else {
                    Swal.fire({
                        title: 'Error',
                        text: data.message || 'An unknown error occurred',
                        icon: 'error',
                        confirmButtonText: 'OK',
                    });
                }
            })
            .catch(err => {
                Swal.fire({
                    title: 'Error',
                    text: err.message || 'Failed to fetch user details. Please try again later.',
                    icon: 'error',
                    confirmButtonText: 'OK',
                });
            });

        // Fetch leave types
        const fetchLeaveTypes = async () => {
            try {
                const response = await axios.get('http://localhost/Backend/api/employee.php');
                setLeaveTypes(response.data.leaveTypes);
            } catch (error) {
                console.error('Error fetching leave types:', error);
            }
        };

        fetchLeaveTypes();
    }, []);

    const handleApplyLeave = () => {
        // Toggle the visibility of the leave form
        setLeaveFormVisible(prev => !prev);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLeaveForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Display confirmation popup with SweetAlert2
        const { isConfirmed } = await Swal.fire({
            title: 'Submit Leave Application',
            text: "Do you want to submit the leave application?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: '<i class="fa fa-paper-plane"></i> Yes, submit!',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#28a745', // Green color for confirm button
            cancelButtonColor: '#d33', // Red color for cancel button
            background: '#f9f9f9', // Soft background color
            backdrop: `
                rgba(0,0,123,0.4)
                url("https://i.gifer.com/ZZ5H.gif") // Background effect with gif
                left top
                no-repeat
            `,
            customClass: {
                title: 'my-title-class', // Custom title style class
                popup: 'my-popup-class', // Custom popup style class
                confirmButton: 'my-confirm-button-class', // Custom button style class
                cancelButton: 'my-cancel-button-class' // Custom cancel button style class
            }
        });
    
        // If not confirmed, exit the function
        if (!isConfirmed) {
            return;
        }
    
        console.log(leaveForm); // Check the leave form data before sending
    
        try {
            const response = await axios.post('http://localhost/Backend/api/submitLeave.php', leaveForm);
    
            // Check if the response indicates success
            if (response.data && response.data.message) {
                console.log('Leave application submitted successfully:', response.data.message);
    
                // Display success popup with SweetAlert2
                Swal.fire({
                    title: 'Success!',
                    text: response.data.message,
                    icon: 'success',
                    confirmButtonText: '<i class="fa fa-thumbs-up"></i> Great!',
                    confirmButtonColor: '#28a745', // Green color for the button
                    background: '#f0f9ff', // Soft background color
                    backdrop: `
                        rgba(0,0,123,0.4)
                        url("https://i.gifer.com/ZZ5H.gif") // Background effect with gif
                        left top
                        no-repeat
                    `,
                    customClass: {
                        title: 'my-title-class', // Custom title style class
                        popup: 'my-popup-class', // Custom popup style class
                        confirmButton: 'my-confirm-button-class', // Custom button style class
                    }
                });
    
                // Reset the form fields
                setLeaveForm({
                    employeeId: leaveForm.employeeId, // Keep employee ID
                    username: '',
                    fullName: '',
                    email: '',
                    phoneNumber: '',
                    leaveType: '',
                    startDate: '',
                    endDate: '',
                    reason: '',
                });
            } else {
                console.error('Unexpected response format:', response.data);
                const errorMessage = response.data && response.data.error ? response.data.error : 'There was an issue with your submission. Please try again.';
    
                // Display error popup with SweetAlert2
                Swal.fire({
                    title: 'Error!',
                    text: errorMessage,
                    icon: 'error',
                    confirmButtonText: 'Try Again',
                    confirmButtonColor: '#d33', // Red color for error button
                    background: '#ffe8e8', // Soft background color for error
                    backdrop: `
                        rgba(0,0,123,0.4)
                        url("https://i.gifer.com/8ET3.gif") // Background effect with gif for error
                        left top
                        no-repeat
                    `,
                    customClass: {
                        title: 'my-title-class-error', // Custom title style class for error
                        popup: 'my-popup-class-error', // Custom popup style class for error
                        confirmButton: 'my-confirm-button-class-error', // Custom button style class for error
                    }
                });
            }
    
        } catch (error) {
            let errorMessage = 'An error occurred: ' + error.message;
    
            if (error.response) {
                errorMessage = `Error: ${error.response.data.error || 'Unknown error occurred'}`;
            } else if (error.request) {
                errorMessage = 'No response received from the server. Please check your connection.';
            }
    
            // Display error popup with SweetAlert2
            Swal.fire({
                title: 'Oops!',
                text: errorMessage,
                icon: 'error',
                confirmButtonText: 'Try Again',
                confirmButtonColor: '#d33', // Red color for error button
                background: '#ffe8e8', // Soft background color for error
                backdrop: `
                    rgba(0,0,123,0.4)
                    url("https://i.gifer.com/8ET3.gif") // Background effect with gif for error
                    left top
                    no-repeat
                `,
                customClass: {
                    title: 'my-title-class-error', // Custom title style class for error
                    popup: 'my-popup-class-error', // Custom popup style class for error
                    confirmButton: 'my-confirm-button-class-error', // Custom button style class for error
                }
            });
        }
    };
    

    if (error) {
        return <div className="error-message" style={{ color: 'red', textAlign: 'center' }}>Error: {error}</div>;
    }

    if (!user) {
        return <div style={{ textAlign: 'center' }}>Loading...</div>;
    }

    return (
        <div>
            <style>{`
                body {
                    font-family: Arial, sans-serif;
                    margin-top: 0px;
                    padding: 0;
                    background-color: #f4f4f4;
                }
                
                .welcome-container {
                    text-align: center;
                    padding: 50px;
                }
                .apply-leave-button {
                    background-color: red;
                    color: white;
                    padding: 10px 20px;
                    border: none;
                    cursor: pointer;
                    font-size: 18px;
                    margin-bottom: 20px;
                    margin-right:0px;
                }
                .apply-leave-button:hover {
                    background-color:red;
                }
                .leave-form {
                    max-width: 800px;
                    margin-top: 100px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: white;
                    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
                    border-radius: 5px;
                }
                .leave-form input, .leave-form select, .leave-form textarea {
                    width: 100%;
                    padding: 10px;
                    margin: 10px 0;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                    font-size: 16px;
                }
                .leave-form button {
                    background-color: red;
                    color: white;
                    padding: 10px;
                    border: none;
                    cursor: pointer;
                    font-size: 16px;
                    border-radius: 5px;
                    width: 100%;
                }
                .leave-form button:hover {
                    background-color: darkred;
                }
            `}</style>

            <div className="welcome-container">
                <h1>Welcome, {user.id}!</h1>
                <button className="apply-leave-button" onClick={handleApplyLeave}>
                    {leaveFormVisible ? 'Hide Leave Form' : 'Apply Leave'}
                </button>

                {/* Display Leave Form */}
                {leaveFormVisible && (
                    <form className="leave-form" onSubmit={handleSubmit}>
                        <label htmlFor="employeeId">Employee ID:</label>
                        <input
                            type="text"
                            name="employeeId"
                            value={leaveForm.employeeId} // Display employee ID
                            readOnly // Make this field read-only
                        />
                        <label htmlFor="username">Username:</label>
                        <input
                            type="text"
                            name="username"
                            placeholder="Enter Username"
                            value={leaveForm.username}
                            onChange={handleChange}
                            required
                        />
                        <label htmlFor="fullName">Full Name:</label>
                        <input
                            type="text"
                            name="fullName"
                            placeholder="Enter Full Name"
                            value={leaveForm.fullName}
                            onChange={handleChange}
                            required
                        />
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter Email"
                            value={leaveForm.email}
                            onChange={handleChange}
                            required
                        />
                        <label htmlFor="phoneNumber">Phone Number:</label>
                        <input
                            type="tel"
                            name="phoneNumber"
                            placeholder="Enter Phone Number"
                            value={leaveForm.phoneNumber}
                            onChange={handleChange}
                            required
                        />
                        <label htmlFor="leaveType">Type of Leave:</label>
                        <select
                            name="leaveType"
                            value={leaveForm.leaveType}
                            onChange={handleChange}
                            required
                        >
                            <option value="" disabled>Select leave type</option>
                            {leaveTypes && leaveTypes.length > 0 ? (
                                leaveTypes.map((type, index) => (
                                    <option key={index} value={type.leave_type}>
                                        {type.leave_type}
                                    </option>
                                ))
                            ) : (
                                <option value="" disabled>No leave types available</option>
                            )}
                        </select>
                        <label htmlFor="startDate">Start Date:</label>
                        <input
                            type="date"
                            name="startDate"
                            value={leaveForm.startDate}
                            onChange={handleChange}
                            required
                        />
                        <label htmlFor="endDate">End Date:</label>
                        <input
                            type="date"
                            name="endDate"
                            value={leaveForm.endDate}
                            onChange={handleChange}
                            required
                        />
                        <label htmlFor="reason">Reason for Leave:</label>
                        <textarea
                            name="reason"
                            placeholder="Enter Reason for Leave"
                            value={leaveForm.reason}
                            onChange={handleChange}
                            required
                        />
                        <button type="submit">Submit Leave Application</button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Welcome;