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
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";

const theme = createTheme({
  palette: {
    primary: {
      main: '#f44336', // Red
    },
    secondary: {
      main: '#9e9e9e', // Gray
    },
    background: {
      default: '#ffffff', // White
    },
  },
});

export default function EditService() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    serviceId: '',
    serviceName: '',
    content1: '',
    image1: null,
    oldImage1: '',
  });

  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost/Backend/api/service.php/${id}`)
      .then(response => {
        setInputs({
          ...response.data,
          oldImage1: response.data.image1,  // Store old image path
        });
        setPreviewImage(`http://localhost/Backend/uploads/${response.data.image1}`);
      })
      .catch(error => console.error('Error fetching service:', error));
  }, [id]);

  const handleChange = (event) => {
    const { name, type, value, files } = event.target;
    setInputs((values) => ({
      ...values,
      [name]: type === 'file' ? files[0] : value,
    }));

    if (type === 'file') {
      const file = files[0];
      setPreviewImage(URL.createObjectURL(file));  // Preview new image
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();

    formData.append('id', id);
    formData.append('serviceId', inputs.serviceId);
    formData.append('serviceName', inputs.serviceName);
    formData.append('content1', inputs.content1);

    // Append images only if they exist
    formData.append('oldImage1', inputs.oldImage1);
    if (inputs.image1) formData.append('image1', inputs.image1);

    try {
      const response = await axios.post('http://localhost/Backend/api/service.php', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data);
      navigate('/admin/services');
    } catch (error) {
      console.error('Error updating service:', error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="sm" sx={{ mt: 5 }}>
        <Paper elevation={3} sx={{ padding: 2 }}>
          <Typography variant="h5" align="center" gutterBottom>
            Edit Service
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Service ID"
                  name="serviceId"
                  value={inputs.serviceId}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Service Name"
                  name="serviceName"
                  value={inputs.serviceName}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Content"
                  name="content1"
                  value={inputs.content1}
                  onChange={handleChange}
                  fullWidth
                  multiline
                  rows={3}
                />
              </Grid>

              <Grid item xs={12}>
                <Box display="flex" flexDirection="column" alignItems="center">
                  <Button variant="contained" component="label" startIcon={<PhotoCamera />}>
                    Upload New Image
                    <input
                      type="file"
                      name="image1"
                      onChange={handleChange}
                      hidden
                    />
                  </Button>
                  {previewImage && (
                    <img
                      src={previewImage}
                      alt="Image Preview"
                      style={{ marginTop: 10, width: '100%', maxHeight: 200 }}
                    />
                  )}
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
