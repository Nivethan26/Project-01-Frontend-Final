import { toast } from 'react-toastify';
import React, { useEffect, useState } from 'react';
import Swal from "../../utils/modernAlert";
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Avatar, Grid, TextField, Button, Typography } from '@mui/material';

const ProfileUpdate = () => {
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

    useEffect(() => {
        const fetchEmployeeDetails = async () => {
            setLoading(true); // Start loading when fetching begins
        
            try {
                console.log("Fetching details for user ID:", id);
                const response = await axios.get(`http://localhost/Backend/api/getUserDetails.php?id=${id}`, { withCredentials: true });
                const data = response.data;
                console.log("API Response:", data);

                if (data && data.success) {
                    const userData = data.data;
                    setUserDetails(userData);
                    setFormData({
                        username: userData.username || '',
                        name: userData.name || '',
                        email: userData.email || '',
                        phone: userData.phone || '',
                        address: userData.address || '',
                    });
                } else {
                    // Show error popup for user not found
                    await ( toast.error('The user you are trying to fetch was not found.'), new Promise(res => setTimeout(res, 2000)) );

                    // Navigate back if user is not found
                    navigate(`/welcome/${id}`);
                }
            } catch (error) {
                // Show error popup for failed fetch
                if (error.response && error.response.status === 401) {
                    await ( toast.error('Your session has expired. Please login again.'), new Promise(res => setTimeout(res, 2000)) );
                    navigate('/login');
                } else {
                    await ( toast.error('Failed to load details. Please try again later.'), new Promise(res => setTimeout(res, 2000)) );
                    navigate(`/welcome/${id}`);
                }
            } finally {
                setLoading(false); // Stop loading after fetch completes
            }
        };

        fetchEmployeeDetails();
        }, [id, navigate]);
         // Ensure 'id' and 'navigate' are passed as dependencies

    const handleUpdate = async (event) => {
        event.preventDefault();
    
        // Ask for confirmation before updating the user profile
        const { isConfirmed } = await Swal.fire({
            title: 'Update Profile',
            text: "Do you want to update the profile?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, update!',
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
    
        const updatedData = formData; // Use formData directly
    
        try {
            const updateResponse = await axios.post(`http://localhost/Backend/api/updateUser.php`, {
                ...updatedData,
                id: id,
            }, { withCredentials: true });

            if (updateResponse.data.success) {
                setUserDetails(prevDetails => ({ ...prevDetails, ...updatedData })); // Update only changed fields
    
                // Display success popup with SweetAlert2
                toast.success('User details updated successfully');
            } else {
                // Display error popup with SweetAlert2 for failed update
                toast.error(updateResponse.data.message);
            }
        } catch (err) {
            // Display error popup with SweetAlert2 for catch block
            toast.error('Error updating user details. Please try again.');
        }
    };
    

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    if (loading) return <p>Loading...</p>;
    if (!userDetails) return <p>No user details available.</p>;

    return (
        <Box sx={{ maxWidth: '800px', margin: '150px auto', padding: '20px', boxShadow: 3, borderRadius: 2, backgroundColor: '#f9f9f9' }}>
            <Typography variant="h4" align="center" gutterBottom>
                Hello, {userDetails.name}
            </Typography>
            
            <Avatar
                src={userDetails?.profilePicture || "https://img.icons8.com/color/96/000000/person-male.png"}
                alt="Profile"
                sx={{ width: 100, height: 100, margin: '0 auto 20px' }}
            />

            <Box component="form" onSubmit={handleUpdate}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="ID"
                            value={userDetails.id}
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            inputProps={{
                                pattern: "^[a-zA-Z0-9_]{3,20}$",
                                title: "Username must be 3-20 characters long and can contain letters, numbers, and underscores.",
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Fullname"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            inputProps={{
                                pattern: "[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$",
                                title: "Please enter a valid email address.",
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            inputProps={{
                                pattern: "^\\d{10}$",
                                title: "Phone number must be exactly 10 digits.",
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                </Grid>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 3 }}>
                    <Button type="submit" variant="contained" >
                        Update
                    </Button>
                    <Button onClick={() => navigate(`/welcome/${id}`)} variant="contained" color="error">
                        Cancel
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default ProfileUpdate;
