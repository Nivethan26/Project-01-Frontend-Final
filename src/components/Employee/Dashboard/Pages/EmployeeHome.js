import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

const EmployeeHome = () => {
    const { user } = useOutletContext();
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

        axios.get(`/Backend/api/getEmployeeDashboardStats.php?userId=${encodeURIComponent(String(employeeId))}`, { withCredentials: true })
            .then(res => {
                if (res.data.success) {
                    setStats(prevStats => ({
                        ...prevStats,
                        ...res.data.data
                    }));
                }
            })
            .catch(() => {})
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
            <div className="emp-card" style={{ marginTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '15px', marginBottom: '15px' }}>
                    <h2 style={{ color: 'var(--text-primary)', margin: 0, fontSize: '20px' }}>Recent Leave Applications</h2>
                </div>
                <div className="emp-table-responsive">
                    {stats.recentActivity && stats.recentActivity.length > 0 ? (
                        <table className="emp-table emp-table-hover">
                            <thead>
                                <tr>
                                    <th>Request ID</th>
                                    <th>Leave Type</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.recentActivity.map((activity, index) => (
                                    <tr key={index}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: '12px', color: '#9ca3af' }}>
                                                    <i className="fa fa-hashtag"></i>
                                                </div>
                                                <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{activity.id || 'N/A'}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <i className="fa fa-bed" style={{ color: '#64748b', marginRight: '10px' }}></i>
                                                {activity.leave_type || activity.type || 'Undefined'}
                                            </div>
                                        </td>
                                        <td>{activity.from_date || activity.date || 'Unknown'}</td>
                                        <td>
                                            <span className={`status-badge status-${activity.status ? activity.status.toLowerCase().replace(' ', '-') : 'pending'}`}>
                                                {activity.status || 'Pending'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748b' }}>
                            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(255,255,255,0.02)', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 15px', fontSize: '24px' }}>
                                <i className="fa fa-inbox"></i>
                            </div>
                            <p style={{ margin: 0, fontSize: '15px' }}>No recent activity found. You're all caught up!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EmployeeHome;
