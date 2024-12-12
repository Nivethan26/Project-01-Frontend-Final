import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { DeleteOutline, Edit, Add } from "@mui/icons-material";
import { Button, Typography, CircularProgress, Box } from "@mui/material";
import Swal from "sweetalert2";
import "./List.css";

export default function ListJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getJobs();
  }, []);

  const getJobs = async () => {
    try {
      const response = await axios.get("http://localhost/Backend/api/indexjob.php");
      console.log("API Response:", response.data);
      if (Array.isArray(response.data)) {
        setJobs(response.data);
      } else {
        console.error("Unexpected response data format:", response.data);
        setJobs([]);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  
  const handleDelete = async (id) => {
    // Display SweetAlert2 confirmation popup
    const confirmDelete = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    });
  
    if (confirmDelete.isConfirmed) {
      try {
        await axios.delete(`http://localhost/Backend/api/deletejob.php?delete=${id}`);
        setJobs(jobs.filter((job) => job.id !== id));
        Swal.fire({
          title: 'Deleted!',
          text: 'The course has been deleted.',
          icon: 'success',
          confirmButtonText: 'OK',
        });
      } catch (error) {
        console.error("Error deleting job:", error);
        Swal.fire({
          title: 'Error!',
          text: 'There was an issue deleting the job. Please try again.',
          icon: 'error',
          confirmButtonText: 'Retry',
        });
      }
    } else {
      // User clicked 'cancel' or closed the popup
      console.log("Delete operation was canceled");
    }
  };
  

  const columns = [
    { field: "jobId", headerName: "Job ID", width: 100 },
    { field: "jobTitle", headerName: "Job Title", width: 150 },
    { field: "experience", headerName: "Experience", width: 120 },
    { field: "salary", headerName: "Salary", width: 100 },
    { field: "jobType", headerName: "Job Type", width: 150 },
    { field: "keyResponsibilities", headerName: "Responsibilities", width: 200 },
    { field: "requirements", headerName: "Requirements", width: 200 },
    { field: "benefits", headerName: "Benefits", width: 200 },
    { field: "content1", headerName: "Content 1", width: 200 },
    { field: "content2", headerName: "Content 2", width: 200 },
    {
      field: "image1",
      headerName: "Image",
      width: 100,
      renderCell: (params) => (
        <img
          style={{ width: "100px", height: "100px", objectFit: "cover" }}
          src={`http://localhost/Backend/images/${params.row.jobId}/${params.row.image1}`}
          alt={params.row.jobTitle}
        />
      ),
    },
    {
      field: "action",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <>
          <Link to={`/admin/jobs/job/${params.row.id}/edit`}>
            <Edit className="action-icon mx-1" />
          </Link>
          <DeleteOutline
            className="action-icon mx-1"
            onClick={() => handleDelete(params.row.id)}
          />
        </>
      ),
    },
  ];

  if (loading) return <CircularProgress />;
  if (error) return <Typography variant="h6" color="error">Error fetching jobs!</Typography>;

  return (
    <div className="jobsList">
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button
          variant="contained"
          color="primary"
          /*sx={{background:'#c30010'}}*/
          startIcon={<Add />}
          component={Link}
          to="/admin/jobs/job/create"
        >
          Add Job
        </Button>
      </Box>
      <DataGrid
        rows={jobs}
        columns={columns}
        pageSize={8}
        disableRowSelectionOnClick
        checkboxSelection
        rowHeight={60}
      />
    </div>
  );
}