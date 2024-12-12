import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Grid,
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Create a custom theme
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

export default function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    jobId: '',
    jobTitle: '',
    closingDate: '',
    salary: '',
    experience: '',
    jobType: '',
    content1: '',
    content2: '',
    keyResponsibilities: '',
    requirements: '',
    benefits: '',
    image1: null,
    oldImage1: '',
  });

  useEffect(() => {
    axios
      .get(`http://localhost/Backend/api/indexjob.php/${id}`)
      .then((response) => {
        setInputs({
          ...response.data,
          oldImage1: response.data.image1,
        });
      })
      .catch((error) => console.error('Error fetching job details:', error));
  }, [id]);

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.type === 'file' ? event.target.files[0] : event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();

    formData.append('jobId', inputs.jobId);
    formData.append('jobTitle', inputs.jobTitle);
    formData.append('closingDate', inputs.closingDate);
    formData.append('salary', inputs.salary);
    formData.append('experience', inputs.experience);
    formData.append('jobType', inputs.jobType);
    formData.append('content1', inputs.content1);
    formData.append('content2', inputs.content2);
    formData.append('keyResponsibilities', inputs.keyResponsibilities);
    formData.append('requirements', inputs.requirements);
    formData.append('benefits', inputs.benefits);
    formData.append('oldImage1', inputs.oldImage1);

    if (inputs.image1) {
      formData.append('image1', inputs.image1);
    }

    axios
      .post(`http://localhost/Backend/api/updates.php`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(function (response) {
        console.log(response.data);
        navigate('/admin/jobs');
      });
  };

  return (
    <ThemeProvider theme={theme}>
      <Container sx={{ width: "800px", mt: 5, boxShadow: 3 }}> {/* Added boxShadow */}
        <Typography variant="h4" align="center" gutterBottom>
          Edit Job
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ backgroundColor: theme.palette.secondary.main, p: 3 }}
        >
          <Grid container spacing={2}>
            {/* Job ID and Job Title in one row */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="jobId"
                name="jobId"
                label="Job ID"
                value={inputs.jobId}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="jobTitle"
                name="jobTitle"
                label="Job Title"
                value={inputs.jobTitle}
                onChange={handleChange}
                required
              />
            </Grid>

            {/* Closing Date and Salary in one row */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
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
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="salary"
                name="salary"
                label="Salary"
                value={inputs.salary}
                onChange={handleChange}
                required
              />
            </Grid>

            {/* Experience and Job Type in one row */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="experience"
                name="experience"
                label="Experience"
                value={inputs.experience}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="jobType"
                name="jobType"
                label="Job Type"
                value={inputs.jobType}
                onChange={handleChange}
                required
              />
            </Grid>

            {/* Content1 and Content2 in one row */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="content1"
                name="content1"
                label="Content 1"
                multiline
                rows={2}
                value={inputs.content1}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="content2"
                name="content2"
                label="Content 2"
                multiline
                rows={2}
                value={inputs.content2}
                onChange={handleChange}
                required
              />
            </Grid>

            {/* Other fields */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="keyResponsibilities"
                name="keyResponsibilities"
                label="Key Responsibilities"
                multiline
                rows={2}
                value={inputs.keyResponsibilities}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                id="requirements"
                name="requirements"
                label="Requirements"
                multiline
                rows={2}
                value={inputs.requirements}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                id="benefits"
                name="benefits"
                label="Benefits"
                multiline
                rows={2}
                value={inputs.benefits}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <label htmlFor="image1">Upload Image:</label>
              {inputs.oldImage1 && (
                <Box sx={{ mb: 2 }}>
                  <img
                    src={`http://localhost/Backend/images/${inputs.jobId}/${inputs.oldImage1}`}
                    alt="Old Image"
                    style={{ width: '200px', height: 'auto' }}
                  />
                </Box>
              )}
              <input
                type="file"
                id="image1"
                name="image1"
                onChange={handleChange}
              />
            </Grid>
          </Grid>

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
