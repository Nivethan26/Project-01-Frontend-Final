import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Grid,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#FF2E2E", // Red color
    },
    secondary: {
      main: "#FFFFFF", // Gray color
    },
    background: {
      default: "#fffff", // White background
    },
  },
});

export default function AddService() {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    jobId: "",
    jobTitle: "",
    closingDate: "",
    salary: "",
    experience: "",
    jobType: "",
    content1: "",
    content2: "",
    keyResponsibilities: "",
    requirements: "",
    benefits: "",
    image1: null,
  });

  const handleChange = (event) => {
    const { name, type, value, files } = event.target;
    setInputs((prevValues) => ({
      ...prevValues,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("jobId", inputs.jobId);
    formData.append("jobTitle", inputs.jobTitle);
    formData.append("closingDate", inputs.closingDate);
    formData.append("salary", inputs.salary);
    formData.append("experience", inputs.experience);
    formData.append("jobType", inputs.jobType);
    formData.append("content1", inputs.content1);
    formData.append("content2", inputs.content2);
    formData.append("keyResponsibilities", inputs.keyResponsibilities);
    formData.append("requirements", inputs.requirements);
    formData.append("benefits", inputs.benefits);
    formData.append("image1", inputs.image1);

    try {
      const response = await axios.post(
        "http://localhost/Backend/api/indexjob.php",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data);
      navigate("/admin/jobs");
    } catch (error) {
      console.error("There was an error!", error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container sx={{ width: "800px", mt: 5 }}> {/* Increased width */}
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            backgroundColor: theme.palette.secondary.main,
            padding: 3,
            borderRadius: 2,
            boxShadow: 3, // Add shadow effect
          }}
        >
          <Typography variant="h4" align="center" gutterBottom>
            Create Job
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                margin="normal"
                id="jobId"
                name="jobId"
                label="Job ID"
                value={inputs.jobId}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                margin="normal"
                id="jobTitle"
                name="jobTitle"
                label="Job Title"
                value={inputs.jobTitle}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                margin="normal"
                id="closingDate"
                name="closingDate"
                label="Closing Date"
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
                value={inputs.closingDate}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                margin="normal"
                id="salary"
                name="salary"
                label="Salary"
                value={inputs.salary}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                margin="normal"
                id="experience"
                name="experience"
                label="Experience"
                value={inputs.experience}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                margin="normal"
                id="jobType"
                name="jobType"
                label="Job Type"
                value={inputs.jobType}
                onChange={handleChange}
                required
              />
            </Grid>
          </Grid>

          <TextField
            fullWidth
            margin="normal"
            id="content1"
            name="content1"
            label="Content 1"
            multiline
            rows={2}
            value={inputs.content1}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            id="content2"
            name="content2"
            label="Content 2"
            multiline
            rows={2}
            value={inputs.content2}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            id="keyResponsibilities"
            name="keyResponsibilities"
            label="Key Responsibilities"
            multiline
            rows={2}
            value={inputs.keyResponsibilities}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            id="requirements"
            name="requirements"
            label="Requirements"
            multiline
            rows={2}
            value={inputs.requirements}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            id="benefits"
            name="benefits"
            label="Benefits"
            multiline
            rows={2}
            value={inputs.benefits}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            type="file"
            id="image1"
            name="image1"
            onChange={handleChange}
          />
          <Box textAlign="center" sx={{ mt: 2 }}>
            <Button type="submit" variant="contained" color="primary">
              Save
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
