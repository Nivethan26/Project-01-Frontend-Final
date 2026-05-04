import React, { useState, useEffect, useRef } from 'react';
import './profile.css';
import { useUserAuth } from '../../utils/useUserAuth';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { toast } from 'react-toastify';

export default function Profile() {
  const { username } = useUserAuth();

  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('personal');
  const [saving, setSaving] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const fileInputRef = useRef(null);

  // Personal info form
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  // Vehicle form
  const [vehicleType, setVehicleType] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');

  // Password form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  // Preferences
  const [emailNotif, setEmailNotif] = useState(true);
  const [bookingReminders, setBookingReminders] = useState(true);

  // Original values for dirty checking
  const [originalPersonal, setOriginalPersonal] = useState({ name: '', phone: '', address: '' });
  const [originalVehicle, setOriginalVehicle] = useState({ vehicleType: '', vehicleModel: '', vehicleNumber: '' });
  const [originalPrefs, setOriginalPrefs] = useState({ emailNotif: true, bookingReminders: true });

  const fetchProfile = async () => {
    try {
      const email = sessionStorage.getItem('email');
      if (!email) return;
      const response = await fetch(`/Backend/getProfile.php?email=${encodeURIComponent(email)}`);
      const data = await response.json();
      if (data.success) {
        setProfile(data.user);
        setStats(data.stats);
        
        setName(data.user.name || '');
        setPhone(data.user.phone || '');
        setAddress(data.user.address || '');
        setVehicleType(data.user.vehicle_type || '');
        setVehicleModel(data.user.vehicle_model || '');
        setVehicleNumber(data.user.vehicle_number || '');
        setEmailNotif(data.user.email_notifications === null || data.user.email_notifications == 1);
        setBookingReminders(data.user.booking_reminders === null || data.user.booking_reminders == 1);

        // Set original values for dirty checking
        setOriginalPersonal({
          name: data.user.name || '',
          phone: data.user.phone || '',
          address: data.user.address || ''
        });
        setOriginalVehicle({
          vehicleType: data.user.vehicle_type || '',
          vehicleModel: data.user.vehicle_model || '',
          vehicleNumber: data.user.vehicle_number || ''
        });
        setOriginalPrefs({
          emailNotif: data.user.email_notifications === null || data.user.email_notifications == 1,
          bookingReminders: data.user.booking_reminders === null || data.user.booking_reminders == 1
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);



  const handleSave = async (updateType) => {
    setSaving(true);
    const email = sessionStorage.getItem('email');
    
    let payload = { email, updateType };

    if (updateType === 'personal') {
      if (!name.trim() || !phone.trim() || !address.trim()) {
        toast.error('Name, Phone, and Address are mandatory');
        setSaving(false);
        return;
      }
      payload = { ...payload, name, phone, address };
    } else if (updateType === 'vehicle') {
      if (vehicleType && (!vehicleModel.trim() || !vehicleNumber.trim())) {
        toast.error('Please provide vehicle model and plate number');
        setSaving(false);
        return;
      }
      payload = { ...payload, vehicleType, vehicleModel, vehicleNumber };
    } else if (updateType === 'preferences') {
      payload = { 
        ...payload, 
        emailNotifications: emailNotif ? 1 : 0, 
        bookingReminders: bookingReminders ? 1 : 0 
      };
    } else if (updateType === 'password') {
      if (newPassword !== confirmPassword) {
        toast.error('New passwords do not match');
        setSaving(false);
        return;
      }
      payload = { ...payload, currentPassword, newPassword };
    }

    try {
      const response = await fetch('/Backend/updateProfile.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      
      if (result.success) {
        toast.success('Changes saved successfully!');
        if (updateType === 'password') {
          setCurrentPassword('');
          setNewPassword('');
          setConfirmPassword('');
        } else if (updateType === 'personal') {
          setOriginalPersonal({ name, phone, address });
        } else if (updateType === 'vehicle') {
          setOriginalVehicle({ vehicleType, vehicleModel, vehicleNumber });
        } else if (updateType === 'preferences') {
          setOriginalPrefs({ emailNotif, bookingReminders });
        }
        fetchProfile(); // refresh data
      } else {
        toast.error(result.message || 'Update failed');
      }
    } catch (err) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const isPersonalChanged = 
    name.trim() !== originalPersonal.name ||
    phone.trim() !== originalPersonal.phone ||
    address.trim() !== originalPersonal.address;

  const isVehicleChanged =
    vehicleType !== originalVehicle.vehicleType ||
    vehicleModel.trim() !== originalVehicle.vehicleModel ||
    vehicleNumber.trim().toUpperCase() !== originalVehicle.vehicleNumber;

  const isPrefsChanged =
    emailNotif !== originalPrefs.emailNotif ||
    bookingReminders !== originalPrefs.bookingReminders;

  const isPasswordValid =
    currentPassword.trim() !== '' &&
    newPassword.trim() !== '' &&
    confirmPassword.trim() !== '' &&
    newPassword === confirmPassword &&
    newPassword.length >= 8;

  const handlePhotoClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadPhoto = async () => {
    if (!photoFile) return;
    setUploadingPhoto(true);
    
    const formData = new FormData();
    formData.append('email', sessionStorage.getItem('email'));
    formData.append('photo', photoFile);

    try {
      const response = await fetch('/Backend/uploadProfilePhoto.php', {
        method: 'POST',
        body: formData
      });
      const result = await response.json();
      
      if (result.success) {
        toast.success('Photo uploaded successfully!');
        setPhotoFile(null);
        setPhotoPreview(null);
        fetchProfile();
        window.dispatchEvent(new Event('profilePhotoUpdated'));
      } else {
        toast.error(result.message || 'Upload failed');
      }
    } catch (err) {
      toast.error('Error uploading photo');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const getPasswordStrength = (password) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    if (score === 0) return { label: '', color: '', width: '0%' };
    if (score === 1) return { label: 'Weak', color: '#dc2626', width: '25%' };
    if (score === 2) return { label: 'Fair', color: '#d97706', width: '50%' };
    if (score === 3) return { label: 'Good', color: '#2563eb', width: '75%' };
    return { label: 'Strong', color: '#16a34a', width: '100%' };
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  if (loading || !profile) {
    return <div className="profile-page">Loading...</div>;
  }

  const pwStrength = getPasswordStrength(newPassword);
  const email = sessionStorage.getItem('email');
  
  const displayPhoto = photoPreview || (profile.profile_photo ? `/Backend/${profile.profile_photo}` : 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1');
  const initial = (profile.name || email || 'U').charAt(0).toUpperCase();

  return (
    <div className="profile-page">
      {/* Left Panel - Profile Card */}
      <div className="profile-left">
        <div className="profile-card">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/jpeg, image/png, image/jpg, image/webp"
            style={{ display: 'none' }} 
          />
          
          <div className="photo-wrapper" onClick={handlePhotoClick}>
            <img src={displayPhoto} alt="Profile" />
            <div className="photo-overlay">
              <CameraAltIcon style={{ color: 'white', fontSize: 32 }} />
            </div>
          </div>
          
          {photoFile && (
            <button 
              className="save-btn" 
              style={{ float: 'none', width: '100%', marginBottom: '16px' }}
              onClick={uploadPhoto}
              disabled={uploadingPhoto}
            >
              {uploadingPhoto ? 'Uploading...' : 'Save Photo'}
            </button>
          )}

          <h2 style={{ fontSize: '20px', fontWeight: 600, margin: '0 0 4px 0' }}>{profile.name || 'User'}</h2>
          <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 4px 0' }}>{email}</p>

          {stats && (
            <div style={{ textAlign: 'left' }}>
              <div className="stats-row">
                <span>📋 Total</span>
                <span style={{ fontWeight: 600 }}>{stats.total}</span>
              </div>
              <div className="stats-row">
                <span>✅ Completed</span>
                <span style={{ fontWeight: 600 }}>{stats.completed}</span>
              </div>
              <div className="stats-row">
                <span>⏳ Pending</span>
                <span style={{ fontWeight: 600 }}>{stats.pending}</span>
              </div>
              <div className="stats-row">
                <span>❌ Cancelled</span>
                <span style={{ fontWeight: 600 }}>{stats.cancelled}</span>
              </div>
              <div className="stats-row" style={{ borderBottom: 'none' }}>
                <span>📅 Last Booking</span>
                <span style={{ fontWeight: 600 }}>{formatDate(stats.last_booking_date)}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Tabs */}
      <div className="profile-right">
        <div className="tab-bar">
          <button 
            className={`tab-btn ${activeTab === 'personal' ? 'active' : ''}`}
            onClick={() => setActiveTab('personal')}
          >
            👤 Personal Info {isPersonalChanged && <span className="unsaved-dot"></span>}
          </button>
          <button 
            className={`tab-btn ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            🔒 Security
          </button>
          <button 
            className={`tab-btn ${activeTab === 'vehicle' ? 'active' : ''}`}
            onClick={() => setActiveTab('vehicle')}
          >
            🚗 Vehicle {isVehicleChanged && <span className="unsaved-dot"></span>}
          </button>
          <button 
            className={`tab-btn ${activeTab === 'preferences' ? 'active' : ''}`}
            onClick={() => setActiveTab('preferences')}
          >
            🔔 Preferences {isPrefsChanged && <span className="unsaved-dot"></span>}
          </button>
        </div>

        <div className="tab-content">
          
          {/* TAB 1: Personal Info */}
          {activeTab === 'personal' && (
            <div>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input 
                  type="email" 
                  className="form-input" 
                  value={email} 
                  disabled 
                />
                <p style={{ fontSize: '12px', color: '#6b7280', margin: '4px 0 0 0' }}>Email cannot be changed</p>
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Address</label>
                <textarea 
                  className="form-input" 
                  style={{ height: 'auto', padding: '12px 14px' }}
                  rows="3"
                  value={address} 
                  onChange={(e) => setAddress(e.target.value)} 
                ></textarea>
              </div>
              <div style={{ overflow: 'hidden' }}>
                <button 
                  className="save-btn" 
                  onClick={() => handleSave('personal')}
                  disabled={!isPersonalChanged || saving}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: Security */}
          {activeTab === 'security' && (
            <div>
              <div className="form-group">
                <label className="form-label">Current Password</label>
                <div className="password-input-wrapper">
                  <input 
                    type={showCurrentPw ? "text" : "password"} 
                    className="form-input" 
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                  <button className="eye-btn" onClick={() => setShowCurrentPw(!showCurrentPw)}>
                    {showCurrentPw ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </button>
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">New Password</label>
                <div className="password-input-wrapper">
                  <input 
                    type={showNewPw ? "text" : "password"} 
                    className="form-input" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <button className="eye-btn" onClick={() => setShowNewPw(!showNewPw)}>
                    {showNewPw ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </button>
                </div>
              </div>

              {newPassword.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ color: '#374151', fontWeight: 500 }}>Password Strength:</span>
                    <span style={{ color: pwStrength.color, fontWeight: 600 }}>{pwStrength.label}</span>
                  </div>
                  <div className="strength-bar-track">
                    <div 
                      className="strength-bar-fill" 
                      style={{ width: pwStrength.width, backgroundColor: pwStrength.color }}
                    ></div>
                  </div>
                  
                  <p style={{ fontSize: '13px', fontWeight: 500, margin: '12px 0 4px', color: '#374151' }}>Requirements:</p>
                  <ul className="requirements-list">
                    <li className={newPassword.length >= 8 ? 'met' : ''}>
                      {newPassword.length >= 8 ? '✓ ' : '○ '}At least 8 characters
                    </li>
                    <li className={/[A-Z]/.test(newPassword) ? 'met' : ''}>
                      {/[A-Z]/.test(newPassword) ? '✓ ' : '○ '}Contains uppercase letter
                    </li>
                    <li className={/[0-9]/.test(newPassword) ? 'met' : ''}>
                      {/[0-9]/.test(newPassword) ? '✓ ' : '○ '}Contains number
                    </li>
                    <li className={/[^A-Za-z0-9]/.test(newPassword) ? 'met' : ''}>
                      {/[^A-Za-z0-9]/.test(newPassword) ? '✓ ' : '○ '}Contains special character
                    </li>
                  </ul>
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <div className="password-input-wrapper">
                  <input 
                    type={showConfirmPw ? "text" : "password"} 
                    className="form-input" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button className="eye-btn" onClick={() => setShowConfirmPw(!showConfirmPw)}>
                    {showConfirmPw ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </button>
                </div>
                {confirmPassword.length > 0 && newPassword === confirmPassword && (
                  <p style={{ fontSize: '13px', color: '#16a34a', margin: '4px 0 0 0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircleIcon style={{ fontSize: 16 }} /> Passwords match
                  </p>
                )}
              </div>

              <div style={{ overflow: 'hidden' }}>
                <button 
                  className="save-btn" 
                  onClick={() => handleSave('password')}
                  disabled={!isPasswordValid || saving}
                >
                  {saving ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: Vehicle Info */}
          {activeTab === 'vehicle' && (
            <div>
              <div className="form-group">
                <label className="form-label">Vehicle Type</label>
                <select 
                  className="form-input"
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                >
                  <option value="">Select Type</option>
                  <option value="Car">Car</option>
                  <option value="SUV">SUV</option>
                  <option value="Van">Van</option>
                  <option value="Truck">Truck</option>
                  <option value="Motorcycle">Motorcycle</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Vehicle Model</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Toyota Harrier"
                  value={vehicleModel} 
                  onChange={(e) => setVehicleModel(e.target.value)} 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Plate Number</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. CBE-1234"
                  value={vehicleNumber} 
                  onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())} 
                />
              </div>
              <div style={{ overflow: 'hidden' }}>
                <button 
                  className="save-btn" 
                  onClick={() => handleSave('vehicle')}
                  disabled={!isVehicleChanged || saving}
                >
                  {saving ? 'Saving...' : 'Save Vehicle Info'}
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: Preferences */}
          {activeTab === 'preferences' && (
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 600, margin: '0 0 16px 0', color: '#111827' }}>
                🔔 Notification Settings
              </h3>
              <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '0 0 20px 0' }} />
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                  <h4 style={{ margin: '0 0 4px', fontSize: '15px', color: '#374151' }}>Email Notifications</h4>
                  <p style={{ margin: 0, fontSize: '13px', color: '#6b7280' }}>Receive booking confirmations via email</p>
                </div>
                <div 
                  className={`toggle ${emailNotif ? 'active' : ''}`} 
                  onClick={() => setEmailNotif(!emailNotif)}
                ></div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                  <h4 style={{ margin: '0 0 4px', fontSize: '15px', color: '#374151' }}>Booking Reminders</h4>
                  <p style={{ margin: 0, fontSize: '13px', color: '#6b7280' }}>Get reminded 24hrs before your appointment</p>
                </div>
                <div 
                  className={`toggle ${bookingReminders ? 'active' : ''}`} 
                  onClick={() => setBookingReminders(!bookingReminders)}
                ></div>
              </div>

              <div style={{ overflow: 'hidden' }}>
                <button 
                  className="save-btn" 
                  onClick={() => handleSave('preferences')}
                  disabled={!isPrefsChanged || saving}
                >
                  {saving ? 'Saving...' : 'Save Preferences'}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
