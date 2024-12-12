import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  Paper,
  FormControl,
} from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles"; // Import theme utilities

// Create a theme with gray and red colors
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

export default function AddCourse() {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    courseId: '',
    courseName: '',
    courseDuration: '',
    courseFee: '',
    content1: '',
    content2: '',
    image1: null,
    image2: null,
  });

  const [errors, setErrors] = useState({});
  const [previewImage1, setPreviewImage1] = useState(null);
  const [previewImage2, setPreviewImage2] = useState(null);

  const handleChange = (event) => {
    const { name, type, value, files } = event.target;
    setInputs((values) => ({
      ...values,
      [name]: type === 'file' ? files[0] : value,
    }));

    if (type === 'file') {
      const file = files[0];
      if (name === 'image1') {
        setPreviewImage1(URL.createObjectURL(file));
      } else if (name === 'image2') {
        setPreviewImage2(URL.createObjectURL(file));
      }
    }
  };

  const validate = () => {
    let tempErrors = {};
    tempErrors.courseId = inputs.courseId ? "" : "This field is required.";
    tempErrors.courseName = inputs.courseName ? "" : "This field is required.";
    tempErrors.courseDuration = inputs.courseDuration ? "" : "This field is required.";
    tempErrors.courseFee = inputs.courseFee ? "" : "This field is required.";
    setErrors(tempErrors);
    return Object.values(tempErrors).every(x => x === "");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) return;

    const formData = new FormData();
    formData.append('courseId', inputs.courseId);
    formData.append('courseName', inputs.courseName);
    formData.append('courseDuration', inputs.courseDuration);
    formData.append('courseFee', inputs.courseFee);
    formData.append('content1', inputs.content1);
    formData.append('content2', inputs.content2);
    formData.append('image1', inputs.image1);
    formData.append('image2', inputs.image2);

    try {
      const response = await axios.post('http://localhost/Backend/api/index.php', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data);
      navigate('/admin/courses');
    } catch (error) {
      console.error("There was an error!", error);
    }
  };

  return (
    <ThemeProvider theme={theme}> {/* Apply the custom theme */}
      <Container component="main" maxWidth="sm" sx={{ mt: 5 }}>
        <Paper elevation={3} sx={{ padding: 2 }}>
          <Typography variant="h5" align="center" gutterBottom>
            Create Course
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Course ID"
                  name="courseId"
                  value={inputs.courseId}
                  onChange={handleChange}
                  fullWidth
                  required
                  error={!!errors.courseId}
                  helperText={errors.courseId}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Course Name"
                  name="courseName"
                  value={inputs.courseName}
                  onChange={handleChange}
                  fullWidth
                  required
                  error={!!errors.courseName}
                  helperText={errors.courseName}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Course Duration"
                  name="courseDuration"
                  value={inputs.courseDuration}
                  onChange={handleChange}
                  fullWidth
                  required
                  error={!!errors.courseDuration}
                  helperText={errors.courseDuration}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Course Fee"
                  name="courseFee"
                  value={inputs.courseFee}
                  onChange={handleChange}
                  fullWidth
                  required
                  error={!!errors.courseFee}
                  helperText={errors.courseFee}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Content 1"
                  name="content1"
                  value={inputs.content1}
                  onChange={handleChange}
                  fullWidth
                  multiline
                  rows={3}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Content 2"
                  name="content2"
                  value={inputs.content2}
                  onChange={handleChange}
                  fullWidth
                  multiline
                  rows={3}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box display="flex" flexDirection="column" alignItems="center">
                  <Button variant="contained" component="label" startIcon={<PhotoCamera />}>
                    Upload Image 1
                    <input
                      type="file"
                      name="image1"
                      onChange={handleChange}
                      hidden
                      required
                    />
                  </Button>
                  {previewImage1 && <img src={previewImage1} alt="Image 1 Preview" style={{ marginTop: 10, width: '100%', maxHeight: 200 }} />}
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box display="flex" flexDirection="column" alignItems="center">
                  <Button variant="contained" component="label" startIcon={<PhotoCamera />}>
                    Upload Image 2
                    <input
                      type="file"
                      name="image2"
                      onChange={handleChange}
                      hidden
                      required
                    />
                  </Button>
                  {previewImage2 && <img src={previewImage2} alt="Image 2 Preview" style={{ marginTop: 10, width: '100%', maxHeight: 200 }} />}
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Box textAlign="center">
                  <Button type="submit" variant="contained" color="primary">
                    Save
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>
    </ThemeProvider>
  );
}
