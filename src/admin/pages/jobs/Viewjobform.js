import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button, CircularProgress, Typography, Select, MenuItem } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';

export default function ListApplications() {
    const [applications, setApplications] = useState([]);
    const [filteredApplications, setFilteredApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedJobId, setSelectedJobId] = useState('');

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const response = await axios.get('http://localhost/Backend/api/viewApplyjob.php');
            console.log('API Response:', response.data);
            if (Array.isArray(response.data)) {
                setApplications(response.data);
                setFilteredApplications(response.data);
            } else {
                console.error('Expected an array but got:', response.data);
                setApplications([]);
                setFilteredApplications([]);
            }
        } catch (error) {
            console.error('Error fetching applications:', error);
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        const selectedValue = e.target.value;
        setSelectedJobId(selectedValue);

        if (selectedValue === '') {
            setFilteredApplications(applications);
        } else {
            const filtered = applications.filter(app => app.jobId === selectedValue);
            setFilteredApplications(filtered);
        }
    };

    if (loading) return <CircularProgress />;
    if (error) return <Typography variant="h6" color="error">Error fetching applications: {error.message}</Typography>;

    const columns = [
        { field: 'id', headerName: '#', width: 50 },
        { field: 'jobId', headerName: 'Job ID', width: 150 },
        { field: 'name', headerName: 'Name', width: 200 },
        { field: 'email', headerName: 'Email', width: 250 },
        { field: 'phone', headerName: 'Phone', width: 200 },
        {
            field: 'cv',
            headerName: 'CV',
            width: 200,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    // sx={{background:'#c30010'}}
                    startIcon={<DownloadIcon />}
                    href={`http://localhost/Backend/api/downloadCv.php?id=${params.row.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Download CV
                </Button>
            ),
        },
    ];

    const uniqueJobIds = [...new Set(applications.map(app => app.jobId))];

    return (
        <div>
            <div style={{ height: 500, width: '100%' }}>
                <DataGrid
                    rows={filteredApplications}
                    columns={columns}
                    pageSize={8}
                    disableRowSelectionOnClick
                    checkboxSelection
                />
            </div>
        </div>
    );
}
