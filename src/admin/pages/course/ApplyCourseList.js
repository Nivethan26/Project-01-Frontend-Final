import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CircularProgress, Container, Typography } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

export default function ListApplications() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await axios.get('http://localhost/Backend/api/viewApplyCourse.php');
                console.log(response.data);
                setApplications(Array.isArray(response.data) ? response.data : []);
            } catch (error) {
                setError('Error fetching applications');
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, []);

    // Show loading spinner while data is being fetched
    if (loading) {
        return (
            <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Container>
        );
    }

    // Display error message if there's an issue fetching data
    if (error) {
        return (
            <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Typography color="error">{error}</Typography>
            </Container>
        );
    }

    // Define columns for DataGrid
    const columns = [
        { field: 'id', headerName: '#', width: 70 },
        { field: 'course_id', headerName: 'Course ID', width: 150 },
        { field: 'name', headerName: 'Name', width: 200 },
        { field: 'email', headerName: 'Email', width: 250 },
        { field: 'phone', headerName: 'Phone', width: 150 },
        { field: 'created_at', headerName: 'Applied At', width: 200 },
    ];

    // Prepare rows with an added `id` field for DataGrid
    const rows = applications.map((application, index) => ({
        id: index + 1,  // Assigning row IDs for DataGrid
        ...application
    }));

    return (
        <Container style={{ padding: '20px', backgroundColor: '' }}>
            <Typography variant="h4" align="center" gutterBottom>
                List of Applications
            </Typography>
            <div style={{ height: 600, width: '100%', backgroundColor: 'white' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[5, 10, 20, 50, 100]}
                    checkboxSelection // Enable checkbox selection
                    disableSelectionOnClick
                    autoHeight
                    components={{
                        Toolbar: GridToolbar, // Adding the DataGrid Toolbar
                    }}
                    style={{ backgroundColor: 'white' }} // Set DataGrid background color to white
                />
            </div>
        </Container>
    );
}
