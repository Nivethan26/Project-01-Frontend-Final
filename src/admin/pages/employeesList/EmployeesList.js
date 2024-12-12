import { avatarClasses } from "@mui/material";
import "./employeesList.css";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { DeleteOutline } from "@mui/icons-material";
import { employeesRows } from "../../dummyData";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function EmployeesList() {
  const [data, setData] = useState(employeesRows);

  const handleDelete = (id) => {
    setData(data.filter((item) => item.id !== id));
  };

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "employees",
      headerName: "Employees",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="employeesListUser">
            <img className="employeesListImg" src={params.row.avatar} alt="" />
            {params.row.employeesName}
          </div>
        );
      },
    },
    { field: "email", headerName: "Email", width: 200 },
    { field: "position", headerName: "Position", width: 130 },
    {
      field: "age",
      headerName: "Age",
      width: 80,
    },
    {
      field: "status",
      headerName: "Status",
      width: 100,
    },
    {
      field: "action",
      headerName: "Action",
      width: 120,
      renderCell: (params) => {
        return (
          <>
            <Link to={"/admin/employee/" + params.row.id}>
              <button className="employeesListEdit">Edit</button>
            </Link>
            <DeleteOutline
              className="employeesListDelete"
              onClick={() => handleDelete(params.row.id)}
            />
          </>
        );
      },
    },
  ];

  return (
    <div className="employeesList">
      <DataGrid
        rows={data} // Use the state variable here
        disableRowSelectionOnClick
        columns={columns}
        pageSize={8}
        checkboxSelection
      />
    </div>
  );
}
