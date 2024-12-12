import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography, CircularProgress, ThemeProvider, createTheme } from '@mui/material';

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#FF2E2E", // Red color for primary buttons
    },
    secondary: {
      main: "#FFFFFF", // White for secondary buttons
    },
    background: {
      default: "#FFFFFF", // Light background color
    },
  },
});

const CreateEmployeeForm = () => {
    const [formData, setFormData] = useState({
        employeeId: '',
        username: '',
        fullName: '',
        email: '',
        phone: '',
        address: ''
    });

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const response = await fetch('http://localhost/Backend/api/newEmployee.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (response.ok) {
                alert('Successfully created the employee.');
                navigate('/admin/adminEm/employ');
            } else {
                alert(result.message || 'An error occurred.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Successfully created the employee.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px',
                    backgroundColor: theme.palette.background.default,
                    borderRadius: '8px',
                    maxWidth: '500px',
                    margin: '0 auto'
                }}
            >
                <Typography variant="h4" component="h1" gutterBottom>
                    Create New Employee
                </Typography>

                <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Employee ID"
                        id="employeeId"
                        name="employeeId"
                        required
                        value={formData.employeeId}
                        onChange={handleChange}
                    />

                    <TextField
                        fullWidth
                        margin="normal"
                        label="Username"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                    />

                    <TextField
                        fullWidth
                        margin="normal"
                        label="Full Name"
                        id="fullName"
                        name="fullName"
                        required
                        pattern="[A-Za-z\s]+"
                        title="Please enter a valid full name (letters and spaces only)"
                        value={formData.fullName}
                        onChange={handleChange}
                    />

                    <TextField
                        fullWidth
                        margin="normal"
                        label="Email"
                        type="email"
                        id="email"
                        name="email"
                        required
                        pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}"
                        title="Please enter a valid email address"
                        value={formData.email}
                        onChange={handleChange}
                    />

                    <TextField
                        fullWidth
                        margin="normal"
                        label="Phone"
                        id="phone"
                        name="phone"
                        required
                        pattern="\d{10,15}"
                        title="Please enter a valid phone number (10 to 15 digits)"
                        value={formData.phone}
                        onChange={handleChange}
                    />

                    <TextField
                        fullWidth
                        margin="normal"
                        label="Address"
                        id="address"
                        name="address"
                        required
                        value={formData.address}
                        onChange={handleChange}
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ marginTop: '20px', height: '50px' }}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Create'}
                    </Button>
                </Box>

                <Button
                    variant="outlined"
                    color="secondary"
                    fullWidth
                    sx={{ marginTop: '10px', height: '50px', color: '#FF2E2E', borderColor: '#FF2E2E' }} // Custom secondary button styling
                    onClick={() => navigate('/admin/adminEm/employ')}
                >
                    Back to Employee List
                </Button>
            </Box>
        </ThemeProvider>
    );
};

export default CreateEmployeeForm;
