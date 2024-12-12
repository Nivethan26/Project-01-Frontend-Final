import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { TextField, Button, Typography, Alert } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Create a custom theme
const theme = createTheme({
    palette: {
        primary: {
            main: '#FF2E2E', // Red color
        },
        secondary: {
            main: '#B0BEC5', // Gray color
        },
        background: {
            default: '#FFFFFF', // White background
        },
        text: {
            primary: '#000000', // Black text
        },
    },
});

const EditLeaveType = () => {
    const { id } = useParams();
    const [leaveType, setLeaveType] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState(''); // New state for success messages

    useEffect(() => {
        const fetchLeaveType = async () => {
            try {
                const response = await axios.get(`http://localhost/Backend/api/editleaveType.php?id=${id}`);
                if (response.data.success) {
                    setLeaveType(response.data.leave_type);
                } else {
                    setErrorMessage(response.data.message);
                }
            } catch (error) {
                console.error("Error fetching the leave type:", error);
                setErrorMessage("Error fetching the leave type. Please try again.");
            }
        };

        fetchLeaveType();
    }, [id]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const trimmedLeaveType = leaveType.trim();
        if (trimmedLeaveType === '') {
            alert("Leave type cannot be empty.");
            return;
        }

        if (window.confirm(`Are you sure you want to update the leave type to: ${trimmedLeaveType}?`)) {
            try {
                const formData = new FormData();
                formData.append('leave_type', trimmedLeaveType);
                formData.append('id', id);

                const response = await axios.post('http://localhost/Backend/api/editleaveType.php', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                console.log(response.data);

                if (response.data && response.data.success) {
                    setSuccessMessage(response.data.message);
                    setErrorMessage(''); // Clear error message if update was successful
                } else {
                    setErrorMessage("Failed to update leave type. " + (response.data.message || 'Unknown error.'));
                }
            } catch (error) {
                console.error("Error updating the leave type:", error);
                setErrorMessage("Error updating the leave type. Please try again.");
            }
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', backgroundColor: theme.palette.background.default }}>
                <Typography variant="h4" component="h1" gutterBottom align="center" >
                    Edit Leave Type
                </Typography>
                {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
                {successMessage && <Alert severity="success">{successMessage}</Alert>} {/* Display success message */}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <TextField
                        label="Leave Type"
                        variant="outlined"
                        value={leaveType}
                        onChange={(e) => setLeaveType(e.target.value)}
                        required
                    />
                    <Button type="submit" variant="contained" color="primary">
                        Update Leave Type
                    </Button>
                </form>
                <br />
                <Link to="/admin/adminEm/leaveTypes" style={{ textDecoration: 'none' }}>
                    <Button variant="outlined" color="secondary">Back to Leave Types</Button>
                </Link>
            </div>
        </ThemeProvider>
    );
};

export default EditLeaveType;
