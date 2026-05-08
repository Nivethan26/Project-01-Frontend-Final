import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import axios from 'axios';

const EmployeeMyJobs = () => {
    const { user } = useOutletContext();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [summary, setSummary] = useState({ total: 0, completed: 0, pending: 0, in_progress: 0, approved: 0 });
    const [statusModal, setStatusModal] = useState({ isOpen: false, booking: null, newStatus: '' });
    const [toastMsg, setToastMsg] = useState(null);

    const fetchBookings = () => {
        if (!user?.id) return;
        setLoading(true);
        const params = new URLSearchParams({
            userId: user.id,
            page: page,
            status: statusFilter,
            search: search,
        });
        axios.get(`http://localhost/Backend/api/getEmployeeMyJobs.php?${params}`, { withCredentials: true })
            .then(res => {
                if (res.data.success) {
                    setBookings(res.data.data.bookings || []);
                    setTotalPages(res.data.data.totalPages || 1);
                    setSummary(res.data.data.summary || { total: 0, completed: 0, pending: 0, in_progress: 0, approved: 0 });
                }
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchBookings(); }, [user, page, statusFilter]);

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        fetchBookings();
    };

    const confirmStatusUpdate = async () => {
        const { booking, newStatus } = statusModal;
        if (!booking) return;

        // DB status string to send
        const statusToSend = newStatus === 'in_progress' ? 'in_progress' : 'completed';

        try {
            const res = await axios.post('http://localhost/Backend/api/updateBookingStatus.php', {
                id: booking.id,
                status: statusToSend,
                role: user?.role || 'employee'
            }, { withCredentials: true });

            if (!res.data.success) {
                setToastMsg(`❌ Failed to update. Please try again.`);
                setTimeout(() => setToastMsg(null), 3000);
                return;
            }

            const updatedBookings = bookings.map(b => 
                b.id === booking.id ? { ...b, status: statusToSend } : b
            );
            setBookings(updatedBookings);
            updateSummary(updatedBookings);

            const fallbackRef = `#BK${(booking.date || '0000-00-00').split('-').reverse().join('')}${booking.id}`;
            const ref = booking.booking_reference || fallbackRef;
            if (statusToSend === 'in_progress') {
                setToastMsg(`✅ Job started — ${ref} is now In Progress`);
            } else {
                setToastMsg(`✅ ${ref} marked as Completed`);
            }
            setTimeout(() => setToastMsg(null), 3000);
        } catch (err) {
            setToastMsg('❌ Failed to update. Please try again.');
            setTimeout(() => setToastMsg(null), 3000);
        } finally {
            setStatusModal({ isOpen: false, booking: null, newStatus: '' });
        }
    };

    const updateSummary = (bks) => {
        const newSummary = bks.reduce((acc, curr) => {
            acc.total++;
            const s = (curr.status || '').toLowerCase();
            if (s === 'completed') acc.completed++;
            if (s === 'in_progress') acc.in_progress++;
            if (s === 'pending') acc.pending++;
            if (s === 'approved') acc.approved++;
            return acc;
        }, { total: 0, completed: 0, in_progress: 0, pending: 0, approved: 0 });
        setSummary(newSummary);
    };

    const STATUS_CONFIG = {
        pending: { label: "Pending Approval", bg: "#f3f4f6", text: "#4b5563", dot: "#9ca3af" },
        approved: { label: "Approved", bg: "#fef3c7", text: "#b45309", dot: "#f59e0b" },
        in_progress: { label: "In Progress", bg: "#dbeafe", text: "#1d4ed8", dot: "#3b82f6" },
        completed: { label: "Completed", bg: "#d1fae5", text: "#047857", dot: "#22c55e" },
        rejected: { label: "Rejected", bg: "#fee2e2", text: "#b91c1c", dot: "#ef4444" },
        cancelled: { label: "Cancelled", bg: "#f1f5f9", text: "#64748b", dot: "#94a3b8" }
    };

    const getStatusBadge = (status) => {
        const s = (status || '').toLowerCase();
        const style = STATUS_CONFIG[s] || STATUS_CONFIG.pending;
        return (
            <span style={{
                backgroundColor: style.bg, color: style.text,
                padding: '6px 14px', borderRadius: '20px', fontSize: '12px',
                fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap'
            }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: style.dot }}></span>
                {style.label}
            </span>
        );
    };

    const renderActionButtons = (booking) => {
        const status = (booking.status || '').toLowerCase();
        
        switch(status) {
            case "pending":
                return (
                    <span style={{ fontSize: '12px', color: '#9ca3af', fontStyle: 'italic', padding: '6px 14px' }}>Awaiting admin approval</span>
                );

            case "approved":
                return (
                    <button onClick={() => setStatusModal({ isOpen: true, booking, newStatus: 'in_progress' })}
                            style={{ padding: '6px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, background: '#2563eb', color: '#fff', border: 'none', cursor: 'pointer', transition: 'background 0.2s', whiteSpace: 'nowrap' }}
                            onMouseEnter={e => e.currentTarget.style.background = '#1d4ed8'}
                            onMouseLeave={e => e.currentTarget.style.background = '#2563eb'}
                    >
                        Start Job →
                    </button>
                );

            case "in_progress":
                return (
                    <button onClick={() => setStatusModal({ isOpen: true, booking, newStatus: 'completed' })}
                            style={{ padding: '6px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, background: '#059669', color: '#fff', border: 'none', cursor: 'pointer', transition: 'background 0.2s', whiteSpace: 'nowrap' }}
                            onMouseEnter={e => e.currentTarget.style.background = '#047857'}
                            onMouseLeave={e => e.currentTarget.style.background = '#059669'}
                    >
                        Mark Complete ✓
                    </button>
                );

            case "completed":
            case "rejected":
            case "cancelled":
                return (
                    <span style={{ fontSize: '12px', color: '#9ca3af', fontStyle: 'italic', padding: '6px 14px' }}>—</span>
                );
                
            default:
                return null;
        }
    };

    const formatDate = (dateStr, timeslot) => {
        if (!dateStr) return 'N/A';
        try {
            const d = new Date(dateStr);
            const formatted = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
            return timeslot ? `${formatted}, ${timeslot}` : formatted;
        } catch (_) { return dateStr; }
    };

    const styles = {
        summaryGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' },
        summaryCard: {
            background: '#fff', borderRadius: '12px', padding: '20px 24px',
            border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            display: 'flex', alignItems: 'center', gap: '16px',
            transition: 'all 0.3s ease'
        },
        summaryIcon: (color, bg) => ({
            width: '48px', height: '48px', borderRadius: '10px',
            backgroundColor: bg, color: color,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '20px', flexShrink: 0
        }),
        summaryLabel: { fontSize: '13px', color: '#6b7280', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.3px' },
        summaryValue: { fontSize: '28px', fontWeight: 800, color: '#111827', margin: '2px 0 0', lineHeight: 1, letterSpacing: '-0.5px' },
        filterBar: {
            display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap'
        },
        input: {
            padding: '10px 14px', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '8px',
            fontSize: '14px', fontFamily: 'inherit', outline: 'none', width: '260px',
            transition: 'border-color 0.2s'
        },
        select: {
            padding: '10px 14px', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '8px',
            fontSize: '14px', fontFamily: 'inherit', outline: 'none', background: '#fff',
            cursor: 'pointer', minWidth: '160px'
        },
        searchBtn: {
            padding: '10px 20px', backgroundColor: '#2563eb', color: '#fff',
            border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600,
            cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s'
        },
        table: { width: '100%', borderCollapse: 'collapse' },
        th: {
            textAlign: 'left', padding: '14px 16px', background: '#f8fafc',
            color: '#6b7280', fontWeight: 600, fontSize: '12px',
            textTransform: 'uppercase', letterSpacing: '0.5px',
            borderBottom: '1px solid rgba(0,0,0,0.06)'
        },
        td: { padding: '14px 16px', borderBottom: '1px solid rgba(0,0,0,0.04)', fontSize: '14px', color: '#111827' },
        emptyState: { textAlign: 'center', padding: '60px 20px' },
        paginationBar: {
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginTop: '20px', padding: '12px 0'
        },
        pageBtn: (active) => ({
            padding: '8px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 600,
            border: active ? 'none' : '1px solid rgba(0,0,0,0.08)',
            background: active ? '#2563eb' : '#fff',
            color: active ? '#fff' : '#374151',
            cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s'
        }),
        viewBtn: {
            padding: '6px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: 600,
            border: '1px solid rgba(37,99,235,0.2)', background: 'transparent',
            color: '#2563eb', cursor: 'pointer', fontFamily: 'inherit',
            transition: 'all 0.2s'
        },
        skeleton: {
            background: 'linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)',
            backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite',
            borderRadius: '6px', height: '16px'
        }
    };

    return (
        <div>
            <style>{`
                @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
            `}</style>

            <div style={{ marginBottom: '24px' }}>
                <h2 style={{ margin: '0 0 6px', fontSize: '24px', fontWeight: 800, color: '#111827', letterSpacing: '-0.5px' }}>
                    My Jobs
                </h2>
                <p style={{ margin: 0, fontSize: '15px', color: '#6b7280' }}>
                    Manage your assigned service jobs
                </p>
            </div>

            {/* Summary Cards */}
            <div style={styles.summaryGrid}>
                <div style={styles.summaryCard}>
                    <div style={styles.summaryIcon('#64748b', 'rgba(100,116,139,0.08)')}>
                        <i className="fa fa-list-alt" />
                    </div>
                    <div>
                        <div style={styles.summaryLabel}>Total Jobs</div>
                        <div style={styles.summaryValue}>{summary.total}</div>
                    </div>
                </div>
                <div style={styles.summaryCard}>
                    <div style={styles.summaryIcon('#d97706', 'rgba(245,158,11,0.08)')}>
                        <i className="fa fa-check-square-o" />
                    </div>
                    <div>
                        <div style={styles.summaryLabel}>Approved (Ready)</div>
                        <div style={styles.summaryValue}>{summary.approved}</div>
                    </div>
                </div>
                <div style={styles.summaryCard}>
                    <div style={styles.summaryIcon('#2563eb', 'rgba(37,99,235,0.08)')}>
                        <i className="fa fa-cogs" />
                    </div>
                    <div>
                        <div style={styles.summaryLabel}>In Progress</div>
                        <div style={styles.summaryValue}>{summary.in_progress}</div>
                    </div>
                </div>
                <div style={styles.summaryCard}>
                    <div style={styles.summaryIcon('#059669', 'rgba(16,185,129,0.08)')}>
                        <i className="fa fa-check-circle" />
                    </div>
                    <div>
                        <div style={styles.summaryLabel}>Completed</div>
                        <div style={styles.summaryValue}>{summary.completed}</div>
                    </div>
                </div>
            </div>

            {/* Filter Bar */}
            <form onSubmit={handleSearch} style={styles.filterBar}>
                <input
                    type="text"
                    placeholder="Search by Booking ID or Customer..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={styles.input}
                    onFocus={e => e.target.style.borderColor = '#2563eb'}
                    onBlur={e => e.target.style.borderColor = 'rgba(0,0,0,0.08)'}
                />
                <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }} style={styles.select}>
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                </select>
                <button type="submit" style={styles.searchBtn}>
                    <i className="fa fa-search" style={{ marginRight: '6px' }} /> Search
                </button>
            </form>

            {/* Table */}
            <div style={{ borderRadius: '12px', border: '1px solid rgba(0,0,0,0.06)', overflow: 'hidden', background: '#fff' }}>
                {loading ? (
                    <div style={{ padding: '20px' }}>
                        {[...Array(5)].map((_, i) => (
                            <div key={i} style={{ display: 'flex', gap: '16px', padding: '14px 0', borderBottom: '1px solid #f1f5f9' }}>
                                {[...Array(8)].map((_, j) => (
                                    <div key={j} style={{ ...styles.skeleton, width: j === 0 ? '80px' : '120px' }} />
                                ))}
                            </div>
                        ))}
                    </div>
                ) : bookings.length > 0 ? (
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>Booking ID</th>
                                <th style={styles.th}>Customer</th>
                                <th style={styles.th}>Station</th>
                                <th style={styles.th}>Service</th>
                                <th style={styles.th}>Date & Time</th>
                                <th style={styles.th}>Duration</th>
                                <th style={styles.th}>Price</th>
                                <th style={styles.th}>Status</th>
                                <th style={styles.th}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((b, i) => (
                                <tr key={b.id} style={{
                                    backgroundColor: i % 2 === 0 ? '#ffffff' : '#fafbfc',
                                    transition: 'background-color 0.2s'
                                }}
                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f0f4ff'}
                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = i % 2 === 0 ? '#ffffff' : '#fafbfc'}
                                >
                                    <td style={styles.td}>
                                        <span style={{ fontWeight: 700, color: '#2563eb' }}>
                                            {b.booking_reference || `#BK${(b.date || '0000-00-00').split('-').reverse().join('')}${b.id}`}
                                        </span>
                                    </td>
                                    <td style={styles.td}>
                                        <span style={{ fontWeight: 600, color: '#334155' }}>{b.customer_name || 'Customer'}</span>
                                    </td>
                                    <td style={styles.td}>
                                        <span style={{ fontWeight: 600, color: '#334155' }}>{b.station_name || `Station ${b.station_id || '-'}`}</span>
                                    </td>
                                    <td style={styles.td}>{b.service_name || 'Wash Service'}</td>
                                    <td style={styles.td}>
                                        <span style={{ fontWeight: 500 }}>{formatDate(b.date, b.timeslot)}</span>
                                    </td>
                                    <td style={styles.td}>{b.duration || '30 mins'}</td>
                                    <td style={styles.td}>
                                        <span style={{ fontWeight: 600 }}>Rs. {parseInt(b.price || 800).toLocaleString()}</span>
                                    </td>
                                    <td style={styles.td}>{getStatusBadge(b.status)}</td>
                                    <td style={styles.td}>
                                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                            {renderActionButtons(b)}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div style={styles.emptyState}>
                        <div style={{
                            width: '64px', height: '64px', borderRadius: '16px', background: '#f1f5f9',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 16px', fontSize: '24px', color: '#94a3b8'
                        }}>
                            <i className="fa fa-wrench" />
                        </div>
                        <h3 style={{ margin: '0 0 6px', fontSize: '16px', fontWeight: 600, color: '#334155' }}>No jobs assigned</h3>
                        <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>
                            {search || statusFilter !== 'all' ? 'Try adjusting your filters.' : 'Assigned service jobs will appear here.'}
                        </p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div style={styles.paginationBar}>
                    <span style={{ fontSize: '13px', color: '#6b7280' }}>
                        Page {page} of {totalPages}
                    </span>
                    <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                            disabled={page <= 1}
                            onClick={() => setPage(p => p - 1)}
                            style={{ ...styles.pageBtn(false), opacity: page <= 1 ? 0.4 : 1 }}
                        >
                            ← Previous
                        </button>
                        {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                            const p = i + 1;
                            return (
                                <button key={p} onClick={() => setPage(p)} style={styles.pageBtn(p === page)}>
                                    {p}
                                </button>
                            );
                        })}
                        <button
                            disabled={page >= totalPages}
                            onClick={() => setPage(p => p + 1)}
                            style={{ ...styles.pageBtn(false), opacity: page >= totalPages ? 0.4 : 1 }}
                        >
                            Next →
                        </button>
                    </div>
                </div>
            )}

            {/* Confirmation Modal */}
            {statusModal.isOpen && statusModal.booking && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)',
                    zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    animation: 'fadeIn 0.2s ease-out'
                }}>
                    <div style={{
                        background: 'white', padding: '32px', borderRadius: '16px',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', width: '90%', maxWidth: '440px',
                        animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}>
                        <h2 style={{ margin: '0 0 16px', fontSize: '1.4rem', color: '#1e293b', fontWeight: '700' }}>Confirm Status Update</h2>
                        <div style={{ margin: '0 0 24px', color: '#475569', fontSize: '0.95rem', lineHeight: 1.6 }}>
                            <p style={{ margin: '0 0 4px' }}>Booking: <strong>{statusModal.booking.booking_reference || `#BK${(statusModal.booking.date || '0000-00-00').split('-').reverse().join('')}${statusModal.booking.id}`}</strong></p>
                            <p style={{ margin: 0 }}>Service: <strong>{statusModal.booking.service_name || 'Service'}</strong></p>
                        </div>
                        
                        <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '32px', border: '1px solid #e2e8f0' }}>
                            <div>{getStatusBadge(statusModal.booking.status)}</div>
                            <i className="fa fa-arrow-right" style={{ color: '#94a3b8' }} />
                            <div>{getStatusBadge(statusModal.newStatus)}</div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                            <button onClick={() => setStatusModal({ isOpen: false, booking: null, newStatus: '' })}
                                    style={{ padding: '10px 20px', borderRadius: '8px', fontSize: '0.95rem', fontWeight: 600, background: 'transparent', color: '#64748b', border: '2px solid #cbd5e1', cursor: 'pointer', transition: 'all 0.2s' }}
                                    onMouseEnter={e => e.currentTarget.style.borderColor = '#94a3b8'}
                                    onMouseLeave={e => e.currentTarget.style.borderColor = '#cbd5e1'}
                            >
                                Cancel
                            </button>
                            <button onClick={confirmStatusUpdate}
                                    style={{ padding: '10px 24px', borderRadius: '8px', fontSize: '0.95rem', fontWeight: 600, background: '#2563eb', color: 'white', border: 'none', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 6px -1px rgba(37,99,235,0.2)' }}
                                    onMouseEnter={e => e.currentTarget.style.background = '#1d4ed8'}
                                    onMouseLeave={e => e.currentTarget.style.background = '#2563eb'}
                            >
                                Confirm Update
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast Notification */}
            {toastMsg && (
                <div style={{
                    position: 'fixed', bottom: '24px', right: '24px',
                    background: toastMsg.startsWith('❌') ? '#ef4444' : '#10b981', color: 'white', padding: '14px 24px',
                    borderRadius: '8px', fontWeight: 600, fontSize: '0.95rem',
                    boxShadow: toastMsg.startsWith('❌') ? '0 10px 15px -3px rgba(239, 68, 68, 0.3)' : '0 10px 15px -3px rgba(16, 185, 129, 0.3)',
                    zIndex: 1100, display: 'flex', alignItems: 'center', gap: '10px',
                    animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                }}>
                    <i className={toastMsg.startsWith('❌') ? "fa fa-times-circle" : "fa fa-check-circle"} style={{ fontSize: '1.2rem' }} />
                    {toastMsg}
                </div>
            )}
        </div>
    );
};

export default EmployeeMyJobs;
