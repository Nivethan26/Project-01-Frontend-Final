import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./station.css";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PaidIcon from '@mui/icons-material/Paid';
import StarIcon from '@mui/icons-material/Star';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ListAltIcon from '@mui/icons-material/ListAlt';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import UpcomingIcon from '@mui/icons-material/Upcoming';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { useUserAuth } from "../../utils/useUserAuth";

/* ─── Static station data (existing, unchanged) ─────────────────────── */
const stations = [
  { id: "01", name: "Station 01", description: "Standard exterior body wash and quick dry.", duration: "30 mins", price: "Rs. 800", rating: "4.2" },
  { id: "02", name: "Station 02", description: "Standard exterior body wash and quick dry.", duration: "30 mins", price: "Rs. 800", rating: "4.4" },
  {
    id: "03",
    name: "Station 03",
    description: "Comprehensive exterior wash with detailed interior vacuuming and wipe down.",
    duration: "60 mins",
    price: "Rs. 1500",
    rating: "4.8"
  },
  { id: "04", name: "Station 04", description: "Ultimate full service: body wash, interior detail, engine bay cleaning, and wax.", duration: "90 mins", price: "Rs. 3500", rating: "4.9" },
];

/* ─── Booking status helper (frontend-only, no backend change) ────────── */
function getBookingStatus(bookingDateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const bookingDate = new Date(bookingDateStr);
  bookingDate.setHours(0, 0, 0, 0);

  if (bookingDate.getTime() === today.getTime()) return { label: "Scheduled Today", color: "#2563eb" };
  if (bookingDate > today) return { label: "Upcoming", color: "#f59e0b" };
  return { label: "Awaiting Confirmation", color: "#64748b" };
}

/* ─── Format a date string to readable format ─────────────────────── */
function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

const Station = () => {
  const navigate = useNavigate();
  const { username } = useUserAuth();

  const [stats, setStats] = useState({
    totalBookings: 0,
    upcomingBookings: 0,
    completedServices: 0,
    pendingRequests: 0
  });
  const [statsLoading, setStatsLoading] = useState(true);

  const [recentBookings, setRecentBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);

  const [courseApps, setCourseApps] = useState([]);
  const [jobApps, setJobApps] = useState([]);
  const [appsLoading, setAppsLoading] = useState(true);

  /* Keep max 3 courses + max 2 jobs for dashboard preview */
  const dashboardCourses = useMemo(() => courseApps.slice(0, 3), [courseApps]);
  const dashboardJobs = useMemo(() => jobApps.slice(0, 2), [jobApps]);
  const totalAppsCount = courseApps.length + jobApps.length;
  const hasMoreApps = courseApps.length > 3 || jobApps.length > 2;

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const email = sessionStorage.getItem("email");
        if (!email) return;
        
        const response = await fetch(
          `/Backend/getUserStats.php?email=${encodeURIComponent(email)}`
        );
        const data = await response.json();
        
        if (data.success) {
          setStats({
            totalBookings: data.totalBookings,
            upcomingBookings: data.upcomingBookings,
            completedServices: data.completedServices,
            pendingRequests: data.pendingRequests
          });
        }
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      } finally {
        setStatsLoading(false);
      }
    };
    
    const fetchRecentBookings = async () => {
      try {
        const email = sessionStorage.getItem("email");
        if (!email) return;

        const response = await fetch(
          `/Backend/getRecentBookings.php?email=${encodeURIComponent(email)}`
        );
        const data = await response.json();

        if (data.success) {
          setRecentBookings(data.bookings);
        }
      } catch (err) {
        console.error('Failed to fetch recent bookings:', err);
      } finally {
        setBookingsLoading(false);
      }
    };

    const fetchApplications = async () => {
      try {
        const email = sessionStorage.getItem('email');
        if (!email) return;
        const response = await fetch(
          `/Backend/getMyApplications.php?email=${encodeURIComponent(email)}`
        );
        const data = await response.json();
        if (data.success) {
          setCourseApps(data.applications || []);
          setJobApps(data.jobApplications || []);
        }
      } catch (err) {
        console.error('Failed to fetch applications:', err);
      } finally {
        setAppsLoading(false);
      }
    };

    fetchStats();
    fetchRecentBookings();
    fetchApplications();
  }, []);

  const handleBookClick = (stationId) => {
    navigate(`/booking-station/${parseInt(stationId)}`);
  };

  return (
    <div className="station-container">

      {/* ── Welcome Banner ──────────────────────────────────────── */}
      <div className="welcome-banner">
        <div className="welcome-banner-text">
          <h2>Welcome back, {username || "User"} 👋</h2>
          <p>Here's your activity overview at AutoCare Lanka.</p>
        </div>
      </div>

      {/* ── Stats Cards ─────────────────────────────────────────── */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(37, 99, 235, 0.1)', color: '#2563eb' }}>
            <EventAvailableIcon />
          </div>
          <div className="stat-info">
            <h3>
              {statsLoading ? (
                <span className="pulse-skeleton" style={{ display: 'inline-block', width: '30px', height: '28px', backgroundColor: '#e2e8f0', borderRadius: '4px', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}></span>
              ) : stats.totalBookings}
            </h3>
            <p>Total Bookings</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
            <UpcomingIcon />
          </div>
          <div className="stat-info">
            <h3>
              {statsLoading ? (
                <span className="pulse-skeleton" style={{ display: 'inline-block', width: '30px', height: '28px', backgroundColor: '#e2e8f0', borderRadius: '4px', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}></span>
              ) : stats.upcomingBookings}
            </h3>
            <p>Upcoming Bookings</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
            <CheckCircleIcon />
          </div>
          <div className="stat-info">
            <h3>
              {statsLoading ? (
                <span className="pulse-skeleton" style={{ display: 'inline-block', width: '30px', height: '28px', backgroundColor: '#e2e8f0', borderRadius: '4px', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}></span>
              ) : stats.completedServices}
            </h3>
            <p>Completed Services</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
            <HourglassEmptyIcon />
          </div>
          <div className="stat-info">
            <h3>
              {statsLoading ? (
                <span className="pulse-skeleton" style={{ display: 'inline-block', width: '30px', height: '28px', backgroundColor: '#e2e8f0', borderRadius: '4px', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}></span>
              ) : stats.pendingRequests}
            </h3>
            <p>Pending Requests</p>
          </div>
        </div>
      </div>

      {/* ── Quick Actions ────────────────────────────────────────── */}
      <div className="dashboard-section">
        <h2 className="section-title">Quick Actions</h2>
        <div className="quick-actions">
          <button
            className="action-btn primary"
            onClick={() => document.getElementById('services-grid').scrollIntoView({ behavior: 'smooth' })}
          >
            <AddCircleOutlineIcon className="action-icon" />
            Book New Service
          </button>
          <button className="action-btn secondary" onClick={() => navigate("/User/bookings")}>
            <ListAltIcon className="action-icon" />
            View My Bookings
          </button>
          <button className="action-btn outline" onClick={() => navigate("/User/messages")}>
            <SupportAgentIcon className="action-icon" />
            Contact Support
          </button>
          <button className="action-btn ghost" onClick={() => navigate("/jobs")}>
            <WorkOutlineIcon className="action-icon" />
            Apply for Jobs
          </button>
          <button className="action-btn ghost" onClick={() => navigate("/courses")}>
            <SchoolOutlinedIcon className="action-icon" />
            Explore Courses
          </button>
        </div>
      </div>

      {/* ── Recent Bookings ──────────────────────────────────────── */}
      <div className="dashboard-section">
        <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e5e7eb', paddingBottom: '12px', marginBottom: '16px' }}>
          <h2 className="section-title" style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#111827' }}>Recent Bookings</h2>
          <span style={{ fontSize: '14px', color: '#2563eb', cursor: 'pointer', fontWeight: '500' }} onClick={() => navigate("/User/bookings")}>View All →</span>
        </div>
        
        <div className="recent-bookings-container" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {bookingsLoading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="pulse-skeleton" style={{ height: '110px', backgroundColor: '#f3f4f6', borderRadius: '12px', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
            ))
          ) : recentBookings.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon-wrapper">
                <EventAvailableIcon style={{ fontSize: 40, color: '#94a3b8' }} />
              </div>
              <h3 style={{ color: '#6b7280', fontSize: '16px', marginTop: '12px', marginBottom: '4px' }}>No bookings yet</h3>
              <p style={{ color: '#9ca3af', fontSize: '14px', margin: 0, marginBottom: '16px' }}>Book your first service</p>
              <button
                className="action-btn primary" style={{ backgroundColor: '#1e3a8a', color: 'white', padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}
                onClick={() => document.getElementById('services-grid').scrollIntoView({ behavior: 'smooth' })}
              >
                Book a Service
              </button>
            </div>
          ) : (
            recentBookings.map(booking => {
              const dateStr = new Date(booking.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
              
              let statusProps = { bg: '#fef9c3', text: '#854d0e', border: '#fde047', label: '⏳ Pending' };
              if (booking.status === 'approved') statusProps = { bg: '#dbeafe', text: '#1e40af', border: '#93c5fd', label: '✅ Approved' };
              else if (booking.status === 'in_progress') statusProps = { bg: '#ffedd5', text: '#9a3412', border: '#fdba74', label: '🔧 In Progress' };
              else if (booking.status === 'completed') statusProps = { bg: '#dcfce7', text: '#166534', border: '#86efac', label: '✓ Completed' };
              else if (booking.status === 'rejected') statusProps = { bg: '#fee2e2', text: '#991b1b', border: '#fca5a5', label: '✗ Rejected' };

              const amounts = { 1: 800, 2: 800, 3: 1200, 4: 2000 };
              const amount = amounts[booking.station_id] || 800;

              return (
                <div key={booking.id} className="recent-booking-card" onClick={() => navigate("/User/bookings")}>
                  <div className="recent-booking-left">
                    <div className="rb-vehicle-row">
                      <DirectionsCarIcon style={{ fontSize: 18, color: '#6b7280' }} />
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span className="rb-model">{booking.vehicle_model}</span>
                          <span className="rb-number">{booking.vehicle_number}</span>
                        </div>
                        <span style={{ fontSize: '10px', color: '#9ca3af', fontFamily: 'monospace', marginTop: '2px' }}>
                          {booking.booking_ref}
                        </span>
                      </div>
                    </div>
                    <div className="rb-details-row">
                      <span className="rb-detail"><LocationOnIcon style={{ fontSize: 14 }}/> {booking.station_name}</span>
                      <span className="rb-detail"><CalendarMonthIcon style={{ fontSize: 14 }}/> {dateStr}</span>
                      <span className="rb-detail"><AccessTimeIcon style={{ fontSize: 14 }}/> {booking.timeslot}</span>
                    </div>
                  </div>
                  <div className="recent-booking-right">
                    <div className="rb-status-group">
                      <span className="rb-status-badge" style={{ backgroundColor: statusProps.bg, color: statusProps.text, borderColor: statusProps.border }}>
                        {statusProps.label}
                      </span>
                      {booking.payment_method === 'card' ? (
                        <span className="rb-payment-ind card">💳 Paid</span>
                      ) : (
                        <span className="rb-payment-ind cash">💵 Cash on Arrival</span>
                      )}
                    </div>
                    <div className="rb-action-group">
                      <div className="rb-amount">Rs. {amount.toFixed(2)}</div>
                      <button className="rb-view-btn">View Details →</button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ── My Applications (Real Data) ─────────────────────────── */}
      <div className="dashboard-section">
        <div className="section-header">
          <h2 className="section-title no-margin">My Applications</h2>
          <div className="section-header-actions">
            <button className="view-all-btn" onClick={() => navigate("/jobs")}>
              <OpenInNewIcon style={{ fontSize: 14 }} /> Jobs
            </button>
            <button className="view-all-btn" onClick={() => navigate("/courses")}>
              <OpenInNewIcon style={{ fontSize: 14 }} /> Courses
            </button>
          </div>
        </div>

        {appsLoading ? (
          <div className="applications-list">
            {[1, 2, 3].map(i => (
              <div key={i} className="pulse-skeleton" style={{ height: '68px', backgroundColor: '#f3f4f6', borderRadius: '12px', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
            ))}
          </div>
        ) : totalAppsCount === 0 ? (
          <div className="empty-state small">
            <div className="empty-icon-wrapper small">
              <WorkOutlineIcon style={{ fontSize: 28, color: '#94a3b8' }} />
            </div>
            <h3>No applications yet</h3>
            <p>Browse open positions and training programs to get started.</p>
          </div>
        ) : (
          <div className="applications-list">
            {/* Course applications (max 3) */}
            {dashboardCourses.map((app) => (
              <div key={`course-${app.id}`} className="application-card">
                <div className="application-icon-col">
                  <div className="application-icon" style={{ backgroundColor: 'rgba(124, 58, 237, 0.1)', color: '#7c3aed' }}>
                    <SchoolOutlinedIcon style={{ fontSize: 20 }} />
                  </div>
                </div>
                <div className="application-info">
                  <div className="application-title-row">
                    <span className="application-title">{app.course_name}</span>
                    <span className="application-badge course">Course</span>
                  </div>
                  <span className="application-meta">
                    Applied on {formatDate(app.created_at)}
                  </span>
                </div>
                <div className="application-status-col">
                  <span className={`application-status status-${(app.status || 'submitted').toLowerCase().replace(/\s+/g, '-')}`}>
                    {app.status || 'Submitted'}
                  </span>
                </div>
              </div>
            ))}

            {/* Job applications (max 2) */}
            {dashboardJobs.map((app) => (
              <div key={`job-${app.id}`} className="application-card">
                <div className="application-icon-col">
                  <div className="application-icon" style={{ backgroundColor: 'rgba(37, 99, 235, 0.1)', color: '#2563eb' }}>
                    <WorkOutlineIcon style={{ fontSize: 20 }} />
                  </div>
                </div>
                <div className="application-info">
                  <div className="application-title-row">
                    <span className="application-title">{app.jobTitle}</span>
                    <span className="application-badge job">Job</span>
                  </div>
                  <span className="application-meta">
                    Applied on {formatDate(app.application_date)}
                  </span>
                </div>
                <div className="application-status-col">
                  <span className="application-status status-submitted">Submitted</span>
                </div>
              </div>
            ))}

            {/* View More button */}
            {(hasMoreApps || totalAppsCount > 0) && (
              <div style={{ textAlign: 'center', paddingTop: '12px' }}>
                <button
                  className="view-more-apps-btn"
                  onClick={() => navigate('/User/applications')}
                >
                  View All Applications ({totalAppsCount})
                  <ArrowForwardIcon style={{ fontSize: 16, marginLeft: '6px' }} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Available Services (unchanged) ──────────────────────── */}
      <div className="dashboard-section" id="services-grid">
        <div className="station-booking-container">
          <h2 className="section-title">Available Services</h2>
          <p className="section-subtitle">Select a service station tailored to your vehicle's needs</p>

          <div className="stations">
            {stations.map((station) => (
              <div key={station.id} className="station-card shadow-hover-box">
                <h2 className="station-title">{station.name}</h2>
                <p className="desc">{station.description}</p>

                <div className="card-details">
                  <div className="detail-item">
                    <AccessTimeIcon className="icon" fontSize="small" />
                    {station.duration}
                  </div>
                  <div className="detail-item price">
                    <PaidIcon className="icon" fontSize="small" />
                    {station.price}
                  </div>
                  <div className="detail-item rating">
                    <StarIcon className="icon" fontSize="small" />
                    {station.rating}
                  </div>
                </div>

                <div className="card-bottom">
                  <button
                    className="book-button premium-btn"
                    onClick={() => handleBookClick(station.id)}
                  >
                    Book Now <ArrowForwardIcon style={{ marginLeft: '8px', fontSize: '18px' }} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default Station;
