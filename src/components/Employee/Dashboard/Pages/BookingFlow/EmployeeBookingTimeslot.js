import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const normalizePhone = (value = '') => value.replace(/\D/g, '').slice(0, 10);

const EmployeeBookingTimeslot = () => {
  const { stationId, date } = useParams();
  const navigate = useNavigate();
  const [timeslotStatus, setTimeslotStatus] = useState({});
  const [selectedTimeslot, setSelectedTimeslot] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalStep, setModalStep] = useState('form');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredSlot, setHoveredSlot] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(false);

  const stationPrices = { 1: 800, 2: 800, 3: 1500, 4: 3500 };
  const stationPrice = stationPrices[parseInt(stationId)] || 800;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    vehicleModel: '',
    vehicleNumber: ''
  });
  const [formErrors, setFormErrors] = useState({});

  const apiUrl = `/Backend/api.php?station_id=${stationId}`;

  const fetchTimeslots = useCallback(async () => {
    try {
      const response = await fetch(`${apiUrl}&action=get_timeslot_status&date=${date}`);
      const data = await response.json();
      setTimeslotStatus(data);
    } catch (error) {
      console.error('Error fetching timeslots', error);
    }
  }, [apiUrl, date]);

  useEffect(() => {
    fetchTimeslots();
  }, [fetchTimeslots]);

  useEffect(() => {
    if (showModal) {
      setIsLoadingUser(true);

      const load = async () => {
        try {
          // Use backend session (and remember-me) as the source of truth.
          const authRes = await fetch('/Backend/api/check-auth/index.php', {
            method: 'GET',
            credentials: 'include',
            headers: { Accept: 'application/json' },
          });

          if (!authRes.ok) {
            return;
          }

          const authData = await authRes.json();
          const userId = authData?.user?.id;

          const fetchProfileUrl = userId
            ? `/Backend/api/getUserDetails.php?id=${encodeURIComponent(String(userId))}`
            : '/Backend/api/getProfile.php';

          const profileRes = await fetch(fetchProfileUrl, { credentials: 'include' });
          if (!profileRes.ok) {
            return;
          }

          const data = await profileRes.json();
          const userData = data.data || data.user || data;

          setFormData(prev => ({
            ...prev,
            name: userData.name || userData.username || prev.name,
            email: userData.email || prev.email,
            phone: normalizePhone(userData.phone || userData.phoneNumber || prev.phone)
          }));
        } catch (_) {
          // Keep manual form entry if auto-fetch fails.
        }
      };

      load().finally(() => setIsLoadingUser(false));
    }
  }, [showModal]);

  const handleSlotClick = (slot) => {
    if (timeslotStatus[slot] !== 'booked') {
      setSelectedTimeslot(slot);
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTimeslot('');
    setFormErrors({});
    setModalStep('form');
    setPaymentMethod('');
  };

  const validateForm = useCallback((value) => {
    const errors = {};
    const name = value.name.trim();
    const email = value.email.trim();
    const phone = normalizePhone(value.phone);
    const vehicleModel = value.vehicleModel.trim();
    const vehicleNumber = value.vehicleNumber.trim();

    if (!name) errors.name = 'Full name is required.';

    if (!email) {
      errors.email = 'Email address is required.';
    } else if (!EMAIL_REGEX.test(email)) {
      errors.email = 'Please enter a valid email address.';
    }

    if (!phone) {
      errors.phone = 'Phone number is required.';
    } else if (phone.length !== 10) {
      errors.phone = 'Phone number must be exactly 10 digits.';
    }

    if (!vehicleModel) errors.vehicleModel = 'Vehicle model is required.';
    if (!vehicleNumber) errors.vehicleNumber = 'Vehicle number is required.';

    return errors;
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const nextValue = name === 'phone' ? normalizePhone(value) : value;
    const nextFormData = { ...formData, [name]: nextValue };

    setFormData(nextFormData);
    setFormErrors(validateForm(nextFormData));
  };

  const handleGoToPayment = (e) => {
    e.preventDefault();
    const errors = validateForm(formData);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      return toast.error('Please fix the booking form errors.');
    }
    setModalStep('payment');
  };

  const handleConfirmBooking = async () => {
    if (!paymentMethod) return toast.error('Please select a payment method.');
    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: normalizePhone(formData.phone),
        vehicleModel: formData.vehicleModel.trim(),
        vehicleNumber: formData.vehicleNumber.trim(),
        date, timeslot: selectedTimeslot,
        station_id: parseInt(stationId),
        paymentMethod: paymentMethod
      };
      const response = await fetch(`${apiUrl}&action=add_booking`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      if (result.status === 'success' || result.success) {
        handleCloseModal();
        await fetchTimeslots();
        toast.success('Booking confirmed successfully!');
      } else {
        toast.error(result.message || 'Failed to book.');
      }
    } catch (error) {
      toast.error('Server connection failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const categorizeSlots = (slotsData) => {
    const categories = { Morning: [], Afternoon: [], Evening: [] };
    Object.keys(slotsData).forEach(slotStr => {
      const startTimeStr = slotStr.split('-')[0].trim().toLowerCase();
      const match = startTimeStr.match(/(\d+)/);
      let hour = match ? parseInt(match[1], 10) : 0;
      if (startTimeStr.includes('pm') && hour < 12) hour += 12;
      if (startTimeStr.includes('am') && hour === 12) hour = 0;

      if (hour < 12) categories.Morning.push(slotStr);
      else if (hour >= 12 && hour < 16) categories.Afternoon.push(slotStr);
      else categories.Evening.push(slotStr);
    });
    // Fallback if data is empty or malformed
    if (!categories.Morning.length && !categories.Afternoon.length && !categories.Evening.length) {
      return {
        Morning: ['09:00 AM - 10:00 AM', '10:00 AM - 11:00 AM', '11:00 AM - 12:00 PM'],
        Afternoon: ['12:00 PM - 01:00 PM', '01:00 PM - 02:00 PM', '02:00 PM - 03:00 PM', '03:00 PM - 04:00 PM'],
        Evening: ['04:00 PM - 05:00 PM', '05:00 PM - 06:00 PM', '06:00 PM - 07:00 PM']
      };
    }
    return categories;
  };

  const slotGroups = categorizeSlots(timeslotStatus);

  return (
    <div className="emp-dashboard-home">
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <button onClick={() => navigate(-1)} className="emp-btn" style={{ marginRight: '15px' }}>
          <i className="fa fa-arrow-left"></i> Back
        </button>
        <div>
          <h2 style={{ margin: 0, color: '#0f172a' }}>Select a Time Slot</h2>
          <p style={{ margin: 0, color: '#64748b' }}>Station 0{stationId} - Date: {date}</p>
        </div>
      </div>

      <div className="emp-card" style={{ padding: '30px' }}>
        {Object.keys(slotGroups).map((period) => {
          if (slotGroups[period].length === 0) return null;
          return (
            <div key={period} style={{ marginBottom: '30px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#334155', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className={`fa ${period === 'Morning' ? 'fa-sun-o' : period === 'Afternoon' ? 'fa-clock-o' : 'fa-moon-o'}`} style={{ color: period === 'Morning' ? '#f59e0b' : period === 'Afternoon' ? '#ef4444' : '#3b82f6' }}></i>
                {period}
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '16px' }}>
                {slotGroups[period].map((slot) => {
                  const status = timeslotStatus[slot] || 'available';
                  const isBooked = status === 'booked';
                  const isSelected = selectedTimeslot === slot && !isBooked;
                  const isHovered = hoveredSlot === slot && !isBooked;

                  let bg = 'green';
                  let hoverBg = 'darkgreen';
                  if (isBooked) bg = 'red';
                  if (isSelected) bg = 'darkgreen';

                  return (
                    <button
                      key={slot}
                      onClick={() => handleSlotClick(slot)}
                      onMouseEnter={() => setHoveredSlot(slot)}
                      onMouseLeave={() => setHoveredSlot(null)}
                      disabled={isBooked}
                      style={{
                        padding: '14px 16px',
                        border: '2px solid transparent',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '600',
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: isBooked ? 'red' : (isHovered || isSelected ? hoverBg : bg),
                        color: 'white',
                        boxShadow: isBooked ? 'none' : (isHovered || isSelected ? '0 6px 12px rgba(0, 128, 0, 0.3)' : '0 2px 4px rgba(0, 128, 0, 0.2)'),
                        cursor: isBooked ? 'not-allowed' : 'pointer',
                        opacity: isBooked ? 0.7 : 1,
                        transform: !isBooked && (isHovered || isSelected) ? 'translateY(-3px) scale(1.02)' : 'none',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
              <div style={{ borderBottom: '1px solid #e2e8f0', marginTop: '20px' }}></div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(6px)',
          zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{
            background: 'white', padding: '35px 40px', borderRadius: '16px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', width: '90%', maxWidth: '600px',
            maxHeight: '90vh', overflowY: 'auto', position: 'relative'
          }}>
            <button
              onClick={handleCloseModal}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#e2e8f0'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              style={{
                position: 'absolute', top: '16px', right: '16px',
                background: 'transparent', border: 'none', fontSize: '1.5rem', color: '#64748b',
                cursor: 'pointer', borderRadius: '50%', width: '36px', height: '36px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background-color 0.2s ease'
              }}
            >
              &times;
            </button>

            {modalStep === 'form' ? (
            <div>
            <div style={{ marginBottom: '25px', borderBottom: '1px solid #e2e8f0', paddingBottom: '15px', paddingRight: '20px' }}>
              <h2 style={{ margin: 0, fontSize: '1.6rem', color: '#1e293b', fontWeight: '700', letterSpacing: '-0.02em' }}>Confirm Booking</h2>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', marginBottom: '25px' }}>
                <h4 style={{ margin: '0 0 15px 0', color: '#64748b', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Booking Summary</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div><p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem' }}>Station</p><p style={{ margin: '4px 0 0 0', color: '#0f172a', fontWeight: '600' }}>Station 0{stationId}</p></div>
                  <div><p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem' }}>Service Type</p><p style={{ margin: '4px 0 0 0', color: '#0f172a', fontWeight: '600' }}>General Service</p></div>
                  <div><p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem' }}>Date</p><p style={{ margin: '4px 0 0 0', color: '#0f172a', fontWeight: '600' }}>{date}</p></div>
                  <div><p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem' }}>Time</p><p style={{ margin: '4px 0 0 0', color: '#db2424', fontWeight: '600' }}>{selectedTimeslot}</p></div>
                </div>
              </div>
              <form id="slotBookingForm" onSubmit={handleGoToPayment}>
                <div style={{ display: 'grid', gap: '20px', marginBottom: '25px', opacity: isLoadingUser ? 0.6 : 1, pointerEvents: isLoadingUser ? 'none' : 'auto' }}>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', fontWeight: '500', color: '#334155' }}>Full Name *</label>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} readOnly required placeholder={isLoadingUser ? "Loading..." : "Enter full name"} style={{ width: '100%', padding: '12px 16px', border: `1px solid ${formErrors.name ? '#ef4444' : '#cbd5e1'}`, borderRadius: '8px', fontSize: '1rem', transition: 'all 0.2s ease', backgroundColor: '#e2e8f0', cursor: 'not-allowed', color: '#64748b', boxSizing: 'border-box' }} />
                    {formErrors.name && <small style={{ color: '#ef4444' }}>{formErrors.name}</small>}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', gridColumn: '1 / -1' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', fontWeight: '500', color: '#334155' }}>Email Address *</label>
                      <input type="email" name="email" value={formData.email} onChange={handleInputChange} readOnly required placeholder={isLoadingUser ? "Loading..." : "Enter email"} style={{ width: '100%', padding: '12px 16px', border: `1px solid ${formErrors.email ? '#ef4444' : '#cbd5e1'}`, borderRadius: '8px', fontSize: '1rem', transition: 'all 0.2s ease', backgroundColor: '#e2e8f0', cursor: 'not-allowed', color: '#64748b', boxSizing: 'border-box' }} />
                      {formErrors.email && <small style={{ color: '#ef4444' }}>{formErrors.email}</small>}
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', fontWeight: '500', color: '#334155' }}>Phone Number *</label>
                      <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} readOnly required inputMode="numeric" maxLength={10} placeholder={isLoadingUser ? "Loading..." : "Enter phone"} style={{ width: '100%', padding: '12px 16px', border: `1px solid ${formErrors.phone ? '#ef4444' : '#cbd5e1'}`, borderRadius: '8px', fontSize: '1rem', transition: 'all 0.2s ease', backgroundColor: '#e2e8f0', cursor: 'not-allowed', color: '#64748b', boxSizing: 'border-box' }} />
                      {formErrors.phone && <small style={{ color: '#ef4444' }}>{formErrors.phone}</small>}
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', gridColumn: '1 / -1' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', fontWeight: '500', color: '#334155' }}>Vehicle Model *</label>
                      <input type="text" name="vehicleModel" value={formData.vehicleModel} onChange={handleInputChange} required placeholder="e.g., Toyota Corolla" style={{ width: '100%', padding: '12px 16px', border: `1px solid ${formErrors.vehicleModel ? '#ef4444' : '#cbd5e1'}`, borderRadius: '8px', fontSize: '1rem', transition: 'all 0.2s ease', backgroundColor: '#f8fafc', boxSizing: 'border-box' }} />
                      {formErrors.vehicleModel && <small style={{ color: '#ef4444' }}>{formErrors.vehicleModel}</small>}
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', fontWeight: '500', color: '#334155' }}>Vehicle Number *</label>
                      <input type="text" name="vehicleNumber" value={formData.vehicleNumber} onChange={handleInputChange} required placeholder="e.g., CAB-1234, WP ABC-5678" style={{ width: '100%', padding: '12px 16px', border: `1px solid ${formErrors.vehicleNumber ? '#ef4444' : '#cbd5e1'}`, borderRadius: '8px', fontSize: '1rem', transition: 'all 0.2s ease', backgroundColor: '#f8fafc', boxSizing: 'border-box' }} />
                      {formErrors.vehicleNumber && <small style={{ color: '#ef4444' }}>{formErrors.vehicleNumber}</small>}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #e2e8f0' }}>
                  <button type="button" onClick={handleCloseModal} style={{ padding: '12px 24px', borderRadius: '8px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer', backgroundColor: 'transparent', color: '#64748b', border: '2px solid #cbd5e1' }}>Cancel</button>
                  <button type="submit" disabled={isLoadingUser} style={{ padding: '12px 24px', borderRadius: '8px', fontSize: '1rem', fontWeight: '600', cursor: isLoadingUser ? 'not-allowed' : 'pointer', backgroundColor: '#2563eb', color: 'white', border: 'none', boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)' }}>Continue to Payment →</button>
                </div>
              </form>
            </div>
            </div>
            ) : (
            <div>
              <div style={{ marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '15px' }}>
                <h2 style={{ margin: 0, fontSize: '1.6rem', color: '#1e293b', fontWeight: '700' }}>Payment & Confirmation</h2>
                <p style={{ margin: '6px 0 0', color: '#64748b', fontSize: '0.9rem' }}>Choose your payment method and confirm booking</p>
              </div>
              {/* Payment Options */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                {[
                  { key: 'cash', icon: '💵', label: 'Pay at Centre', desc: 'Cash payment on arrival' },
                  { key: 'card', icon: '💳', label: 'Online Card Payment', desc: 'Pay securely via debit/credit card' },
                ].map(opt => (
                  <div key={opt.key} onClick={() => setPaymentMethod(opt.key)} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px', border: `2px solid ${paymentMethod === opt.key ? '#2563eb' : '#e2e8f0'}`, borderRadius: '12px', cursor: 'pointer', background: paymentMethod === opt.key ? 'rgba(37,99,235,0.04)' : '#fff', transition: 'all 0.2s' }}>
                    <span style={{ fontSize: '28px' }}>{opt.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.95rem' }}>{opt.label}</div>
                      <div style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '2px' }}>{opt.desc}</div>
                    </div>
                    <div style={{ width: '22px', height: '22px', borderRadius: '50%', border: `2px solid ${paymentMethod === opt.key ? '#2563eb' : '#cbd5e1'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {paymentMethod === opt.key && <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#2563eb' }} />}
                    </div>
                  </div>
                ))}
              </div>
              {/* Order Summary */}
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
                <h4 style={{ margin: '0 0 14px', color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Order Summary</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#64748b' }}>Station</span><span style={{ color: '#0f172a', fontWeight: 600 }}>Station 0{stationId}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#64748b' }}>Date & Time</span><span style={{ color: '#0f172a', fontWeight: 600 }}>{date}, {selectedTimeslot}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#64748b' }}>Customer</span><span style={{ color: '#0f172a', fontWeight: 600 }}>{formData.name}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#64748b' }}>Vehicle</span><span style={{ color: '#0f172a', fontWeight: 600 }}>{formData.vehicleModel} · {formData.vehicleNumber}</span></div>
                  <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '10px', marginTop: '4px', display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#0f172a', fontWeight: 700, fontSize: '1rem' }}>Total</span><span style={{ color: '#166534', fontWeight: 800, fontSize: '1.1rem' }}>Rs. {stationPrice.toLocaleString()}</span></div>
                </div>
              </div>
              {/* Actions */}
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
                <button type="button" onClick={() => setModalStep('form')} style={{ padding: '12px 24px', borderRadius: '8px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer', backgroundColor: 'transparent', color: '#64748b', border: '2px solid #cbd5e1' }}>← Back</button>
                <button type="button" onClick={handleConfirmBooking} disabled={isSubmitting || !paymentMethod} style={{ padding: '12px 28px', borderRadius: '8px', fontSize: '1rem', fontWeight: '700', cursor: (isSubmitting || !paymentMethod) ? 'not-allowed' : 'pointer', backgroundColor: (!paymentMethod) ? '#93c5fd' : '#2563eb', color: 'white', border: 'none', boxShadow: '0 4px 6px -1px rgba(37,99,235,0.2)', opacity: (!paymentMethod) ? 0.7 : 1 }}>
                  {isSubmitting ? 'Processing...' : 'Confirm Booking ✓'}
                </button>
              </div>
            </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeBookingTimeslot;