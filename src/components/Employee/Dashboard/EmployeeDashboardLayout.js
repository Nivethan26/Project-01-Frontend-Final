import React, { useEffect, useRef, useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Swal from '../../../utils/modernAlert';
import './EmployeeDarkTheme.css';

const EmployeeDashboardLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState({ username: 'Employee', name: '' });
    const [loading, setLoading] = useState(true);
    const hasBootstrapped = useRef(false);

    useEffect(() => {
        const fetchDetails = async (userId, username) => {
            try {
                const details = await axios.get(
                    `http://localhost/Backend/api/getUserDetails.php?id=${encodeURIComponent(String(userId))}`,
                    { withCredentials: true }
                );

                if (details?.data?.success) {
                    setUser(details.data.data);
                } else {
                    setUser({ username: username || 'Employee', name: '' });
                }
            } catch (_) {
                setUser({ username: username || 'Employee', name: '' });
            }
        };

        const bootstrap = async () => {
            if (hasBootstrapped.current) {
                return;
            }
            hasBootstrapped.current = true;
            setLoading(true);

            try {
                const res = await fetch('http://localhost/Backend/api/check-auth/index.php', {
                    method: 'GET',
                    credentials: 'include',
                    headers: { Accept: 'application/json' },
                });

                if (!res.ok) {
                    navigate('/login');
                    return;
                }

                const data = await res.json();
                const me = data?.user;
                const role = typeof me?.role === 'string' ? me.role.toLowerCase() : '';

                if (role !== 'employee' || !me?.id) {
                    navigate('/login');
                    return;
                }

                window.currentEmployeeId = me.id;
                window.currentEmployeeUsername = me.username;

                await fetchDetails(me.id, me.username);
            } catch (_) {
                navigate('/login');
            } finally {
                setLoading(false);
            }
        };

        bootstrap();

        const handlePhotoUpdate = () => {
            if (window.currentEmployeeId) {
                fetchDetails(window.currentEmployeeId, window.currentEmployeeUsername);
            }
        };

        window.addEventListener('profilePhotoUpdated', handlePhotoUpdate);
        return () => {
            window.removeEventListener('profilePhotoUpdated', handlePhotoUpdate);
        };
    }, [navigate]);

    const handleLogout = async () => {
        const { isConfirmed } = await Swal.fire({
            title: 'Logout',
            text: 'Do you really want to logout?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, logout',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            reverseButtons: true,
        });

        if (!isConfirmed) {
            return;
        }

        try {
            await fetch('http://localhost/Backend/logout.php', {
                method: 'POST',
                credentials: 'include',
            });
        } catch (_) {
            // Even if server logout fails, clear local session to avoid stale auth state.
        }

        sessionStorage.removeItem('user-id');
        sessionStorage.removeItem('user-role');
        localStorage.removeItem('userId');
        navigate('/login');
    };

    if (loading) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#121212', color: '#ff3333' }}>Loading Dashboard...</div>;
    }

    const isActive = (path) => location.pathname === path ? 'active' : '';

    const avatarUrl = user.profile_photo
        ? `http://localhost/Backend/${user.profile_photo}`
        : 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';

    return (
        <div className="employee-dashboard-container">
            <nav className="emp-sidebar">
                <div className="emp-sidebar-wrapper">
                    {/* Brand / Logo */}
                    <div className="brand">
                        <h2>AutoCare Lanka</h2>
                    </div>

                    {/* Navigation Links */}
                    <div className="emp-sidebar-menu">
                        <div className="emp-sidebar-list">
                            <NavLink to="/employee/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
                                <i className="fa fa-home"></i> Dashboard
                            </NavLink>
                            <NavLink to="/employee/bookings" className={({ isActive }) => isActive ? 'active' : ''}>
                                <i className="fa fa-calendar"></i> Bookings
                            </NavLink>
                            <NavLink to="/employee/jobs" className={({ isActive }) => isActive ? 'active' : ''}>
                                <i className="fa fa-wrench"></i> My Jobs
                            </NavLink>
                            <NavLink to="/employee/leave" className={({ isActive }) => isActive ? 'active' : ''}>
                                <i className="fa fa-bed"></i> Leave
                            </NavLink>
                            <NavLink to="/employee/messages" className={({ isActive }) => isActive ? 'active' : ''}>
                                <i className="fa fa-envelope"></i> Messages
                            </NavLink>
                            <NavLink to="/employee/profile" className={({ isActive }) => isActive ? 'active' : ''}>
                                <i className="fa fa-user"></i> Profile
                            </NavLink>
                        </div>
                    </div>

                    {/* Bottom Profile and Logout */}
                    <div className="emp-sidebar-bottom">
                        <div className="emp-user-profile">
                            <img
                                src={avatarUrl}
                                alt="Avatar"
                                className="emp-bottom-avatar"
                            />
                            <div className="emp-user-details">
                                <span className="emp-user-name">{user.username || user.name || "Employee"}</span>
                            </div>
                        </div>

                        <button className="emp-logout-btn" onClick={handleLogout}>
                            <i className="fa fa-sign-out emp-logout-icon"></i> Logout
                        </button>
                    </div>
                </div>
            </nav>

            <div className="emp-main-content">
                <header className="emp-hero-section">
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <h2>Welcome back, {user.username || user.name || 'Employee'} 👋</h2>
                        <p>Here's what's happening at your service station today.</p>
                    </div>
                </header>

                <main style={{ flexGrow: 1 }}>
                    <Outlet context={{ user }} />
                </main>
            </div>
        </div>
    );
};

export default EmployeeDashboardLayout;
