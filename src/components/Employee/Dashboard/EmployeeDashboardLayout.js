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
        if (hasBootstrapped.current) {
            return;
        }
        hasBootstrapped.current = true;

        const bootstrap = async () => {
            setLoading(true);

            try {
                const res = await fetch('/Backend/api/check-auth/index.php', {
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

                try {
                    const details = await axios.get(
                        `/Backend/api/getUserDetails.php?id=${encodeURIComponent(String(me.id))}`,
                        { withCredentials: true }
                    );

                    if (details?.data?.success) {
                        setUser(details.data.data);
                    } else {
                        setUser({ username: me?.username || 'Employee', name: '' });
                    }
                } catch (_) {
                    setUser({ username: me?.username || 'Employee', name: '' });
                }
            } catch (_) {
                navigate('/login');
            } finally {
                setLoading(false);
            }
        };

        bootstrap();
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
            await fetch('/Backend/logout.php', {
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

    return (
        <div className="employee-dashboard-container">
            <nav className="emp-sidebar">
                <div className="brand" style={{ display: 'flex', alignItems: 'center' }}>
                    <i className="fa fa-car" style={{ marginRight: '10px', fontSize: '22px', color: '#2563eb' }}></i>
                    <div>
                        AutoCare<span style={{ color: '#2563eb' }}>Lanka</span>
                    </div>
                </div>
                
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

                <div style={{ marginTop: 'auto', padding: '0 24px' }}>
                    <button onClick={handleLogout} style={{ width: '100%', padding: '12px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: '500' }}>
                        <i className="fa fa-sign-out"></i> Logout
                    </button>
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
