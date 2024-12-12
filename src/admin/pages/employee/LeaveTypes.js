import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid'; // Import DataGrid from MUI
import Swal from "sweetalert2";


const LeaveTypes = () => {
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaveTypes();
  }, []);

  const fetchLeaveTypes = async () => {
    try {
      const response = await axios.get('http://localhost/Backend/api/leaveTypes.php');
      setLeaveTypes(response.data);
    } catch (error) {
      console.error("Error fetching leave types:", error);
      setError("Failed to fetch leave types.");
    } finally {
      setLoading(false);
    }
  };

  const deleteLeaveType = async (id) => {
    // Show SweetAlert2 confirmation popup
    const confirmDelete = await Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to delete this leave type.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it!',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    });
  
    // If the user confirms the deletion
    if (confirmDelete.isConfirmed) {
      try {
        const formData = new FormData();
        formData.append('delete', id);
  
        const response = await axios.post('http://localhost/Backend/api/leaveTypes.php', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
  
        console.log(response.data);
  
        if (response.data && response.data.success) {
          // Show success message
          Swal.fire({
            title: 'Deleted!',
            text: response.data.message,
            icon: 'success',
            confirmButtonText: 'OK',
          });
  
          // Remove the deleted leave type from the state
          setLeaveTypes((prevLeaveTypes) => prevLeaveTypes.filter((type) => type.id !== id));
        } else {
          // Show error message if deletion fails
          Swal.fire({
            title: 'Error!',
            text: "Failed to delete leave type. " + (response.data.message || 'Unknown error.'),
            icon: 'error',
            confirmButtonText: 'Retry',
          });
        }
      } catch (error) {
        console.error("Error deleting leave type:", error);
        // Show error popup for network issues or server error
        Swal.fire({
          title: 'Error!',
          text: 'Error deleting the leave type. Please try again.',
          icon: 'error',
          confirmButtonText: 'Retry',
        });
      }
    }
  };
  

  const columns = [
    { field: 'id', headerName: '#', width: 150, headerAlign: 'center', align: 'center' },
    { field: 'leave_type', headerName: 'Leave Type', flex: 1, headerAlign: 'center', align: 'center' },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 300,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <>
          <a href={`/admin/adminEm/edit/${params.row.id}`} className="btn btn-edit" style={{ color: 'blue', marginRight: 8 }}>
            <i className="fas fa-edit"></i>
          </a>
          <a href="#" className="btn btn-delete" onClick={(e) => { e.preventDefault(); deleteLeaveType(params.row.id); }} style={{ color: 'red' }}>
            <i className="fas fa-trash-alt"></i>
          </a>
        </>
      )
    }
  ];

  return (
    <div>
      <a href="/admin/adminEm/addleaveType" style={{ color: 'green', fontSize: '20px' }}>
        <i className="fas fa-plus-circle" style={{ fontSize: '24px' }}></i> Add New
      </a>
      <a href="/admin/adminEm" className="back-button">Back to Admin</a>
      <h1>Leave Types</h1>
      {loading ? (
        <p>Loading leave types...</p>
      ) : (
        <div style={{ height: 400, width: '100%' }}>
          {error && <p className="error">{error}</p>}
          <DataGrid
            rows={leaveTypes}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
            disableSelectionOnClick
            getRowId={(row) => row.id} // Ensure that each row has a unique 'id'
          />
        </div>
      )}
    </div>
  );
};

export default LeaveTypes;