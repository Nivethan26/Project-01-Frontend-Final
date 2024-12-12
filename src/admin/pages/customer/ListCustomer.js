import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material';

const Listcustomer = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]); // State to track selected rows

  // Function to fetch customer data from the backend
  const fetchCustomers = async () => {
    try {
      const response = await axios.get('http://localhost/Backend/api/getCustomers.php'); // Update with your API endpoint
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch customers when the component mounts
  useEffect(() => {
    fetchCustomers();
  }, []);

  // Define columns for the DataGrid
  const columns = [
    { field: 'id', headerName: 'ID', width: 150 },
    { field: 'username', headerName: 'Username', width: 350 },
    { field: 'email', headerName: 'Email', width: 200 },
  ];

  // Handle selection change
  const handleSelectionModelChange = (newSelection) => {
    setSelectedRows(newSelection);
  };

  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <h1>List Customers</h1>
      <DataGrid
        rows={customers}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        loading={loading}
        disableSelectionOnClick
        autoHeight
        getRowId={(row) => row.id}
        checkboxSelection // Enable checkbox selection
        onSelectionModelChange={handleSelectionModelChange} // Track selected rows
        selectionModel={selectedRows} // Control the selected rows
      />
      {/* Example: Display selected rows */}
      <div>
        <h2>Selected Rows:</h2>
        <ul>
          {selectedRows.map(id => (
            <li key={id}>ID: {id}</li>
          ))}
        </ul>
      </div>
    </Box>
  );
};

export default Listcustomer;
