import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useOutletContext } from 'react-router-dom';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^0\d{9}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@!?/_-])[A-Za-z\d@!?/_-]{8,20}$/;

const normalizeProfile = (value) => ({
    fullName: value.fullName.trim(),
    email: value.email.trim(),
    phone: value.phone.trim(),
    address: value.address.trim()
});

const validateProfile = (value) => {
    const errors = {};
    const normalized = normalizeProfile(value);

    if (!normalized.fullName) {
        errors.fullName = 'Full name is required.';
    }

    if (!normalized.email) {
        errors.email = 'Email is required.';
    } else if (!EMAIL_REGEX.test(normalized.email)) {
        errors.email = 'Please enter a valid email address.';
    }

    if (!normalized.phone) {
        errors.phone = 'Phone number is required.';
    } else if (!PHONE_REGEX.test(normalized.phone)) {
        errors.phone = 'Phone number must be 10 digits and start with 0.';
    }

    if (!normalized.address) {
        errors.address = 'Address is required.';
    }

    return errors;
};

const validatePasswords = (value) => {
    const errors = {};

    if (!value.newPassword && !value.confirmPassword) {
        return errors;
    }

    if (value.newPassword && !PASSWORD_REGEX.test(value.newPassword)) {
        errors.newPassword = 'Password must be 8-20 chars with upper, lower, number, and special (@!?/_-).';
    }

    if (value.newPassword !== value.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match.';
    }

    return errors;
};

const EmployeeProfile = () => {
    const { user } = useOutletContext();
    const fileInputRef = useRef(null);

    const [profile, setProfile] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        profile_photo: ''
    });
    const [passwords, setPasswords] = useState({
        newPassword: '',
        confirmPassword: ''
    });
    const [initialProfile, setInitialProfile] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        profile_photo: ''
    });
    const [profileErrors, setProfileErrors] = useState({});
    const [passwordErrors, setPasswordErrors] = useState({});
    const [loadingProfile, setLoadingProfile] = useState(false);
    const [savingProfile, setSavingProfile] = useState(false);
    const [savingPassword, setSavingPassword] = useState(false);

    // Profile photo upload states
    const [photoFile, setPhotoFile] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [uploadingPhoto, setUploadingPhoto] = useState(false);

    const isProfileModified = useMemo(() => {
        const current = normalizeProfile(profile);
        const initial = normalizeProfile(initialProfile);

        return (
            current.fullName !== initial.fullName ||
            current.email !== initial.email ||
            current.phone !== initial.phone ||
            current.address !== initial.address
        );
    }, [profile, initialProfile]);

    const isPasswordModified = useMemo(() => {
        return passwords.newPassword !== '' || passwords.confirmPassword !== '';
    }, [passwords]);

    const canSaveProfile = useMemo(() => {
        return isProfileModified && Object.keys(profileErrors).length === 0;
    }, [isProfileModified, profileErrors]);

    const canSavePassword = useMemo(() => {
        return isPasswordModified && Object.keys(passwordErrors).length === 0;
    }, [isPasswordModified, passwordErrors]);

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
        formData.append('email', profile.email || user?.email);
        formData.append('photo', photoFile);

        try {
            const response = await fetch('http://localhost/Backend/uploadProfilePhoto.php', {
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

    const fetchProfile = useCallback(async () => {
        setLoadingProfile(true);
        const employeeId = user?.id || user?.employeeId;

        if (!employeeId) {
            setLoadingProfile(false);
            return;
        }

        try {
            const res = await axios.get(`http://localhost/Backend/api/getProfile.php?employee_id=${employeeId}`, {
                withCredentials: true
            });
            if (res.data.success) {
                const fetchedProfile = {
                    fullName: res.data.data.full_name || '',
                    email: res.data.data.email || '',
                    phone: res.data.data.phone || '',
                    address: res.data.data.address || '',
                    profile_photo: res.data.data.profile_photo || ''
                };
                setProfile(fetchedProfile);
                setInitialProfile(fetchedProfile);
                setProfileErrors(validateProfile(fetchedProfile));
            }
        } catch (err) {
            toast.error('Failed to load profile data.');
        } finally {
            setLoadingProfile(false);
        }
    }, [user]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    useEffect(() => {
        setProfileErrors(validateProfile(profile));
    }, [profile]);

    useEffect(() => {
        setPasswordErrors(validatePasswords(passwords));
    }, [passwords]);

    const handleProfileChange = (e) => {
        const { name, value } = e.target;

        if (name === 'phone') {
            const digitsOnly = value.replace(/\D/g, '').slice(0, 10);
            setProfile({ ...profile, phone: digitsOnly });
            return;
        }

        setProfile({ ...profile, [name]: value });
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswords({ ...passwords, [name]: value });
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();

        if (!isProfileModified) {
            toast.info('No changes detected.');
            return;
        }

        const currentErrors = validateProfile(profile);
        setProfileErrors(currentErrors);

        if (Object.keys(currentErrors).length > 0) {
            toast.error('Please fix the profile validation errors.');
            return;
        }

        setSavingProfile(true);
        const employeeId = user?.id || user?.employeeId;

        try {
            const payload = {
                employee_id: employeeId,
                ...normalizeProfile(profile)
            };

            const res = await axios.post('http://localhost/Backend/api/updateProfile.php', {
                ...payload
            }, {
                withCredentials: true,
                headers: { 'Content-Type': 'application/json' }
            });
            if (res.data.success) {
                toast.success('Profile updated successfully');
                setInitialProfile({ ...normalizeProfile(profile) });
            } else {
                toast.error(res.data.message || 'Failed to update profile');
            }
        } catch (err) {
            toast.error('Network Error. Could not connect to server.');
        } finally {
            setSavingProfile(false);
        }
    };

    const handleSavePassword = async (e) => {
        e.preventDefault();

        if (!isPasswordModified) {
            toast.info('No password changes detected.');
            return;
        }

        const currentErrors = validatePasswords(passwords);
        setPasswordErrors(currentErrors);

        if (Object.keys(currentErrors).length > 0) {
            toast.error('Please fix password validation errors.');
            return;
        }

        setSavingPassword(true);
        const employeeId = user?.id || user?.employeeId;

        try {
            const res = await axios.post('http://localhost/Backend/api/changePassword.php', {
                employee_id: employeeId,
                new_password: passwords.newPassword
            }, {
                withCredentials: true,
                headers: { 'Content-Type': 'application/json' }
            });
            if (res.data.success) {
                toast.success('Password updated successfully');
                setPasswords({ newPassword: '', confirmPassword: '' });
                setPasswordErrors({});
            } else {
                toast.error(res.data.message || 'Failed to update password');
            }
        } catch (err) {
            toast.error('Network Error. Could not connect to server.');
        } finally {
            setSavingPassword(false);
        }
    };

    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    };

    if (loadingProfile) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <i className="fa fa-spinner fa-spin" style={{ fontSize: '32px', color: '#2563EB' }}></i>
            </div>
        );
    }

    return (
        <div style={{ margin: '-20px', padding: '40px', background: '#F3F4F6', minHeight: 'calc(100vh - 60px)' }}>
            
            <style>
                {`
                    .profile-input {
                        width: 100%;
                        padding: 12px 16px;
                        border-radius: 8px;
                        border: 1px solid #E5E7EB;
                        font-size: 15px;
                        outline: none;
                        transition: all 0.2s ease;
                        box-sizing: border-box;
                        background-color: #F9FAFB;
                        color: #111827;
                    }
                    .profile-input:focus {
                        border-color: #2563EB;
                        box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
                        background-color: #FFFFFF;
                    }
                    .profile-input:disabled {
                        background-color: #F3F4F6;
                        cursor: not-allowed;
                        color: #6B7280;
                    }
                    .card-container {
                        background: #FFFFFF;
                        padding: 24px 32px;
                        border-radius: 14px;
                        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
                        box-sizing: border-box;
                        border: 1px solid #F3F4F6;
                    }
                    .btn-save-profile {
                        background: #10B981;
                        color: white;
                        border: none;
                        padding: 12px 24px;
                        border-radius: 8px;
                        font-weight: 600;
                        font-size: 15px;
                        cursor: pointer;
                        transition: all 0.2s ease;
                        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
                    }
                    .btn-save-profile:hover:not(:disabled) {
                        background: #059669;
                        transform: translateY(-2px);
                        box-shadow: 0 6px 16px rgba(16, 185, 129, 0.3);
                    }
                    .btn-save-password {
                        background: #EF4444;
                        color: white;
                        border: none;
                        padding: 12px 24px;
                        border-radius: 8px;
                        font-weight: 600;
                        font-size: 15px;
                        cursor: pointer;
                        transition: all 0.2s ease;
                        box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
                        display: flex;
                        align-items: center;
                        gap: 8px;
                    }
                    .btn-save-password:hover:not(:disabled) {
                        background: #DC2626;
                        transform: translateY(-2px);
                        box-shadow: 0 6px 16px rgba(239, 68, 68, 0.3);
                    }
                    .btn-disabled {
                        opacity: 0.7;
                        cursor: not-allowed !important;
                        transform: none !important;
                        box-shadow: none !important;
                    }
                    .profile-grid {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 30px;
                        margin-top: 30px;
                    }
                    @media (max-width: 900px) {
                        .profile-grid {
                            grid-template-columns: 1fr;
                        }
                    }
                    .profile-photo-wrapper {
                        position: relative;
                        width: 80px;
                        height: 80px;
                        cursor: pointer;
                        display: inline-block;
                        flex-shrink: 0;
                    }
                    .profile-photo-image {
                        width: 100%;
                        height: 100%;
                        border-radius: 50%;
                        object-fit: cover;
                        border: 3px solid #2563EB;
                        box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
                    }
                    .profile-photo-initials {
                        width: 100%;
                        height: 100%;
                        background: linear-gradient(135deg, #2563EB, #1D4ED8);
                        color: white;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justifyContent: center;
                        font-size: 32px;
                        font-weight: bold;
                        box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
                        border: 3px solid #2563EB;
                    }
                    .profile-photo-overlay {
                        position: absolute;
                        inset: 0;
                        background: rgba(0, 0, 0, 0.5);
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justifyContent: center;
                        opacity: 0;
                        transition: opacity 200ms ease;
                        color: white;
                        font-size: 20px;
                    }
                    .profile-photo-wrapper:hover .profile-photo-overlay {
                        opacity: 1;
                    }
                `}
            </style>

            <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                
                {/* Header Section */}
                <div className="card-container" style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '30px', flexWrap: 'wrap' }}>
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        accept="image/jpeg, image/png, image/jpg, image/webp"
                        style={{ display: 'none' }} 
                    />

                    <div className="profile-photo-wrapper" onClick={handlePhotoClick}>
                        {photoPreview || profile.profile_photo ? (
                            <img 
                                src={photoPreview || `/Backend/${profile.profile_photo}`} 
                                alt="Profile" 
                                className="profile-photo-image" 
                            />
                        ) : (
                            <div className="profile-photo-initials">
                                {getInitials(profile.fullName || user?.name)}
                            </div>
                        )}
                        <div className="profile-photo-overlay">
                            <i className="fa fa-camera"></i>
                        </div>
                    </div>

                    {photoFile && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <button 
                                className="btn-save-profile" 
                                style={{ padding: '8px 16px', fontSize: '13px' }}
                                onClick={uploadPhoto}
                                disabled={uploadingPhoto}
                            >
                                {uploadingPhoto ? 'Uploading...' : 'Save Photo'}
                            </button>
                            <button 
                                className="btn-save-password" 
                                style={{ padding: '8px 16px', fontSize: '13px', background: '#94a3b8', boxShadow: 'none' }}
                                onClick={() => { setPhotoFile(null); setPhotoPreview(null); }}
                                disabled={uploadingPhoto}
                            >
                                Cancel
                            </button>
                        </div>
                    )}

                    <div>
                        <h2 style={{ margin: '0 0 4px 0', fontSize: '24px', color: '#111827', fontWeight: 'bold' }}>
                            {profile.fullName || user?.name || 'Employee Name'}
                        </h2>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: '#6B7280', fontSize: '15px' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <i className="fa fa-envelope"></i> {profile.email || user?.email || 'employee@example.com'}
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#EFF6FF', color: '#2563EB', padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '600' }}>
                                <i className="fa fa-briefcase"></i> Employee
                            </span>
                        </div>
                    </div>
                </div>

                <div className="profile-grid">
                    
                    {/* Left Column: Personal Information */}
                    <div className="card-container">
                        <h3 style={{ margin: '0 0 24px 0', color: '#111827', fontSize: '18px', borderBottom: '1px solid #E5E7EB', paddingBottom: '16px' }}>
                            Personal Information
                        </h3>
                        <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', color: '#374151', fontSize: '14px', fontWeight: '600' }}>Full Name</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={profile.fullName}
                                    onChange={handleProfileChange}
                                    className="profile-input"
                                    placeholder="Enter your full name"
                                    disabled={savingProfile}
                                />
                                {profileErrors.fullName && (
                                    <small style={{ color: '#DC2626', display: 'block', marginTop: '6px' }}>{profileErrors.fullName}</small>
                                )}
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', color: '#374151', fontSize: '14px', fontWeight: '600' }}>Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={profile.email}
                                    onChange={handleProfileChange}
                                    className="profile-input"
                                    placeholder="Enter your email"
                                    disabled={savingProfile}
                                />
                                {profileErrors.email && (
                                    <small style={{ color: '#DC2626', display: 'block', marginTop: '6px' }}>{profileErrors.email}</small>
                                )}
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', color: '#374151', fontSize: '14px', fontWeight: '600' }}>Phone Number</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={profile.phone}
                                    onChange={handleProfileChange}
                                    className="profile-input"
                                    placeholder="Enter your phone number"
                                    inputMode="numeric"
                                    maxLength={10}
                                    disabled={savingProfile}
                                />
                                {profileErrors.phone && (
                                    <small style={{ color: '#DC2626', display: 'block', marginTop: '6px' }}>{profileErrors.phone}</small>
                                )}
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', color: '#374151', fontSize: '14px', fontWeight: '600' }}>Address</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={profile.address}
                                    onChange={handleProfileChange}
                                    className="profile-input"
                                    placeholder="Enter your address"
                                    disabled={savingProfile}
                                />
                                {profileErrors.address && (
                                    <small style={{ color: '#DC2626', display: 'block', marginTop: '6px' }}>{profileErrors.address}</small>
                                )}
                            </div>

                            <div style={{ marginTop: '8px' }}>
                                <button
                                    type="submit"
                                    className={`btn-save-profile ${savingProfile || !canSaveProfile ? 'btn-disabled' : ''}`}
                                    disabled={savingProfile || !canSaveProfile}
                                >
                                    {savingProfile ? (
                                        <><i className="fa fa-spinner fa-spin" style={{ marginRight: '8px' }}></i> Saving...</>
                                    ) : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Right Column: Password & Settings */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                        <div className="card-container">
                            <h3 style={{ margin: '0 0 24px 0', color: '#111827', fontSize: '18px', borderBottom: '1px solid #E5E7EB', paddingBottom: '16px' }}>
                                Change Password
                            </h3>
                            <form onSubmit={handleSavePassword} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', color: '#374151', fontSize: '14px', fontWeight: '600' }}>New Password</label>
                                    <input
                                        type="password"
                                        name="newPassword"
                                        value={passwords.newPassword}
                                        onChange={handlePasswordChange}
                                        className="profile-input"
                                        placeholder=""
                                        disabled={savingPassword}
                                    />
                                    {passwordErrors.newPassword && (
                                        <small style={{ color: '#DC2626', display: 'block', marginTop: '6px' }}>{passwordErrors.newPassword}</small>
                                    )}
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', color: '#374151', fontSize: '14px', fontWeight: '600' }}>Confirm Password</label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={passwords.confirmPassword}
                                        onChange={handlePasswordChange}
                                        className="profile-input"
                                        placeholder=""
                                        disabled={savingPassword}
                                    />
                                    {passwordErrors.confirmPassword && (
                                        <small style={{ color: '#DC2626', display: 'block', marginTop: '6px' }}>{passwordErrors.confirmPassword}</small>
                                    )}
                                </div>

                                <div style={{ marginTop: '8px' }}>
                                    <button
                                        type="submit"
                                        className={`btn-save-password ${savingPassword || !canSavePassword ? 'btn-disabled' : ''}`}
                                        disabled={savingPassword || !canSavePassword}
                                    >
                                        {savingPassword ? (
                                            <><i className="fa fa-spinner fa-spin"></i> Updating...</>
                                        ) : (
                                            <><i className="fa fa-lock"></i> Update Password</>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                        
                        {/* Optional Placeholder for additional settings card if needed in the future */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeeProfile;
