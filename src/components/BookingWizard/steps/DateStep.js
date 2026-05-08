import React, { useState, useEffect, useCallback } from 'react';

export default function DateStep({ state, update, goTo, isWash }) {
  const [timeslots, setTimeslots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [availability, setAvailability] = useState(state.availabilityInfo || null);
  const [loadingAvail, setLoadingAvail] = useState(false);
  const [error, setError] = useState(null);

  // Range and Calendar states
  const [rangeData, setRangeData] = useState([]);
  const [loadingRange, setLoadingRange] = useState(false);

  // Today and bounds calculation
  const today = new Date();
  const minDate = today.toISOString().split('T')[0];
  const maxDateObj = new Date(today);
  maxDateObj.setDate(maxDateObj.getDate() + 30);
  const maxDate = maxDateObj.toISOString().split('T')[0];

  const [currentMonth, setCurrentMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const isSunday = (dateStr) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.getDay() === 0;
  };

  const fetchTimeslots = useCallback(async (date) => {
    if (!state.selectedStation) return;
    setLoadingSlots(true);
    setError(null);
    try {
      const res = await fetch(
        `/Backend/api/booking-wizard/wash-timeslots.php?stationId=${state.selectedStation.id}&date=${date}`
      );
      const data = await res.json();
      if (data.success) {
        setTimeslots(data.timeslots || []);
      } else {
        setError(data.message || 'Failed to load timeslots');
      }
    } catch (err) {
      setError('Network error loading timeslots');
    } finally {
      setLoadingSlots(false);
    }
  }, [state.selectedStation]);

  const fetchAvailability = useCallback(async (date) => {
    if (!state.selectedCategory) return;
    setLoadingAvail(true);
    setError(null);
    const catKey = typeof state.selectedCategory === 'object' ? state.selectedCategory.key : state.selectedCategory;
    try {
      const res = await fetch(
        `/Backend/api/booking-wizard/availability.php?category=${catKey}&date=${date}`
      );
      const data = await res.json();
      if (data.success) {
        setAvailability(data);
        update({ availabilityInfo: data });
      } else {
        setError(data.message || 'Failed to check availability');
      }
    } catch (err) {
      setError('Network error checking availability');
    } finally {
      setLoadingAvail(false);
    }
  }, [state.selectedCategory, update]);

  // Fetch range data for the custom calendar on load
  const fetchRangeData = useCallback(async () => {
    if (isWash || !state.selectedCategory) return;
    setLoadingRange(true);
    setError(null);
    const catKey = typeof state.selectedCategory === 'object' ? state.selectedCategory.key : state.selectedCategory;
    try {
      const res = await fetch(
        `/Backend/api/booking-wizard/availability-range.php?category=${catKey}&startDate=${minDate}&endDate=${maxDate}`
      );
      const data = await res.json();
      if (data.success) {
        setRangeData(data.range || []);
      } else {
        setError(data.message || 'Failed to check availability range');
      }
    } catch (err) {
      setError('Network error loading availability range');
    } finally {
      setLoadingRange(false);
    }
  }, [state.selectedCategory, isWash, minDate, maxDate]);

  // Bug 1B: Re-fetch range and specific availability when entering the date step
  useEffect(() => {
    if (isWash) {
      if (state.selectedDate) {
        fetchTimeslots(state.selectedDate);
      }
    } else {
      fetchRangeData();
      if (state.selectedDate) {
        fetchAvailability(state.selectedDate);
      }
    }
  }, [state.selectedDate, isWash, fetchTimeslots, fetchAvailability, fetchRangeData]);

  const handleDateChange = (date) => {
    if (isSunday(date)) {
      setError('We are closed on Sundays. Please select another date.');
      return;
    }
    setError(null);
    update({ selectedDate: date, selectedTimeslot: null });
    setTimeslots([]);
  };

  const handleTimeslotSelect = (slot) => {
    if (!slot.available) return;
    update({ selectedTimeslot: slot.slot });
  };

  // Immediate select and redirect to Customer Step on Book Click!
  const handleDateClick = (dateStr) => {
    if (isSunday(dateStr)) {
      setError('We are closed on Sundays. Please select another date.');
      return;
    }
    setError(null);
    const { max, booked, remaining } = getDayAvailability(dateStr);
    if (remaining <= 0) return;

    const mockAvailability = {
      success: true,
      canBook: true,
      maxCapacity: max,
      currentBookings: booked,
      remainingSlots: remaining
    };

    update({
      selectedDate: dateStr,
      selectedTimeslot: null,
      availabilityInfo: mockAvailability
    });

    // Synchronously jump to customer step (Step 3)!
    goTo(3);
  };

  const canContinue = isWash
    ? (state.selectedDate && state.selectedTimeslot)
    : (state.selectedDate && availability && availability.canBook);

  // Both flows: step 2 → step 3 (customer details)
  const nextStep = 3;
  const backStep = 1;

  // Calendar month navigation
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const isPrevDisabled = currentMonth.getFullYear() === today.getFullYear() && currentMonth.getMonth() === today.getMonth();

  // Generate Calendar cells
  const firstDayIndex = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  const totalDaysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();

  const daysGrid = [];
  for (let i = 0; i < firstDayIndex; i++) {
    daysGrid.push({ isPadding: true });
  }
  for (let d = 1; d <= totalDaysInMonth; d++) {
    const dStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    daysGrid.push({
      dateStr: dStr,
      dayNum: d,
      isPadding: false
    });
  }

  const getDayAvailability = (dateStr) => {
    const dateInfo = rangeData.find(item => item.date === dateStr);
    const max = dateInfo ? dateInfo.max : (rangeData[0]?.max || 5);
    const booked = dateInfo ? dateInfo.booked : 0;
    const remaining = max - booked;
    return { max, booked, remaining };
  };

  const monthsList = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getSelectedDateStatus = () => {
    if (!state.selectedDate || isWash) return null;
    const { max, booked, remaining } = getDayAvailability(state.selectedDate);
    if (remaining >= 3) {
      return (
        <div className="cal-selected-status green">
          ✅ {remaining} slots available on {state.selectedDate}
        </div>
      );
    } else if (remaining > 0) {
      return (
        <div className="cal-selected-status orange">
          ⚠️ Only {remaining} slots left on {state.selectedDate}
        </div>
      );
    }
    return null;
  };

  const renderCell = (day, idx) => {
    if (day.isPadding) {
      return <div key={`pad-${idx}`} className="bw-cal-day empty"></div>;
    }

    const { dateStr, dayNum } = day;
    const isPast = dateStr < minDate;
    const isTooFar = dateStr > maxDate;
    const isSun = isSunday(dateStr);
    const { max, booked, remaining } = getDayAvailability(dateStr);

    const isFullyBooked = remaining <= 0;
    const isSelected = state.selectedDate === dateStr;

    if (isSun || isPast || isTooFar) {
      return (
        <div key={dateStr} className="bw-cal-day past">
          <div className="bw-cal-date-number">{dayNum}</div>
          <div className="bw-cal-status na">Unavailable</div>
        </div>
      );
    }

    return (
      <div
        key={dateStr}
        className={`bw-cal-day ${isSelected ? 'selected' : ''}`}
        onClick={() => handleDateClick(dateStr)}
      >
        <div className="bw-cal-date-number">{dayNum}</div>
        <div className="bw-cal-status book">
          <button 
            className={isFullyBooked ? "booked" : "available"} 
            type="button"
            onClick={(e) => {
              e.stopPropagation(); // Prevent duplicate parent trigger
              handleDateClick(dateStr);
            }}
          >
            {isFullyBooked ? "Booked" : "Book"}
          </button>
          <div className={`badge ${isFullyBooked ? "booked-badge" : "available-badge"}`}>
            {remaining} slots left
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bw-card">
      <style>{`
        /* Scoped Station-style Calendar CSS */
        .bw-calendar-wrapper {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          margin: 12px auto;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          box-sizing: border-box;
        }
        .bw-cal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          padding: 10px 20px;
          margin-bottom: 20px;
          box-sizing: border-box;
        }
        .bw-cal-header button {
          background-color: rgb(19, 93, 127);
          color: white;
          border: none;
          border-radius: 8px;
          padding: 10px 20px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .bw-cal-header button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }
        .bw-cal-header button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .bw-cal-current-month {
          font-size: 1.8em;
          font-weight: 700;
          color: #333;
        }
        .bw-cal-grid {
          display: grid;
          grid-template-columns: repeat(7, minmax(0, 1fr));
          gap: 8px;
          width: 100%;
          box-sizing: border-box;
        }
        .bw-cal-day-name {
          text-align: center;
          font-weight: 600;
          color: #555;
          padding-bottom: 6px;
          font-size: 13px;
        }
        .bw-cal-day {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          padding: 8px 6px;
          border: 1px solid #ddd;
          border-radius: 10px;
          background-color: #fff;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03);
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
          min-height: 90px;
          cursor: pointer;
          box-sizing: border-box;
        }
        .bw-cal-day:not(.empty):not(.past):hover {
          transform: translateY(-4px) scale(1.02);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
          border-color: rgb(19, 93, 127);
        }
        .bw-cal-day.empty {
          background-color: #f9f9f9;
          border: 1px dashed #ddd;
          box-shadow: none;
          cursor: default;
        }
        .bw-cal-day.past {
          opacity: 0.6;
          cursor: not-allowed;
          background-color: #f9f9f9;
        }
        .bw-cal-day.selected {
          border-color: rgb(19, 93, 127) !important;
          background-color: rgba(19, 93, 127, 0.05) !important;
          box-shadow: 0 0 0 3px rgba(19, 93, 127, 0.2) !important;
        }
        .bw-cal-date-number {
          font-size: 1.1em;
          font-weight: 700;
          color: #333;
          margin-bottom: 8px;
        }
        .bw-cal-status {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }
        .bw-cal-status.na {
          color: red;
          font-weight: 600;
          font-size: 0.85em;
          background-color: rgba(255, 0, 0, 0.05);
          padding: 4px 6px;
          border-radius: 6px;
          width: 100%;
          text-align: center;
          box-sizing: border-box;
        }
        .bw-cal-status.book {
          width: 100%;
        }
        .bw-cal-status.book button {
          background-color: rgb(1, 146, 1);
          color: white;
          border: none;
          padding: 6px 0;
          border-radius: 6px;
          font-weight: 600;
          width: 100%;
          transition: transform 0.2s ease, background-color 0.2s ease;
          cursor: pointer;
          font-size: 12px;
        }
        .bw-cal-status.book button:hover {
          background-color: darkgreen;
          transform: scale(1.05);
        }
        .bw-cal-status.book button:active {
          transform: scale(0.95);
        }
        .bw-cal-status.book button.booked {
          background-color: red;
          cursor: default;
        }
        .bw-cal-status.book button.booked:hover {
          transform: none;
          background-color: red;
        }
        .bw-cal-status.book .badge {
          font-size: 0.7em;
          font-weight: 600;
          padding: 3px 6px;
          border-radius: 20px;
          display: inline-block;
          margin-top: 2px;
          white-space: nowrap;
        }
        .bw-cal-status.book .badge.available-badge {
          background-color: rgba(0, 128, 0, 0.1);
          color: green;
        }
        .bw-cal-status.book .badge.booked-badge {
          background-color: rgba(255, 0, 0, 0.1);
          color: red;
        }
        .cal-selected-status {
          padding: 10px 14px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          margin-top: 12px;
          text-align: center;
        }
        .cal-selected-status.green {
          background: #f0fdf4;
          color: #15803d;
          border: 1px solid #bbf7d0;
        }
        .cal-selected-status.orange {
          background: #fff7ed;
          color: #c2410c;
          border: 1px solid #ffedd5;
        }
        @media (max-width: 1024px) {
          .bw-cal-grid {
            gap: 6px;
          }
        }
        @media (max-width: 768px) {
          .bw-cal-header {
            flex-direction: column;
            gap: 16px;
          }
          .bw-cal-current-month {
            order: -1;
          }
          .bw-cal-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .bw-cal-day-name {
            display: none;
          }
        }
      `}</style>

      <h2 className="bw-step-title">
        {isWash ? 'Pick a Date & Time' : 'Select Your Preferred Date'}
      </h2>
      <p className="bw-step-subtitle">
        {isWash
          ? `Station ${state.selectedStation?.station_number} — ${state.selectedStation?.service_type}`
          : `${state.selectedService?.serviceName || 'Service'} — ${typeof state.selectedCategory === 'object' ? (state.selectedCategory?.label || '') : (state.selectedCategory || '')}`
        }
      </p>

      {error && <div className="bw-error-alert">⚠️ {error}</div>}

      {/* Date Selection Grid / Input */}
      {isWash ? (
        <div className="bw-date-section">
          <label>Appointment Date</label>
          <input
            type="date"
            className="bw-date-input"
            min={minDate}
            max={maxDate}
            value={state.selectedDate || ''}
            onChange={(e) => handleDateChange(e.target.value)}
          />
          <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 6 }}>
            Closed on Sundays · Bookings available up to 30 days ahead
          </p>
        </div>
      ) : (
        <div className="bw-calendar-section" style={{ margin: '20px 0', width: '100%' }}>
          <label style={{ fontSize: 14, fontWeight: 600, color: '#334155', display: 'block', marginBottom: 12 }}>
            Appointment Date
          </label>
          {loadingRange ? (
            <div className="bw-skeleton" style={{ height: 350, borderRadius: 12, width: '100%' }} />
          ) : (
            <div className="bw-calendar-wrapper">
              {/* Calendar Header */}
              <div className="bw-cal-header">
                <button
                  type="button"
                  onClick={prevMonth}
                  disabled={isPrevDisabled}
                >
                  Previous Month
                </button>
                <div className="bw-cal-current-month">
                  {monthsList[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </div>
                <button
                  type="button"
                  onClick={nextMonth}
                >
                  Next Month
                </button>
              </div>

              {/* Days & Day Names inside the exact same Grid container */}
              <div className="bw-cal-grid">
                {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
                  <div className="bw-cal-day-name" key={day}>
                    {day}
                  </div>
                ))}
                {daysGrid.map((day, idx) => renderCell(day, idx))}
              </div>
            </div>
          )}

          {/* Selected Date Status Display */}
          {getSelectedDateStatus()}
        </div>
      )}

      {/* Wash: Timeslot Grid */}
      {isWash && state.selectedDate && (
        <>
          <label style={{ fontSize: 14, fontWeight: 600, color: '#334155', display: 'block', marginBottom: 8 }}>
            Available Time Slots
          </label>
          {loadingSlots ? (
            <div className="bw-timeslot-grid">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bw-skeleton" style={{ height: 48 }} />
              ))}
            </div>
          ) : (
            <div className="bw-timeslot-grid">
              {timeslots.map(slot => (
                <div
                  key={slot.slot}
                  className={`bw-timeslot ${slot.booked ? 'booked' : ''} ${slot.past ? 'past' : ''} ${state.selectedTimeslot === slot.slot ? 'selected' : ''}`}
                  onClick={() => handleTimeslotSelect(slot)}
                >
                  {slot.slot}
                  {slot.booked && <div className="bw-timeslot-label">Booked</div>}
                  {slot.past && !slot.booked && <div className="bw-timeslot-label">Passed</div>}
                </div>
              ))}
              {timeslots.length === 0 && !loadingSlots && (
                <p style={{ gridColumn: '1/-1', textAlign: 'center', color: '#94a3b8', padding: 20 }}>
                  No timeslots available for this date
                </p>
              )}
            </div>
          )}
        </>
      )}

      {/* Non-wash: Availability info */}
      {!isWash && state.selectedDate && (
        <div style={{ marginTop: 8 }}>
          {loadingAvail ? (
            <div className="bw-skeleton" style={{ height: 48, maxWidth: 320 }} />
          ) : (
            null
          )}
        </div>
      )}

      <div className="bw-actions">
        <button className="bw-btn-back" onClick={() => goTo(backStep)}>← Back</button>
        <button className="bw-btn-next" disabled={!canContinue} onClick={() => goTo(nextStep)}>
          Continue →
        </button>
      </div>
    </div>
  );
}
