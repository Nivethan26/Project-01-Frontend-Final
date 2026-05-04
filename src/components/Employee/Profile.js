import { toast } from 'react-toastify';
import React, { useEffect, useState } from 'react';

import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Typography, Avatar, TextField, Button, CircularProgress } from '@mui/material';

const Profile = () => {
    const { id: paramId } = useParams(); // Get employee ID from URL parameters
    const id = paramId || localStorage.getItem("userId");
    const navigate = useNavigate(); // For navigating between pages

    const [userDetails, setUserDetails] = useState(null); // Store employee data
    const [formData, setFormData] = useState({
        username: '',
        name: '',
        email: '',
        phone: '',
        address: '',
    });
    const [loading, setLoading] = useState(true); // For loading state
    const [errors, setErrors] = useState({}); // For storing validation errors

    useEffect(() => {
        const fetchEmployeeDetails = async () => {
            setLoading(true); // Start loading when fetching begins
            try {
                console.log("Fetching details for user ID:", id);
                const response = await axios.get(`http://localhost/Backend/api/getUserDetails.php?id=${id}`, { withCredentials: true });
                const data = response.data;
                console.log("API Response:", data);

                if (response.data && response.data.success) {
                    const userData = response.data.data;
                    setUserDetails(userData);
                    setFormData({
                        username: userData.username || '',
                        name: userData.name || '',
                        email: userData.email || '',
                        phone: userData.phone || '',
                        address: userData.address || '',
                    });
                } else {
                    console.error('User not found:', data);
                    await ( toast.error('The user you are trying to fetch was not found.'), new Promise(res => setTimeout(res, 2000)) );

                    // Navigate back if user is not found
                    navigate(`/welcome/${id}`);
                }
            } catch (error) {
                console.error('Error fetching user details:', error.response ? error.response.data : error.message);
                if (error.response && error.response.status === 401) {
                    await ( toast.error('Your session has expired. Please login again.'), new Promise(res => setTimeout(res, 2000)) );
                    navigate('/login');
                } else {
                    await ( toast.error('Failed to load details. Please check your connection or try again later.'), new Promise(res => setTimeout(res, 2000)) );
                    navigate(`/welcome/${id}`);
                }
            } finally {
                setLoading(false); // Stop loading after fetch completes
            }
        };

        if (id) { // Ensure id is defined before fetching
            fetchEmployeeDetails();
        } else {
            ( toast.warning('Invalid user ID. Please provide a valid ID.'), new Promise(res => setTimeout(res, 2000)) ).then(() => {
                navigate(-1);
            });
        }
    }, [id, navigate]);
    

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        validateField(name, value); // Validate on change
    };

    const validateField = async (name, value) => {
        let error = '';
    
        if (name === 'name') {
            const namePattern = /^[a-zA-Z\s]+$/;
            if (!namePattern.test(value)) {
                error = 'Full name can only contain letters and spaces.';
            }
        } else if (name === 'phone') {
            const phonePattern = /^\d{10}$/;
            if (!phonePattern.test(value)) {
                error = 'Phone number must be 10 digits.';
            }
        } else if (name === 'email') {
            const emailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
            if (!emailPattern.test(value)) {
                error = 'Email must be a valid Gmail address.';
            }
        }
    
        // If there is an error, show a SweetAlert2 popup
        if (error) {
            await ( toast.error(error), new Promise(res => setTimeout(res, 2000)) );
        }
    
        // Update the errors state
        setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
    };

    if (loading) return <CircularProgress sx={{ display: 'block', margin: 'auto' }} />;

    return (
        <Box
            sx={{
                maxWidth: '600px',
                margin: '150px auto',
                padding: '20px',
                border: '1px solid #ccc',
                borderRadius: '8px',
                backgroundColor: '#f9f9f9',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                textAlign: 'center',
            }}
        >
            <Typography variant="h4" gutterBottom>
                Hello, {userDetails.id}
            </Typography>
            
            <Avatar
                src={userDetails?.profilePicture || "https://img.icons8.com/color/96/000000/person-male.png"}
                alt="Profile"
                sx={{ width: 96, height: 96, margin: '0 auto 20px' }}
            />

            {userDetails && (
                <Box component="form" noValidate autoComplete="off">
                    <TextField
                        fullWidth
                        label="ID"
                        value={userDetails.id || ''}
                        InputProps={{
                            readOnly: true,
                        }}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Username"
                        value={userDetails.username || ''}
                        InputProps={{
                            readOnly: true,
                        }}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Fullname"
                        value={userDetails.name || ''}
                        InputProps={{
                            readOnly: true,
                        }}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Email"
                        value={userDetails.email || ''}
                        InputProps={{
                            readOnly: true,
                        }}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Phone"
                        value={userDetails.phone || ''}
                        InputProps={{
                            readOnly: true,
                        }}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Address"
                        value={userDetails.address || ''}
                        InputProps={{
                            readOnly: true,
                        }}
                        margin="normal"
                    />
                </Box>
            )}

            <Button
                variant="contained"
                
                sx={{ marginTop: '20px',background:"#c30010" }}
                onClick={() => navigate(-1)}
            >
                Back
            </Button>
        </Box>
    );
};

export default Profile;
