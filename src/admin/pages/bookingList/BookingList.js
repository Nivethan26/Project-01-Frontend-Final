import { toast } from 'react-toastify';
import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import Swal from "../../../utils/modernAlert";
import "./BookingList.css";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import FilterListIcon from "@mui/icons-material/FilterList";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";

const STATION_NAMES = {
  1: "Station 01",
  2: "Station 02",
  3: "Station 03",
  4: "Station 04",
};

const STATUS_COLORS = {
  pending: { bg: "#fef9c3", color: "#a16207", label: "Pending" },
  approved: { bg: "#dbeafe", color: "#1d4ed8", label: "Approved" },
  in_progress: { bg: "#ffedd5", color: "#c2410c", label: "In Progress" },
  completed: { bg: "#dcfce7", color: "#16a34a", label: "Completed" },
  rejected: { bg: "#fee2e2", color: "#dc2626", label: "Rejected" },
  cancelled: { bg: "#f3f4f6", color: "#374151", label: "Cancelled" },
};

export default function BookingsList() {
  const [searchParams] = useSearchParams();
  const initialStation = searchParams.get("station") || "";

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stationFilter, setStationFilter] = useState(initialStation);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [employees, setEmployees] = useState([]);
  const [assigningId, setAssigningId] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState("");

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const url = stationFilter
        ? `/Backend/getBookings.php?station_id=${stationFilter}`
        : `/Backend/getBookings.php`;
      const response = await fetch(url);
      const result = await response.json();
      setData(Array.isArray(result) ? result : []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
    setLoading(false);
  }, [stationFilter]);

  const fetchEmployees = async () => {
    try {
      const response = await fetch("/Backend/api/getEmployees.php");
      const result = await response.json();
      if (result.success && Array.isArray(result.data)) {
        setEmployees(result.data);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  useEffect(() => {
    fetchBookings();
    fetchEmployees();
  }, [fetchBookings]);

  // Update station filter when URL params change
  useEffect(() => {
    const station = searchParams.get("station") || "";
    setStationFilter(station);
  }, [searchParams]);

  const handleStatusUpdate = async (bookingId, newStatus) => {
    const confirmResult = await Swal.fire({
      title: `${newStatus === "rejected" ? "Reject" : newStatus === "approved" ? "Approve" : newStatus === "in_progress" ? "Start" : "Complete"} Booking #${bookingId}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    });

    if (!confirmResult.isConfirmed) return;

    try {
      const response = await fetch("/Backend/updateBookingStatus.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ booking_id: bookingId, status: newStatus }),
      });
      const result = await response.json();
      if (result.success) {
        toast.success(result.message);
        fetchBookings();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleAssignEmployee = async (bookingId) => {
    if (!selectedEmployee) {
      toast.warning("Please select an employee first");
      return;
    }

    try {
      const response = await fetch("/Backend/updateBookingStatus.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          booking_id: bookingId,
          status: "in_progress",
          assigned_employee_id: parseInt(selectedEmployee),
        }),
      });
      const result = await response.json();
      if (result.success) {
        toast.success("Employee assigned and job started");
        setAssigningId(null);
        setSelectedEmployee("");
        fetchBookings();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to assign employee");
    }
  };

  // Apply filters
  const filteredData = data.filter((row) => {
    if (statusFilter && row.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        (row.name || "").toLowerCase().includes(q) ||
        (row.email || "").toLowerCase().includes(q) ||
        (row.vehicle_number || "").toLowerCase().includes(q) ||
        String(row.id).includes(q)
      );
    }
    return true;
  });

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "station_id",
      headerName: "Station",
      width: 100,
      renderCell: (params) => (
        <span className="bl-station-chip">
          {STATION_NAMES[params.value] || `#${params.value}`}
        </span>
      ),
    },
    { field: "name", headerName: "Name", width: 130 },
    { field: "vehicle_number", headerName: "Vehicle", width: 120 },
    { field: "vehicle_model", headerName: "Model", width: 120 },
    { field: "date", headerName: "Date", width: 110 },
    { field: "timeslot", headerName: "Timeslot", width: 150 },
    {
      field: "status",
      headerName: "Status",
      width: 130,
      renderCell: (params) => {
        const status = STATUS_COLORS[params.value] || STATUS_COLORS.pending;
        return (
          <span
            className="bl-status-badge"
            style={{ backgroundColor: status.bg, color: status.color }}
          >
            {status.label}
          </span>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 280,
      sortable: false,
      renderCell: (params) => {
        const { id, status } = params.row;

        if (status === "pending") {
          return (
            <div className="bl-actions">
              <button className="bl-btn bl-btn-approve" onClick={() => handleStatusUpdate(id, "approved")}>
                <CheckCircleIcon fontSize="small" /> Approve
              </button>
              <button className="bl-btn bl-btn-reject" onClick={() => handleStatusUpdate(id, "rejected")}>
                <CancelIcon fontSize="small" /> Reject
              </button>
            </div>
          );
        }

        if (status === "approved") {
          if (assigningId === id) {
            return (
              <div className="bl-actions">
                <select
                  className="bl-employee-select"
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(e.target.value)}
                >
                  <option value="">Select Employee</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>{emp.name}</option>
                  ))}
                </select>
                <button className="bl-btn bl-btn-assign" onClick={() => handleAssignEmployee(id)}>
                  Assign
                </button>
              </div>
            );
          }
          return (
            <div className="bl-actions">
              <button className="bl-btn bl-btn-start" onClick={() => setAssigningId(id)}>
                <PlayArrowIcon fontSize="small" /> Assign & Start
              </button>
            </div>
          );
        }

        if (status === "in_progress") {
          return (
            <div className="bl-actions">
              <button className="bl-btn bl-btn-complete" onClick={() => handleStatusUpdate(id, "completed")}>
                <DoneAllIcon fontSize="small" /> Complete
              </button>
            </div>
          );
        }

        if (status === "cancelled") {
          return <span style={{ color: "#6b7280", fontSize: "13px" }}>✗ Cancelled by user</span>;
        }

        if (status === "completed") {
          return <span style={{ color: "#16a34a", fontSize: "13px" }}>✓ Completed</span>;
        }

        if (status === "rejected") {
          return <span style={{ color: "#dc2626", fontSize: "13px" }}>✗ Rejected</span>;
        }

        return <span style={{ color: "#94a3b8", fontSize: "13px" }}>—</span>;
      },
    },
  ];

  return (
    <div className="bl-container">
      <div className="bl-header">
        <h2 className="bl-title">Booking Management</h2>
        <button className="bl-refresh-btn" onClick={fetchBookings}>
          <RefreshIcon fontSize="small" /> Refresh
        </button>
      </div>

      <div className="bl-filters">
        <div className="bl-filter-group">
          <FilterListIcon fontSize="small" style={{ color: "#94a3b8" }} />
          <select value={stationFilter} onChange={(e) => setStationFilter(e.target.value)} className="bl-select">
            <option value="">All Stations</option>
            <option value="1">Station 01</option>
            <option value="2">Station 02</option>
            <option value="3">Station 03</option>
            <option value="4">Station 04</option>
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bl-select">
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="rejected">Rejected</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div className="bl-search-wrapper">
          <SearchIcon fontSize="small" style={{ color: "#94a3b8" }} />
          <input
            type="text"
            placeholder="Search by name, email, vehicle..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bl-search-input"
          />
        </div>
      </div>

      <div className="bl-grid-wrapper">
        <DataGrid
          rows={filteredData}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50]}
          disableRowSelectionOnClick
          loading={loading}
          autoHeight
          sx={{
            border: "none",
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#f8fafc",
              fontWeight: 600,
              fontSize: "13px",
              color: "#475569",
            },
            "& .MuiDataGrid-cell": {
              fontSize: "13px",
              display: "flex",
              alignItems: "center",
            },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: "#f8fafc",
            },
          }}
        />
      </div>
    </div>
  );
}
