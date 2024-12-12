import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Typography, Paper } from '@mui/material'; // Import MUI components
import AddIcon from '@mui/icons-material/Add'; // Import Add icon
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // Import Back arrow icon
import './Employ.css'; // Ensure the correct path

const Employ = () => {
    const [employees, setEmployees] = useState([]); // State to store employee data
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await axios.get('http://localhost/Backend/api/employ.php');
                console.log("API Response:", response.data); // Log the response data
                setEmployees(response.data);
            } catch (error) {
                console.error("Error fetching employees:", error.response || error.message);
                alert("There was an error fetching the employee data.");
            }
        };

        fetchEmployees(); // Call the fetch function
    }, []);

    const goToDetails = (employeeId) => {
        if (employeeId) {
            navigate(`/admin/adminEm/employeeDetails/${employeeId}`);
        }
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 200, headerAlign: 'center', align: 'center' },
        { field: 'username', headerName: 'Username', width: 300, headerAlign: 'center', align: 'center' },
        { field: 'name', headerName: 'Full Name', width: 400, headerAlign: 'center', align: 'center' }
    ];

    return (
        <Paper elevation={3} style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <Typography variant="h4" component="h1" gutterBottom align="center">
                Employee List
            </Typography>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <Button 
                    variant="contained" 
                    color="primary" 
                    startIcon={<AddIcon />} // Add icon to the button
                    onClick={() => navigate('/admin/adminEm/createEmployeeForm')}
                >
                    Create New Employee
                </Button>
                <Button 
                    variant="outlined" 
                    color="secondary" 
                    startIcon={<ArrowBackIcon />} // Add icon to the button
                    onClick={() => navigate('/admin/adminEm')}
                >
                    Back to Admin
                </Button>
            </div>
            <div style={{ height: 500, width: '100%' }}>
                <DataGrid
                    rows={employees}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5, 10, 20]}
                    disableSelectionOnClick
                    getRowId={(row) => row.id}
                    onRowClick={(params) => goToDetails(params.row.id)}
                    sx={{
                        '& .MuiDataGrid-columnHeaders': {
                            backgroundColor: '#f5f5f5',
                        },
                        '& .MuiDataGrid-cell': {
                            padding: '8px', // Set padding for cells
                        },
                        '& .MuiDataGrid-row': {
                            cursor: 'pointer', // Change cursor to pointer on rows
                        },
                    }}
                />
            </div>
        </Paper>
    );
};

export default Employ;
