import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const EmLogin = () => {
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost/Backend/api/loginEm.php', {
                id: userId,
                pwd: password,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.data.success) {
                localStorage.setItem('userId', userId);
                sessionStorage.setItem('username', userId);

                // Show welcome message with SweetAlert2
                await Swal.fire({
                    title: 'Welcome Back!',
                    text: `Welcome back, ${userId}!`,
                    icon: 'success',
                    confirmButtonText: 'OK',
                });

                // Redirect to the welcome page
                navigate(`/Welcome/${userId}`);
            } else {
                setErrorMessage(response.data.message);
            }
        } catch (error) {
            console.error('Error:', error);
            // Display error popup with SweetAlert2 for general error
            await Swal.fire({
                title: 'An error occurred',
                text: 'An error occurred. Please try again.',
                icon: 'error',
                confirmButtonText: 'OK',
            });
        }
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="login-container">
            <style>{`
                .login-container {
                    width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #f9f9f9;
                    border-radius: 8px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    margin-top: 200px;
                }
                h2 {
                    text-align: center;
                    margin-bottom: 20px;
                }
                .form-group {
                    margin-bottom: 15px;
                    position: relative;
                }
                label {
                    font-size: 14px;
                    display: block;
                    margin-bottom: 5px;
                }
                input {
                    width: 100%;
                    padding: 10px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    font-size: 14px;
                }
                button {
                    width: 100%;
                    padding: 10px;
                    background-color: #4CAF50;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 16px;
                    display: flex; /* Use flexbox to center content */
                    align-items: center; /* Center vertically */
                    justify-content: center; /* Center horizontally */
                    height: 50px; /* Define a height for better alignment */
                }
                button:hover {
                    background-color: black;
                    color : white;
                }
                .error-message {
                    color: red;
                    text-align: center;
                    margin-top: 10px;
                }
                .password-eye {
                    position: absolute;
                    right: 10px;
                    top: 35px;
                    cursor: pointer;
                }
            `}</style>

            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="id">UserID:</label>
                    <input
                        type="text"
                        id="id"
                        name="id"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <span
                        className="password-eye"
                        onClick={toggleShowPassword}
                    >
                        {showPassword ? '👁' : '🙈'}
                    </span>
                </div>
                <button type="submit" style={{ backgroundColor: '#FF2E2E', padding: '20px', borderRadius: '12px' }}>Login</button>
                {errorMessage && <div className="error-message">{errorMessage}</div>}
            </form>
        </div>
    );
};

export default EmLogin;
