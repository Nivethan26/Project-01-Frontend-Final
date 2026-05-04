import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const EmployeeBookingCalendar = () => {
  const { stationId } = useParams();
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [days, setDays] = useState([]);
  const [availableSlots, setAvailableSlots] = useState({});

  const apiUrl = `/Backend/api.php?station_id=${stationId}`;

  const fetchAvailableSlots = useCallback(async () => {
    try {
      const response = await fetch(`${apiUrl}&action=get_calendar&month=${currentDate.getMonth() + 1}&year=${currentDate.getFullYear()}`);
      const data = await response.json();
      if (data.availableSlots) {
        setAvailableSlots(data.availableSlots);
      } else {
        setAvailableSlots({});
      }
    } catch (error) {
      console.error('Error fetching calendar', error);
    }
  }, [currentDate, apiUrl]);

  const generateCalendar = useCallback(() => {
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDate = startOfMonth.getDay();
    const totalDays = endOfMonth.getDate();

    const daysArray = [];
    for (let i = 0; i < startDate; i++) daysArray.push(null);
    for (let i = 1; i <= totalDays; i++) daysArray.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));
    setDays(daysArray);
  }, [currentDate]);

  useEffect(() => {
    generateCalendar();
    fetchAvailableSlots();
  }, [generateCalendar, fetchAvailableSlots]);

  const handlePreviousMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const handleDayClick = (day) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (day && day >= today) {
      const year = day.getFullYear();
      const month = String(day.getMonth() + 1).padStart(2, '0');
      const dateNum = String(day.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${dateNum}`;
      navigate(`/employee/bookings/station/${stationId}/timeslot/${formattedDate}`);
    }
  };

  const renderDay = (day, index) => {
    if (!day) return <div className="emp-calendar-day empty" key={`empty-${index}`}></div>;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const isPast = day < today;

    const year = day.getFullYear();
    const month = String(day.getMonth() + 1).padStart(2, '0');
    const dateNum = String(day.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${dateNum}`;

    const available = availableSlots[formattedDate] || 0;

    return (
      <div
        className={`emp-calendar-day ${isPast ? 'past' : ''} ${available > 0 && !isPast ? 'available' : ''}`}
        onClick={!isPast ? () => handleDayClick(day) : undefined}
        key={formattedDate}
        style={{
          border: '1px solid #e2e8f0',
          padding: '10px',
          minHeight: '100px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          cursor: !isPast ? 'pointer' : 'not-allowed',
          backgroundColor: isPast ? '#f9fafb' : 'white',
          opacity: isPast ? 0.5 : 1,
          borderRadius: '8px',
          boxShadow: !isPast ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
          transition: 'transform 0.2s',
          alignItems: 'center'
        }}
      >
        <div style={{ fontWeight: '600', color: '#0f172a', alignSelf: 'flex-start' }}>{day.getDate()}</div>
        {isPast ? (
          <div style={{ marginTop: '10px', textAlign: 'center', width: '100%' }}>
            <div style={{ color: '#ef4444', fontSize: '13px', fontWeight: '600', padding: '8px', backgroundColor: '#fee2e2', borderRadius: '4px' }}>Unavailable</div>
          </div>
        ) : (
          <div style={{ marginTop: '10px', textAlign: 'center', width: '100%' }}>
            <button className={available === 0 ? "booked" : "available"} style={{
              width: '100%',
              padding: '6px 0',
              border: 'none',
              borderRadius: '4px',
              backgroundColor: available === 0 ? '#ef4444' : '#22c55e',
              color: 'white',
              fontWeight: '600',
              cursor: available === 0 ? 'not-allowed' : 'pointer',
              marginBottom: '6px',
              pointerEvents: 'none' // Click is handled by the parent div
            }}>
              {available === 0 ? "Booked" : "Book"}
            </button>
            <div style={{
              display: 'inline-block',
              padding: '2px 8px',
              borderRadius: '12px',
              fontSize: '11px',
              fontWeight: '600',
              backgroundColor: available > 0 ? '#dcfce7' : '#fee2e2',
              color: available > 0 ? '#166534' : '#991b1b'
            }}>
              {available} slots left
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="emp-dashboard-home">
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <button onClick={() => navigate('/employee/bookings')} className="emp-btn" style={{ marginRight: '15px' }}>
          <i className="fa fa-arrow-left"></i> Back
        </button>
        <div>
          <h2 style={{ margin: 0, color: 'var(--text-primary)' }}>Select Date for Station 0{stationId}</h2>
        </div>
      </div>

      <div className="emp-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <button className="emp-btn" onClick={handlePreviousMonth}>&larr; Previous</button>
          <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>
            {currentDate.toLocaleString("default", { month: "long" })} {currentDate.getFullYear()}
          </h3>
          <button className="emp-btn" onClick={handleNextMonth}>Next &rarr;</button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '10px',
          textAlign: 'center',
          marginBottom: '10px',
          fontWeight: 'bold',
          color: 'var(--text-secondary)'
        }}>
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => <div key={d}>{d}</div>)}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px' }}>
          {days.map((day, index) => renderDay(day, index))}
        </div>
      </div>
    </div>
  );
};

export default EmployeeBookingCalendar;
