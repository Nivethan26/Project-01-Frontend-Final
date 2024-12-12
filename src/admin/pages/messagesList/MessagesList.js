import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";

const MessagesList = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost/Backend/getMessages.php"
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const result = await response.json();
          if (result.error) {
            throw new Error(result.error);
          }
          setData(result);
        } else {
          const text = await response.text();
          throw new Error(`Response is not JSON: ${text}`);
        }
      } catch (error) {
        setError(error.message);
        console.error("Error fetching messages:", error);
      }
    };

    fetchData();
  }, []);

  const columns = [
    { field: "id", headerName: "ID", width: 20 },
    { field: "first_name", headerName: "Full Name", width: 100 },
    { field: "phone", headerName: "Phone", width: 120 },
    { field: "email", headerName: "Email", width: 150 },
    { field: "message", headerName: "Message", width: 300 },
    { field: "created_at", headerName: "Created At", width: 200 },
  ];

  return (
    <div className="messagesListContainer">
      {error && <p>Error: {error}</p>}
      <DataGrid
        rows={data}
        disableRowSelectionOnClick
        columns={columns}
        pageSize={8}
        checkboxSelection
      />
    </div>
  );
};

export default MessagesList;
