import React, { useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';

const ChangePassword = ({ id: propId }) => {
    const { id: paramId } = useParams(); // Access id from URL params if available
    const userId = propId || paramId; // Use propId if passed, otherwise use paramId

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Ask for confirmation before changing the password
        const { isConfirmed } = await Swal.fire({
            title: 'Change Password',
            text: "Do you want to change the password?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: '<i class="fa fa-key"></i> Yes, change it!',
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
    
        // Validate password match
        if (newPassword !== confirmPassword) {
            // Display error popup for password mismatch
            Swal.fire({
                title: 'Error!',
                text: "New password and confirm password do not match.",
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
            return; // Exit if passwords do not match
        }
    
        try {
            const response = await axios.post(`http://localhost/Backend/api/changePassword.php?id=${userId}`, {
                id: userId,
                old_password: oldPassword,
                new_password: newPassword,
            });
    
            // Display success popup after password change
            Swal.fire({
                title: 'Success!',
                text: response.data.message || "Password changed successfully!",
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
    
            // Optionally clear form fields or perform other actions here
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            // Display error popup for failed password change
            Swal.fire({
                title: 'Oops!',
                text: `Error: ${error.response?.data?.error || error.message}`,
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
    

    return (
        <div className="main-content">
            <style>{`
                .main-content {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    background-color: #f4f4f4;
                }
                .form-container {
                    margin-top: 50px;
                    background-color: #fff;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                    width: 800px;
                }
                h2 {
                    text-align: center;
                    margin-bottom: 20px;
                    color: #333;
                }
                label {
                    display: block;
                    margin-bottom: 8px;
                    font-size: 16px;
                    color: #55;
                }
                input {
                    width: 100%;
                    padding: 10px;
                    margin-bottom: 15px;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    font-size: 14px;
                }
                .changePass {
                    width: 100%;
                    padding: 10px;
                    background-color: #c40303;
                    border: none;
                    border-radius: 4px;
                    color: white;
                    font-size: 16px;
                    cursor: pointer;
                }
                .changePass:hover {
                    background-color: black;
                }
                .error-message {
                    color: red;
                    margin-bottom: 10px;
                }
                .success-message {
                    color: green;
                    margin-bottom: 10px;
                }
            `}</style>
            <div className="form-container">
                <h2>Change Password</h2>
                {message && <p className={isError ? 'error-message' : 'success-message'}>{message}</p>}
                <form onSubmit={handleSubmit}>
                    <label htmlFor="oldPassword">Old Password</label>
                    <input
                        id="oldPassword"
                        type="password"
                        placeholder="Old Password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        required
                    />
                    <label htmlFor="newPassword">New Password</label>
                    <input
                        id="newPassword"
                        type="password"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                    <label htmlFor="confirmPassword">Confirm New Password</label>
                    <input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm New Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    <button type="submit" className='changePass'>Change Password</button>
                </form>
            </div>
        </div>
    );
};

// Prop validation
ChangePassword.propTypes = {
    id: PropTypes.string, // 'id' can be optionally passed as a prop
};

export default ChangePassword;