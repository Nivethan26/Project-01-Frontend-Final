import { toast } from 'react-toastify';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PaymentIcon from '@mui/icons-material/Payment';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ListAltIcon from '@mui/icons-material/ListAlt';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import './UserBookings.css';

const statusConfig = {
  pending:     { bg: '#fef9c3', text: '#854d0e', label: '⏳ Pending' },
  approved:    { bg: '#dbeafe', text: '#1e40af', label: '✅ Approved' },
  in_progress: { bg: '#ffedd5', text: '#9a3412', label: '🔧 In Progress' },
  completed:   { bg: '#dcfce7', text: '#166534', label: '✓ Completed' },
  rejected:    { bg: '#fee2e2', text: '#991b1b', label: '✗ Rejected' },
  cancelled:   { bg: '#f3f4f6', text: '#374151', label: '✗ Cancelled' },
};

// Check if appointment has passed
const isAppointmentPassed = (date, timeslot) => {
    try {
        // Get start time from timeslot "11:30AM-12:00PM" → "11:30AM"
        const startTime = timeslot.split('-')[0].trim();
        
        // Convert "11:30AM" or "09:00AM" to 24hr format
        const convert12to24 = (time12) => {
            const [time, modifier] = time12.split(/(?=[AP]M)/);
            let [hours, minutes] = time.split(':').map(Number);
            if (modifier === 'AM' && hours === 12) hours = 0;
            if (modifier === 'PM' && hours !== 12) hours += 12;
            return { hours, minutes };
        };
        
        const { hours, minutes } = convert12to24(startTime);
        
        // Build appointment datetime
        const appointmentDate = new Date(date);
        appointmentDate.setHours(hours, minutes, 0, 0);
        
        const now = new Date();
        console.log('Appointment check:', {
            date,
            timeslot,
            appointmentDate: appointmentDate.toString(),
            now: now.toString(),
            passed: now >= appointmentDate
        });
        return now >= appointmentDate;
    } catch (err) {
        console.error('isAppointmentPassed error:', err);
        return false;
    }
};

// Check if within 24hrs
const isWithin24Hours = (date, timeslot) => {
    try {
        const startTime = timeslot.split('-')[0].trim();
        
        const convert12to24 = (time12) => {
            const [time, modifier] = time12.split(/(?=[AP]M)/);
            let [hours, minutes] = time.split(':').map(Number);
            if (modifier === 'AM' && hours === 12) hours = 0;
            if (modifier === 'PM' && hours !== 12) hours += 12;
            return { hours, minutes };
        };
        
        const { hours, minutes } = convert12to24(startTime);
        
        const appointmentDate = new Date(date);
        appointmentDate.setHours(hours, minutes, 0, 0);
        
        const now = new Date();
        const hoursUntil = (appointmentDate - now) / (1000 * 60 * 60);
        
        // Within 24hrs means: appointment is in future BUT less than 24hrs away
        return hoursUntil > 0 && hoursUntil <= 24;
    } catch (err) {
        console.error('isWithin24Hours error:', err);
        return false;
    }
};

// Calculate refund amount
const getRefundInfo = (booking) => {
    const amounts = { 1: 800, 2: 800, 3: 1200, 4: 2000 };
    const amount = amounts[booking.station_id] || 0;
    
    if (booking.payment_method === 'cash') {
        return { eligible: false, amount: 0, reason: 'not_applicable' };
    }
    if (isWithin24Hours(booking.date, booking.timeslot)) {
        return { eligible: false, amount: 0, reason: 'late_cancellation' };
    }
    return { eligible: true, amount: amount * 0.5, reason: 'eligible' };
};

const UserBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0, cancelled: 0 });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const [cancelSuccess, setCancelSuccess] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const email = sessionStorage.getItem('email');
        if (!email) return;
        const response = await fetch(
          `/Backend/getUserBookings.php?email=${encodeURIComponent(email)}`
        );
        const data = await response.json();
        if (data.success) {
          setBookings(data.bookings);
          setStats(data.stats);
        }
      } catch (err) {
        console.error('Failed to fetch bookings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [cancelSuccess]);

  const filteredBookings = bookings.filter((booking) => {
    const now = new Date();
    // Use isAppointmentPassed helper for consistent date/time comparison
    const passed = isAppointmentPassed(booking.date, booking.timeslot);

    switch(activeTab) {
      case "pending":
        return booking.status === "pending";

      case "upcoming":
        // Upcoming = approved AND not yet passed
        return booking.status === "approved" && !passed;

      case "completed":
        return booking.status === "completed";

      case "cancelled":
        return booking.status === "cancelled";

      default:
        return true;
    }
  });

  // Calculate counts for tabs
  const pendingCount = bookings.filter(b => b.status === 'pending').length;
  const upcomingCount = bookings.filter(b => b.status === 'approved' && !isAppointmentPassed(b.date, b.timeslot)).length;
  const completedCount = bookings.filter(b => b.status === 'completed').length;
  const cancelledCount = bookings.filter(b => b.status === 'cancelled').length;

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  };

  const handleCancelClick = (booking) => {
    setSelectedBooking(booking);
    setShowCancelModal(true);
  };

  const handleCancelConfirm = async () => {
    if (!selectedBooking) return;
    setCancelling(true);
    try {
      const email = sessionStorage.getItem('email');
      const response = await fetch('/Backend/cancelBooking.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: selectedBooking.id,
          email: email,
          cancelReason: 'Cancelled by user'
        })
      });
      const result = await response.json();
      if (result.success) {
        setBookings(prev => prev.map(b => 
            b.id === selectedBooking.id 
                ? {...b, 
                   status: 'cancelled', 
                   refund_status: result.refundStatus,
                   refund_amount: result.refundAmount,
                   cancelled_at: new Date().toISOString()
                  } 
                : b
        ));
        setShowCancelModal(false);
        setSelectedBooking(null);
        toast.success('Your booking has been cancelled successfully.');
      } else {
        toast.error(result.message || 'Failed to cancel booking.');
      }
    } catch (err) {
      toast.error('Failed to cancel. Please try again.');
    } finally {
      setCancelling(false);
    }
  };

  const getStatusBadge = (status) => {
    const cfg = statusConfig[status] || statusConfig.pending;
    return (
      <span
        className="ub-status-badge"
        style={{ backgroundColor: cfg.bg, color: cfg.text }}
      >
        {cfg.label}
      </span>
    );
  };

  return (
    <div className="user-bookings-page">
      {/* Header */}
      <div className="ub-header">
        <h1>My Bookings</h1>
        <p>View and manage your service bookings</p>
      </div>

      {/* Stats Row */}
      <div className="ub-stats-grid">
        <div className="ub-stat-card">
          <div className="ub-stat-icon" style={{ backgroundColor: '#dbeafe', color: '#2563eb' }}>
            <ListAltIcon style={{ fontSize: 20 }} />
          </div>
          <div className="ub-stat-info">
            <h3>{loading ? '—' : stats.total}</h3>
            <p>Total</p>
          </div>
        </div>
        <div className="ub-stat-card">
          <div className="ub-stat-icon" style={{ backgroundColor: '#fef9c3', color: '#854d0e' }}>
            <HourglassEmptyIcon style={{ fontSize: 20 }} />
          </div>
          <div className="ub-stat-info">
            <h3>{loading ? '—' : pendingCount}</h3>
            <p>Pending</p>
          </div>
        </div>
        <div className="ub-stat-card">
          <div className="ub-stat-icon" style={{ backgroundColor: '#e0e7ff', color: '#4338ca' }}>
            <CalendarMonthIcon style={{ fontSize: 20 }} />
          </div>
          <div className="ub-stat-info">
            <h3>{loading ? '—' : upcomingCount}</h3>
            <p>Upcoming</p>
          </div>
        </div>
        <div className="ub-stat-card">
          <div className="ub-stat-icon" style={{ backgroundColor: '#dcfce7', color: '#166534' }}>
            <CheckCircleIcon style={{ fontSize: 20 }} />
          </div>
          <div className="ub-stat-info">
            <h3>{loading ? '—' : completedCount}</h3>
            <p>Completed</p>
          </div>
        </div>
        <div className="ub-stat-card">
          <div className="ub-stat-icon" style={{ backgroundColor: '#fee2e2', color: '#991b1b' }}>
            <CancelIcon style={{ fontSize: 20 }} />
          </div>
          <div className="ub-stat-info">
            <h3>{loading ? '—' : cancelledCount}</h3>
            <p>Cancelled</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="ub-tabs">
        {[
          { key: 'all', label: 'All', count: stats.total },
          { key: 'pending', label: 'Pending', count: pendingCount },
          { key: 'upcoming', label: 'Upcoming', count: upcomingCount },
          { key: 'completed', label: 'Completed', count: completedCount },
          { key: 'cancelled', label: 'Cancelled', count: cancelledCount },
        ].map(tab => (
          <button
            key={tab.key}
            className={`ub-tab-btn ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="ub-list">
          {[1, 2, 3].map(i => (
            <div key={i} className="ub-skeleton-card" />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredBookings.length === 0 && (
        <div className="ub-empty-state">
          <EventAvailableIcon style={{ fontSize: 56, color: '#9ca3af', marginBottom: '16px' }} />
          <h3>
            {activeTab === 'pending' ? 'No pending requests' :
             activeTab === 'upcoming' ? 'No upcoming bookings' :
             activeTab === 'completed' ? 'No completed services yet' :
             activeTab === 'cancelled' ? 'No cancelled bookings' :
             'No bookings found'}
          </h3>
          <p>
            {activeTab === 'pending' ? 'Your pending booking requests will appear here' :
             activeTab === 'upcoming' ? 'Your approved future bookings will appear here' :
             activeTab === 'completed' ? 'Completed services will show up here' :
             activeTab === 'cancelled' ? 'Cancelled bookings will appear here' :
             "You haven't made any bookings yet"}
          </p>
          {(activeTab === 'all' || activeTab === 'upcoming') && (
            <button
              className="ub-book-btn"
              onClick={() => navigate('/user')}
            >
              Book a Service
            </button>
          )}
        </div>
      )}

      {/* Booking Cards */}
      {!loading && filteredBookings.length > 0 && (
        <div className="ub-list">
          {filteredBookings.map(booking => {
            const cfg = statusConfig[booking.status] || statusConfig.pending;
            return (
              <div key={booking.id} className="ub-booking-card">
                {/* Top Row */}
                <div className="ub-card-top">
                  <div className="ub-vehicle-info">
                    <DirectionsCarIcon style={{ fontSize: 20, color: '#6b7280' }} />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="ub-vehicle-model">{booking.vehicle_model}</span>
                        <span className="ub-vehicle-number">{booking.vehicle_number}</span>
                      </div>
                      <span style={{ fontSize: '11px', color: '#9ca3af', fontWeight: '500', marginTop: '2px', fontFamily: 'monospace' }}>
                        {booking.booking_ref}
                      </span>
                    </div>
                  </div>
                  <div className="ub-card-right-top">
                    {getStatusBadge(booking.status)}
                    <span className="ub-amount">
                      {Number(booking.amount) === 0 ? 'Price on enquiry' : `Rs. ${Number(booking.amount).toFixed(2)}`}
                    </span>
                  </div>
                </div>

                {/* Detail Rows */}
                <div className="ub-card-details">
                  <div className="ub-detail-row">
                    <LocationOnIcon style={{ fontSize: 16, color: '#9ca3af' }} />
                    <span>{booking.station_name}</span>
                  </div>
                  <div className="ub-detail-row">
                    <CalendarMonthIcon style={{ fontSize: 16, color: '#9ca3af' }} />
                    <span>{formatDate(booking.date)}</span>
                    <AccessTimeIcon style={{ fontSize: 16, color: '#9ca3af', marginLeft: '12px' }} />
                    <span>{booking.timeslot}</span>
                  </div>
                  <div className="ub-detail-row">
                    <PaymentIcon style={{ fontSize: 16, color: '#9ca3af' }} />
                    <span>
                      {booking.payment_method === 'card' ? '💳 Paid via Card' : '💵 Cash on Arrival'}
                    </span>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="ub-card-bottom">
                  {(() => {
                      const status = booking.status;
                      
                      // Step 1: Check non-cancellable statuses first
                      if (['in_progress', 'completed', 'rejected', 'cancelled'].includes(status)) {
                          return (
                              <>
                                  {status === 'in_progress' && (
                                    <span className="ub-bottom-status" style={{ color: '#9a3412' }}>🔧 Service in progress</span>
                                  )}
                                  {status === 'completed' && (
                                    <span className="ub-bottom-status" style={{ color: '#166534' }}>✓ Service completed</span>
                                  )}
                                  {status === 'cancelled' && (
                                    <>
                                      <span className="ub-bottom-status" style={{ color: '#6b7280' }}>
                                        ✗ Cancelled{booking.cancelled_at ? ` on ${formatDate(booking.cancelled_at)}` : ''}
                                      </span>
                                      {booking.refund_status === 'eligible' && (
                                          <span style={{
                                              fontSize:'12px', color:'#16a34a',
                                              background:'#f0fdf4', padding:'3px 10px',
                                              borderRadius:'20px', marginLeft:'8px'
                                          }}>
                                              Refund: Rs. {booking.refund_amount} eligible
                                          </span>
                                      )}
                                      {booking.refund_status === 'not_eligible' && (
                                          <span style={{
                                              fontSize:'12px', color:'#dc2626',
                                              background:'#fef2f2', padding:'3px 10px',
                                              borderRadius:'20px', marginLeft:'8px'
                                          }}>
                                              No refund
                                          </span>
                                      )}
                                      {booking.refund_status === 'not_applicable' && (
                                          <span style={{
                                              fontSize:'12px', color:'#6b7280',
                                              background:'#f3f4f6', padding:'3px 10px',
                                              borderRadius:'20px', marginLeft:'8px'
                                          }}>
                                              Cash booking
                                          </span>
                                      )}
                                    </>
                                  )}
                                  {status === 'rejected' && (
                                    <span className="ub-bottom-status" style={{ color: '#991b1b' }}>✗ Booking rejected</span>
                                  )}
                              </>
                          );
                      }
                      
                      // Step 2: Check if appointment time already passed
                      const passed = isAppointmentPassed(booking.date, booking.timeslot);
                      if (passed) {
                          return (
                              <span style={{
                                  fontSize: '13px',
                                  color: '#9ca3af',
                                  fontStyle: 'italic',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px'
                              }}>
                                  <HourglassEmptyIcon style={{ fontSize: 16 }} /> Time Passed
                              </span>
                          );
                      }
                      
                      // Step 3: Check 24hr window and refund eligibility
                      const within24 = isWithin24Hours(booking.date, booking.timeslot);
                      const refundInfo = getRefundInfo(booking);
                      
                      return (
                          <div style={{display:'flex', alignItems:'center', gap:'12px'}}>
                              {/* Refund hint pill */}
                              {booking.payment_method === 'cash' ? (
                                  <span style={{
                                      fontSize:'12px', color:'#6b7280',
                                      background:'#f3f4f6', padding:'4px 10px',
                                      borderRadius:'20px'
                                  }}>
                                      💵 Cash booking - no refund
                                  </span>
                              ) : within24 ? (
                                  <span style={{
                                      fontSize:'12px', color:'#dc2626',
                                      background:'#fef2f2', padding:'4px 10px',
                                      borderRadius:'20px'
                                  }}>
                                      ⚠️ No refund (less than 24hrs)
                                  </span>
                              ) : (
                                  <span style={{
                                      fontSize:'12px', color:'#16a34a',
                                      background:'#f0fdf4', padding:'4px 10px',
                                      borderRadius:'20px'
                                  }}>
                                      ✓ 50% refund eligible (Rs. {refundInfo.amount})
                                  </span>
                              )}
                              
                              {/* Cancel button */}
                              <button
                                  onClick={() => {
                                      setSelectedBooking(booking);
                                      setShowCancelModal(true);
                                  }}
                                  style={{
                                      border:'1px solid #dc2626',
                                      color:'#dc2626',
                                      background:'white',
                                      padding:'8px 16px',
                                      borderRadius:'6px',
                                      fontSize:'13px',
                                      cursor:'pointer',
                                      transition:'all 200ms'
                                  }}
                                  onMouseEnter={e => e.target.style.background='#fef2f2'}
                                  onMouseLeave={e => e.target.style.background='white'}
                              >
                                  Cancel Booking
                              </button>
                          </div>
                      );
                  })()}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && selectedBooking && (
        <div className="ub-modal-overlay" onClick={() => !cancelling && setShowCancelModal(false)}>
          <div className="ub-modal" onClick={e => e.stopPropagation()}>
            <button
              className="ub-modal-close"
              onClick={() => !cancelling && setShowCancelModal(false)}
            >
              &times;
            </button>

            <div className="ub-modal-icon">
              <WarningAmberIcon style={{ fontSize: 48, color: '#f59e0b' }} />
            </div>

            <h3 className="ub-modal-title">Cancel Booking?</h3>
            <p className="ub-modal-desc">
              Are you sure you want to cancel this booking?<br />
              This action cannot be undone.
            </p>

            <div className="ub-modal-summary">
              <div className="ub-summary-row">
                <span className="ub-summary-label">Vehicle</span>
                <span className="ub-summary-value">
                  {selectedBooking.vehicle_model} · {selectedBooking.vehicle_number}
                </span>
              </div>
              <div className="ub-summary-row">
                <span className="ub-summary-label">Station</span>
                <span className="ub-summary-value">{selectedBooking.station_name}</span>
              </div>
              <div className="ub-summary-row">
                <span className="ub-summary-label">Date</span>
                <span className="ub-summary-value">{formatDate(selectedBooking.date)}</span>
              </div>
              <div className="ub-summary-row">
                <span className="ub-summary-label">Time</span>
                <span className="ub-summary-value">{selectedBooking.timeslot}</span>
              </div>
            </div>

            {selectedBooking && (() => {
                const refundInfo = getRefundInfo(selectedBooking);
                
                return (
                    <div style={{
                        margin: '16px 0',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        background: refundInfo.eligible ? '#f0fdf4' : '#fef2f2',
                        borderLeft: `4px solid ${refundInfo.eligible ? '#16a34a' : '#dc2626'}`,
                        textAlign: 'left'
                    }}>
                        {refundInfo.reason === 'not_applicable' ? (
                            <>
                                <p style={{color:'#374151', fontWeight:600, margin:0}}>
                                    💵 Cash Booking
                                </p>
                                <p style={{color:'#6b7280', fontSize:'13px', margin:'4px 0 0'}}>
                                    No refund applicable for cash bookings
                                </p>
                            </>
                        ) : refundInfo.eligible ? (
                            <>
                                <p style={{color:'#166534', fontWeight:600, margin:0}}>
                                    ✓ Refund Eligible
                                </p>
                                <p style={{color:'#166534', fontSize:'13px', margin:'4px 0 0'}}>
                                    You will receive a 50% refund: 
                                    <strong> Rs. {refundInfo.amount}.00</strong>
                                </p>
                                <p style={{color:'#6b7280', fontSize:'12px', margin:'4px 0 0'}}>
                                    Refund processed within 3-5 business days
                                </p>
                            </>
                        ) : (
                            <>
                                <p style={{color:'#991b1b', fontWeight:600, margin:0}}>
                                    ⚠️ No Refund
                                </p>
                                <p style={{color:'#991b1b', fontSize:'13px', margin:'4px 0 0'}}>
                                    Cancellation within 24 hours of appointment.
                                    No refund applicable.
                                </p>
                            </>
                        )}
                    </div>
                );
            })()}

            <button
              className="ub-modal-confirm-btn"
              onClick={handleCancelConfirm}
              disabled={cancelling}
            >
              {cancelling ? (
                <>
                  <span className="ub-spinner" />
                  Cancelling...
                </>
              ) : (
                '✗  Yes, Cancel Booking'
              )}
            </button>
            <button
              className="ub-modal-keep-btn"
              onClick={() => setShowCancelModal(false)}
              disabled={cancelling}
            >
              Keep My Booking
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserBookings;
