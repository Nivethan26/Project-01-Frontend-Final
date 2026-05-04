import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";

const MessagesList = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/Backend/getMessages.php", {
          method: "GET",
          credentials: "include",
          headers: {
            Accept: "application/json",
          },
        });

        const contentType = response.headers.get("content-type") || "";
        const rawText = await response.text();

        let result = null;
        if (rawText) {
          try {
            result = JSON.parse(rawText);
          } catch (_) {
            result = null;
          }
        }

        if (!response.ok) {
          const msg =
            result?.error ||
            result?.message ||
            `Request failed (HTTP ${response.status}).`;
          throw new Error(msg);
        }

        if (!contentType.includes("application/json") || !Array.isArray(result)) {
          throw new Error("Unexpected response from server.");
        }

        setData(result);
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
