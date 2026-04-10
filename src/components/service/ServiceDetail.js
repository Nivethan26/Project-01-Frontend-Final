import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Grid, Typography, Paper } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import SpeedIcon from '@mui/icons-material/Speed';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import './ServiceDetail.css';

export default function CourseDetails() {
  const { id } = useParams(); // Extract the course ID from the URL
  const navigate = useNavigate();
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

  if (loading) return <div className="sd-state-container">Loading service details...</div>;
  if (error) return <div className="sd-state-container">{error}</div>;
  if (!course) return <div className="sd-state-container">No service details available</div>;

  return (
    <div className="service-detail-page">
      <Container maxWidth="lg">
        {/* Main Details Card */}
        <Paper className="service-detail-paper sd-anim-1">
          <Grid container>
            {/* Image Column */}
            <Grid item xs={12} md={5}>
              <div className="sd-image-container">
                <img
                  src={`http://localhost/Backend/images/${course.serviceId}/${course.image1}`}
                  alt={course.serviceName}
                  className="sd-image"
                />
              </div>
            </Grid>

            {/* Content Column */}
            <Grid item xs={12} md={7}>
              <div className="sd-content-container">
                <Typography variant="h3" className="sd-title">
                  {course.serviceName}
                </Typography>
                
                <Typography variant="body1" className="sd-description">
                  {course.content1}
                </Typography>

                <Typography variant="h6" style={{ fontWeight: 700, color: '#222', marginBottom: '15px' }}>
                  Key Features & Benefits
                </Typography>
                <ul className="sd-features">
                  <li className="sd-feature-item">
                    <CheckCircleIcon className="sd-feature-icon" /> Thorough, Professional Inspection
                  </li>
                  <li className="sd-feature-item">
                    <CheckCircleIcon className="sd-feature-icon" /> Premium Quality Parts & Fluids
                  </li>
                  <li className="sd-feature-item">
                    <CheckCircleIcon className="sd-feature-icon" /> Guaranteed Customer Satisfaction
                  </li>
                  <li className="sd-feature-item">
                    <CheckCircleIcon className="sd-feature-icon" /> Transparent Pricing Without Hidden Fees
                  </li>
                </ul>

                <div className="sd-actions">
                  <button className="sd-btn-primary" onClick={() => navigate('/bookingStation01')}>
                    Book Service
                  </button>
                  <button className="sd-btn-secondary" onClick={() => navigate('/ContactUs')}>
                    Contact Us
                  </button>
                </div>
              </div>
            </Grid>
          </Grid>
        </Paper>

        {/* Why Choose Us Section */}
        <div className="sd-advantages-section sd-anim-2">
          <Typography variant="h3" className="sd-advantages-title">
            Why Choose Us
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={4}>
              <div className="sd-advantage-card sd-anim-3">
                <div className="sd-adv-icon-wrapper">
                  <VerifiedUserIcon className="sd-adv-icon" />
                </div>
                <Typography variant="h6" className="sd-adv-title">Certified Technicians</Typography>
                <Typography variant="body2" className="sd-adv-desc">
                  Our team consists of highly trained and certified mechanics who know your vehicle inside and out.
                </Typography>
              </div>
            </Grid>
            <Grid item xs={12} sm={4}>
              <div className="sd-advantage-card sd-anim-3" style={{ animationDelay: '0.5s' }}>
                <div className="sd-adv-icon-wrapper">
                  <SpeedIcon className="sd-adv-icon" />
                </div>
                <Typography variant="h6" className="sd-adv-title">Fast Service</Typography>
                <Typography variant="body2" className="sd-adv-desc">
                  We guarantee quick turnarounds with precision accuracy to get you back on the road safely.
                </Typography>
              </div>
            </Grid>
            <Grid item xs={12} sm={4}>
              <div className="sd-advantage-card sd-anim-3" style={{ animationDelay: '0.6s' }}>
                <div className="sd-adv-icon-wrapper">
                  <LocalOfferIcon className="sd-adv-icon" />
                </div>
                <Typography variant="h6" className="sd-adv-title">Affordable Pricing</Typography>
                <Typography variant="body2" className="sd-adv-desc">
                  Providing enterprise-quality auto care and premium solutions at highly competitive prices.
                </Typography>
              </div>
            </Grid>
          </Grid>
        </div>

      </Container>
    </div>
  );
}
