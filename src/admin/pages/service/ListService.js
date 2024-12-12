import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { DeleteOutline, Edit, Add } from "@mui/icons-material"; // Import Add icon
// Assuming you have a CSS file for styling
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function ListService() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getServices();

  }, []);

  const getServices = async () => {
    try {
      const response = await axios.get("http://localhost/Backend/api/service.php");
      console.log("API Response:", response.data);
      if (Array.isArray(response.data)) {
        setServices(response.data);
      } else {
        console.error("Unexpected response data format:", response.data);
        setServices([]);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };


  const handleDelete = async (id) => {
    // Show SweetAlert2 confirmation popup
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this service?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
      confirmButtonColor: "#d33",  // Red color for the delete action
      cancelButtonColor: "#3085d6",  // Blue color for the cancel action
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Proceed with the delete request if confirmed
          await axios.delete(`http://localhost/Backend/api/deleteservice.php?delete=${id}`);
          setServices(services.filter((service) => service.id !== id));
          
          // Success popup
          Swal.fire({
            title: "Deleted!",
            text: "The service has been deleted.",
            icon: "success",
            confirmButtonText: "OK",
            confirmButtonColor: "#28a745",  // Green color for success
          });
        } catch (error) {
          console.error("Error deleting service:", error);
          
          // Error popup if something goes wrong
          Swal.fire({
            title: "Error!",
            text: "There was an error deleting the service.",
            icon: "error",
            confirmButtonText: "Retry",
            confirmButtonColor: "#e74c3c",  // Red color for error
          });
        }
      }
    });
  };
  

  const columns = [
    { field: "serviceId", headerName: "Service ID", width: 150 },
    { field: "serviceName", headerName: "Service Name", width: 250 },
    {
      field: "content1",
      headerName: "Content",
      width: 300,
    },
    {
      field: "image1",
      headerName: "Image",
      width: 200,
      renderCell: (params) => (
        <img
          style={{ width: "100px", height: "100px", objectFit: "cover" }}
          src={`http://localhost/Backend/images/${params.row.serviceId}/${params.row.image1}`}
          alt={params.row.serviceName}
        />
      ),
    },
    {
      field: "action",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => (
        <>
          <Link to={`service/${params.row.id}/edit`}>
            <Edit className="action-icon mx-1" /> {/* Pen edit icon */}
          </Link>
          <DeleteOutline
            className="action-icon mx-5"
            onClick={() => handleDelete(params.row.id)}
          />
        </>
      ),
    },
  ];

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching services!</p>;

  return (
    <div className="servicesList">
      <div className="d-flex justify-content-end mb-3"> {/* Remove col-2 to let it take full width */}
        <Link
          to="service/create"
          className="btn btn-sm"
          style={{ backgroundColor: 'blue', color: 'white' }} // Blue background with white text
        >
          <Add className="me-2" /> Add Service {/* Add icon before the text */}
        </Link>

      </div>
      <DataGrid
        rows={services}
        disableRowSelectionOnClick
        columns={columns}
        pageSize={8}
        checkboxSelection
        rowHeight={60}
      />
    </div>
  );
}