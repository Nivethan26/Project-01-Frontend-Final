import React, { useEffect, useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';

const getLeaveTypeDetails = (typeStr) => {
    const type = (typeStr || '').toLowerCase();
    if (type.includes('sick')) {
        return {
            label: typeStr || 'Sick Leave',
            icon: 'fa-heartbeat',
            iconColor: '#ef4444',
            bgColor: 'rgba(239, 68, 68, 0.08)'
        };
    }
    if (type.includes('vacation') || type.includes('casual')) {
        return {
            label: typeStr || 'Vacation Leave',
            icon: 'fa-umbrella',
            iconColor: '#f59e0b',
            bgColor: 'rgba(245, 158, 11, 0.08)'
        };
    }
    if (type.includes('medical') || type.includes('hospital')) {
        return {
            label: typeStr || 'Medical Leave',
            icon: 'fa-ambulance',
            iconColor: '#3b82f6',
            bgColor: 'rgba(59, 130, 246, 0.08)'
        };
    }
    return {
        label: typeStr || 'Other Leave',
        icon: 'fa-plane',
        iconColor: '#10b981',
        bgColor: 'rgba(16, 185, 129, 0.08)'
    };
};

const formatDateRange = (startStr, endStr) => {
    if (!startStr) return { range: 'N/A', duration: '' };

    const formatDate = (dateStr) => {
        try {
            const date = new Date(dateStr);
            if (isNaN(date.getTime())) return dateStr;
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        } catch (_) {
            return dateStr;
        }
    };

    const getDaysBetween = (s, e) => {
        if (!s || !e) return null;
        try {
            const start = new Date(s);
            const end = new Date(e);
            if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;
            const diffTime = Math.abs(end - start);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
            return diffDays;
        } catch (_) {
            return null;
        }
    };

    const formattedStart = formatDate(startStr);
    if (!endStr || startStr === endStr) {
        return {
            range: formattedStart,
            duration: '1 day'
        };
    }

    const formattedEnd = formatDate(endStr);
    const days = getDaysBetween(startStr, endStr);

    return {
        range: `${formattedStart} - ${formattedEnd}`,
        duration: days ? `${days} days` : ''
    };
};

const getStatusBadgeStyle = (statusStr) => {
    const status = (statusStr || '').toLowerCase();
    if (status === 'approved' || status === 'completed') {
        return {
            backgroundColor: 'rgba(16, 185, 129, 0.08)',
            color: '#10b981',
            border: '1px solid rgba(16, 185, 129, 0.15)',
            padding: '5px 12px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '600',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
        };
    }
    if (status === 'rejected' || status === 'declined' || status === 'failed') {
        return {
            backgroundColor: 'rgba(239, 68, 68, 0.08)',
            color: '#ef4444',
            border: '1px solid rgba(239, 68, 68, 0.15)',
            padding: '5px 12px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '600',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
        };
    }
    if (status === 'cancelled') {
        return {
            backgroundColor: 'rgba(100, 116, 139, 0.08)',
            color: '#64748b',
            border: '1px solid rgba(100, 116, 139, 0.15)',
            padding: '5px 12px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '600',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
        };
    }
    return {
        backgroundColor: 'rgba(245, 158, 11, 0.08)',
        color: '#f59e0b',
        border: '1px solid rgba(245, 158, 11, 0.15)',
        padding: '5px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '600',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px'
    };
};

const renderStatusBadge = (statusStr) => {
    const status = (statusStr || 'Pending');
    const style = getStatusBadgeStyle(status);
    const normalizedStatus = status.toLowerCase();

    let icon = null;
    if (normalizedStatus === 'approved' || normalizedStatus === 'completed') {
        icon = <i className="fa fa-check-circle" style={{ fontSize: '12px' }}></i>;
    } else if (normalizedStatus === 'rejected' || normalizedStatus === 'declined' || normalizedStatus === 'failed') {
        icon = <i className="fa fa-times-circle" style={{ fontSize: '12px' }}></i>;
    } else if (normalizedStatus === 'cancelled') {
        icon = <i className="fa fa-ban" style={{ fontSize: '12px' }}></i>;
    } else {
        icon = <span style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: '#f59e0b',
            display: 'inline-block',
            boxShadow: '0 0 6px rgba(245, 158, 11, 0.6)',
            animation: 'pulse-dot 1.8s infinite ease-in-out'
        }}></span>;
    }

    return (
        <span style={style}>
            {icon}
            {status}
        </span>
    );
};

const EmployeeHome = () => {
    const { user } = useOutletContext();
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalBookings: 0,
        todayBookings: 0,
        pendingLeave: 0,
        approvedLeave: 0,
        recentActivity: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user || (!user.id && !user.employeeId)) return;
        const employeeId = user.id || user.employeeId;

        axios.get(`http://localhost/Backend/api/getEmployeeDashboardStats.php?userId=${encodeURIComponent(String(employeeId))}`, { withCredentials: true })
            .then(res => {
                if (res.data.success) {
                    setStats(prevStats => ({
                        ...prevStats,
                        ...res.data.data
                    }));
                }
            })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, [user]);

    if (loading) {
        return <div className="emp-card"><h2>Loading Dashboard Data...</h2></div>;
    }

    const hasLeaveData = (stats.pendingLeave > 0 || stats.approvedLeave > 0);
    const leaveStatusData = hasLeaveData ? [
        { name: 'Pending Leaves', value: parseInt(stats.pendingLeave) || 0, color: '#f59e0b' },
        { name: 'Approved Leaves', value: parseInt(stats.approvedLeave) || 0, color: '#10b981' }
    ] : [
        { name: 'No Leave Applications', value: 1, color: '#e5e7eb' }
    ];

    const bookingTrendData = stats.weeklyTrend && stats.weeklyTrend.length > 0
        ? stats.weeklyTrend
        : [
            { name: 'Mon', bookings: 0 },
            { name: 'Tue', bookings: 0 },
            { name: 'Wed', bookings: 0 },
            { name: 'Thu', bookings: 0 },
            { name: 'Fri', bookings: 0 },
            { name: 'Sat', bookings: 0 },
            { name: 'Sun', bookings: 0 }
        ];

    return (
        <div className="emp-dashboard-home">
            <div className="emp-card emp-card-gradient" style={{ marginBottom: '24px', display: 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h2 style={{ color: 'var(--text-primary)', margin: '0 0 10px 0', fontSize: '28px' }}>Dashboard Overview</h2>
                        <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '15px' }}>This is your daily summary based on real-time activity.</p>
                    </div>
                    <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '10px 20px', borderRadius: '30px', fontWeight: '600' }}>
                        <i className="fa fa-circle" style={{ fontSize: '10px', marginRight: '8px' }}></i> Live Updates
                    </div>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="emp-stats-grid">
                <div className="emp-stat-card" style={{ '--accent-primary': '#3b82f6' }}>
                    <div className="stat-icon" style={{ color: '#3b82f6', backgroundColor: 'rgba(59, 130, 246, 0.1)' }}><i className="fa fa-calendar-check-o"></i></div>
                    <div className="stat-info">
                        <h3>Total Bookings</h3>
                        <p>{stats.totalBookings}</p>
                    </div>
                </div>
                <div className="emp-stat-card" style={{ '--accent-primary': '#f59e0b' }}>
                    <div className="stat-icon" style={{ color: '#f59e0b', backgroundColor: 'rgba(245, 158, 11, 0.1)' }}><i className="fa fa-calendar-plus-o"></i></div>
                    <div className="stat-info">
                        <h3>Today's Bookings</h3>
                        <p>{stats.todayBookings}</p>
                    </div>
                </div>
                <div className="emp-stat-card" style={{ '--accent-primary': '#10b981' }}>
                    <div className="stat-icon" style={{ color: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.1)' }}><i className="fa fa-check-circle"></i></div>
                    <div className="stat-info">
                        <h3>Approved Leaves</h3>
                        <p>{stats.approvedLeave}</p>
                    </div>
                </div>
                <div className="emp-stat-card" style={{ '--accent-primary': '#8b5cf6' }}>
                    <div className="stat-icon" style={{ color: '#8b5cf6', backgroundColor: 'rgba(139, 92, 246, 0.1)' }}><i className="fa fa-clock-o"></i></div>
                    <div className="stat-info">
                        <h3>Pending Leaves</h3>
                        <p>{stats.pendingLeave}</p>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginTop: '24px' }}>
                {/* Booking Trend Chart */}
                <div className="emp-card">
                    <h2 style={{ fontSize: '18px', marginBottom: '20px', color: 'var(--text-title)' }}>Weekly Booking Trend</h2>
                    <div style={{ height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={bookingTrendData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    cursor={{ stroke: 'rgba(37, 99, 235, 0.2)', strokeWidth: 2 }}
                                />
                                <Line type="monotone" dataKey="bookings" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6, fill: '#3b82f6' }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Leave Status Chart */}
                <div className="emp-card">
                    <h2 style={{ fontSize: '18px', marginBottom: '8px', color: 'var(--text-title)' }}>Leave Status Overview</h2>
                    <div style={{ height: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <ResponsiveContainer width="100%" height="80%">
                            <PieChart>
                                <Pie
                                    data={leaveStatusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={90}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {leaveStatusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div style={{ display: 'flex', gap: '16px', marginTop: '10px' }}>
                            {hasLeaveData ? leaveStatusData.map((entry, index) => (
                                <div key={index} style={{ display: 'flex', alignItems: 'center', fontSize: '13px', color: '#4b5563' }}>
                                    <div style={{ width: '10px', height: '10px', backgroundColor: entry.color, borderRadius: '50%', marginRight: '6px' }}></div>
                                    {entry.name}
                                </div>
                            )) : (
                                <div style={{ fontSize: '13px', color: '#9ca3af' }}>No leave applications to display</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity Table */}
            <div className="emp-card" style={{
                marginTop: '24px',
                borderRadius: '16px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.04)',
                border: '1px solid rgba(0, 0, 0, 0.05)',
                padding: '24px',
                background: '#ffffff'
            }}>
                <style>{`
                    @keyframes pulse-dot {
                        0% { transform: scale(0.9); opacity: 0.6; }
                        50% { transform: scale(1.2); opacity: 1; }
                        100% { transform: scale(0.9); opacity: 0.6; }
                    }
                    .emp-premium-row {
                        transition: all 0.25s ease;
                    }
                    .emp-premium-row:hover {
                        background-color: #f8fafc !important;
                    }
                `}</style>

                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
                    paddingBottom: '18px',
                    marginBottom: '18px'
                }}>
                    <div>
                        <h2 style={{ color: '#1e293b', margin: 0, fontSize: '18px', fontWeight: '700', letterSpacing: '-0.3px' }}>
                            Recent Leave Applications
                        </h2>
                        <p style={{ color: '#64748b', margin: '4px 0 0 0', fontSize: '13px' }}>
                            Monitor and track the status of your submitted leave requests.
                        </p>
                    </div>

                    <button
                        onClick={() => navigate('/employee/leave')}
                        style={{
                            background: 'transparent',
                            border: '1px solid rgba(37, 99, 235, 0.15)',
                            color: '#2563eb',
                            padding: '8px 16px',
                            borderRadius: '8px',
                            fontSize: '13px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(37, 99, 235, 0.04)';
                            e.currentTarget.style.borderColor = '#2563eb';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.borderColor = 'rgba(37, 99, 235, 0.15)';
                        }}
                    >
                        <i className="fa fa-history"></i> Leave History
                    </button>
                </div>

                <div className="emp-table-responsive" style={{ borderRadius: '12px', border: '1px solid rgba(0, 0, 0, 0.05)', overflow: 'hidden' }}>
                    {stats.recentActivity && stats.recentActivity.length > 0 ? (
                        <table className="emp-table" style={{ margin: 0, borderCollapse: 'collapse', width: '100%' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#f8fafc' }}>
                                    <th style={{ padding: '16px', color: '#475569', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid rgba(0, 0, 0, 0.05)' }}>Request ID</th>
                                    <th style={{ padding: '16px', color: '#475569', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid rgba(0, 0, 0, 0.05)' }}>Leave Type</th>
                                    <th style={{ padding: '16px', color: '#475569', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid rgba(0, 0, 0, 0.05)' }}>Leave Period</th>
                                    <th style={{ padding: '16px', color: '#475569', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid rgba(0, 0, 0, 0.05)' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.recentActivity.map((activity, index) => {
                                    const leaveTypeInfo = getLeaveTypeDetails(activity.leave_type);
                                    const dateInfo = formatDateRange(activity.start_date, activity.end_date);
                                    const isLast = index === stats.recentActivity.length - 1;

                                    return (
                                        <tr
                                            key={index}
                                            className="emp-premium-row"
                                            style={{
                                                borderBottom: isLast ? 'none' : '1px solid rgba(0, 0, 0, 0.04)',
                                                backgroundColor: '#ffffff'
                                            }}
                                        >
                                            <td style={{ padding: '16px 20px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <span style={{ color: '#94a3b8', fontWeight: '500', fontSize: '13px' }}>#</span>
                                                    <span style={{ fontWeight: '700', color: '#1e293b', fontSize: '14px' }}>{activity.id || 'N/A'}</span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '16px 20px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <div style={{
                                                        width: '36px',
                                                        height: '36px',
                                                        borderRadius: '10px',
                                                        backgroundColor: leaveTypeInfo.bgColor,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        color: leaveTypeInfo.iconColor,
                                                        fontSize: '15px',
                                                        boxShadow: 'inset 0 0 4px rgba(0,0,0,0.02)'
                                                    }}>
                                                        <i className={`fa ${leaveTypeInfo.icon}`}></i>
                                                    </div>
                                                    <span style={{ fontWeight: '600', color: '#334155', fontSize: '14px' }}>{leaveTypeInfo.label}</span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '16px 20px' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                    <span style={{ fontWeight: '600', color: '#1e293b', fontSize: '14px' }}>{dateInfo.range}</span>
                                                    {dateInfo.duration && (
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#64748b', fontSize: '11px', fontWeight: '500' }}>
                                                            <i className="fa fa-calendar-o" style={{ fontSize: '10px' }}></i>
                                                            <span>{dateInfo.duration}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td style={{ padding: '16px 20px' }}>
                                                {renderStatusBadge(activity.status)}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '48px 0', backgroundColor: '#ffffff' }}>
                            <div style={{
                                width: '56px',
                                height: '56px',
                                borderRadius: '12px',
                                background: '#f1f5f9',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                margin: '0 auto 16px',
                                fontSize: '20px',
                                color: '#94a3b8'
                            }}>
                                <i className="fa fa-folder-open-o"></i>
                            </div>
                            <h3 style={{ margin: '0 0 6px 0', fontSize: '15px', fontWeight: '600', color: '#334155' }}>No leave applications</h3>
                            <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>Your recent requests will be listed here.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EmployeeHome;
