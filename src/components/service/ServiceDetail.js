import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Grid, Typography, Paper } from '@mui/material';

export default function CourseDetails() {
  const { id } = useParams(); // Extract the course ID from the URL
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await axios.get(`http://localhost/Backend/api/service.php/${id}`);
        setCourse(response.data);
      } catch (err) {
        setError('Failed to fetch course details');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!course) return <p>No course details available</p>;

  return (
    <Container>
      <Paper elevation={3} style={{ padding: '20px', marginTop: '100px' ,height:'400px'}}>
        <Grid container spacing={2}>
          {/* Image Column */}
          <Grid item xs={12} md={5}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '350px',
              }}
            >
              <img
                src={`http://localhost/Backend/images/${course.serviceId}/${course.image1}`}
                alt={course.serviceName}
                className="img-fluid"
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'cover',
                }}
              />
            </div>
          </Grid>

          {/* Content Column */}
          <Grid item xs={12} md={7}>
            <Typography variant="h4" style={{ color: 'red', textAlign: 'center' }}>
              {course.serviceName}
            </Typography>
            <Typography variant="body1" style={{ marginTop: '20px', textAlign: 'center' }}>
              {course.content1}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}
