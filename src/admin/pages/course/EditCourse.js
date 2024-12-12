import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  Paper,
} from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

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
export default function EditCourse() {
  const { id } = useParams();
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
    oldImage1: null,
    oldImage2: null,
  });

  useEffect(() => {
    axios.get(`http://localhost/Backend/api/index.php/${id}`)
      .then(response => {
        setInputs({
          ...response.data,
          oldImage1: response.data.image1,
          oldImage2: response.data.image2,
        });
      })
      .catch(error => console.error('Error fetching course:', error));
  }, [id]);

  const handleChange = (event) => {
    const { name, type, value, files } = event.target;
    setInputs((values) => ({
      ...values,
      [name]: type === 'file' ? files[0] : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();

    formData.append('id', id);
    formData.append('courseId', inputs.courseId);
    formData.append('courseName', inputs.courseName);
    formData.append('courseDuration', inputs.courseDuration);
    formData.append('courseFee', inputs.courseFee);
    formData.append('content1', inputs.content1);
    formData.append('content2', inputs.content2);
    formData.append('oldImage1', inputs.oldImage1);
    formData.append('oldImage2', inputs.oldImage2);

    if (inputs.image1) formData.append('image1', inputs.image1);
    if (inputs.image2) formData.append('image2', inputs.image2);

    axios.post(`http://localhost/Backend/api/update.php`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(response => {
      navigate('/admin/courses');
    }).catch(error => {
      console.error('Error updating course:', error);
    });
  };

  return (
    <ThemeProvider theme={theme}> {/* Apply the custom theme */}
      <Container component="main" maxWidth="sm" sx={{ mt: 5 }}>
        <Paper elevation={3} sx={{ padding: 2 }}>
          <Typography variant="h5" align="center" gutterBottom>
            Edit Course
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
                  readOnly
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
                    />
                  </Button>
                  {inputs.oldImage1 && (
                    <img src={`http://localhost/Backend/uploads/${inputs.oldImage1}`} alt="Old Image 1" style={{ marginTop: 10, width: '100%', maxHeight: 200 }} />
                  )}
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
                    />
                  </Button>
                  {inputs.oldImage2 && (
                    <img src={`http://localhost/Backend/uploads/${inputs.oldImage2}`} alt="Old Image 2" style={{ marginTop: 10, width: '100%', maxHeight: 200 }} />
                  )}
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Box textAlign="center">
                  <Button type="submit" variant="contained" color="primary">
                    Save Changes
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
