import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StepLeaveType = ({ formData, setFormData }) => {
    const [allLeaveTypes, setAllLeaveTypes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('http://localhost/Backend/api/leaveTypes.php', { withCredentials: true })
            .then(res => {
                if (Array.isArray(res.data)) {
                    setAllLeaveTypes(res.data.map(item => item.leave_type || item.name || item.type_name || Object.values(item)[1]));
                }
            })
            .catch(err => console.error("Error fetching leave types:", err))
            .finally(() => setLoading(false));
    }, []);

    // Configuration for primary leaves
    const primaryTypesConfig = {
        'Annual Leave': { icon: 'fa-calendar', desc: 'Paid time off for vacation, rest or personal time' },
        'Sick Leave': { icon: 'fa-medkit', desc: 'For medical emergencies and health recovery' },
        'Casual Leave': { icon: 'fa-coffee', desc: 'Unexpected personal matters or urgent needs' }
    };

    // Filter available types into Primary and Other
    const popularTypes = allLeaveTypes.filter(type => Object.keys(primaryTypesConfig).includes(type));
    const otherTypes = allLeaveTypes.filter(type => !Object.keys(primaryTypesConfig).includes(type));

    // Fallback if APIs fail or return empty
    const displayPopular = popularTypes.length > 0 ? popularTypes : Object.keys(primaryTypesConfig);

    const getCardClass = (type) => {
        if (type.includes('Annual')) return 'annual-card';
        if (type.includes('Sick')) return 'sick-card';
        if (type.includes('Casual')) return 'casual-card';
        return '';
    };

    const renderCard = (type, isPrimary = false) => {
        const isSelected = formData.leave_type === type;
        const config = primaryTypesConfig[type] || { icon: 'fa-tag', desc: 'Standard leave application protocol' };
        
        return (
            <div
                key={type}
                onClick={() => setFormData({...formData, leave_type: type})}
                className={`leave-card ${getCardClass(type)} ${isSelected ? 'selected' : ''}`}
                style={{
                    padding: isPrimary ? '24px' : '16px 20px',
                    borderRadius: '12px',
                    border: `2px solid ${isSelected ? '#3b82f6' : '#e5e7eb'}`,
                    background: isSelected ? '#eff6ff' : '#ffffff',
                    textAlign: isPrimary ? 'center' : 'left',
                    display: isPrimary ? 'block' : 'flex',
                    alignItems: isPrimary ? 'initial' : 'center',
                    boxShadow: isSelected ? '0 4px 12px rgba(59, 130, 246, 0.15)' : 'none'
                }}
            >
                {isPrimary ? (
                    <>
                        <i className={`fa ${config.icon} leave-icon`} style={{ fontSize: '28px', color: isSelected ? '#3b82f6' : '#9ca3af', marginBottom: '16px', display: 'block' }}></i>
                        <h4 style={{ margin: '0 0 8px 0', color: isSelected ? '#1e3a8a' : '#374151', fontSize: '16px', fontWeight: '600' }}>{type}</h4>
                        <p style={{ margin: 0, fontSize: '13px', color: isSelected ? '#3b82f6' : '#6b7280', lineHeight: '1.4' }}>{config.desc}</p>
                    </>
                ) : (
                    <>
                        <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: isSelected ? '#dbebff' : '#f3f4f6', color: isSelected ? '#3b82f6' : '#6b7280', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '16px' }}>
                            <i className="fa fa-tag" style={{ fontSize: '14px' }}></i>
                        </div>
                        <div>
                            <h4 style={{ margin: '0 0 4px 0', color: isSelected ? '#1e3a8a' : '#374151', fontSize: '15px', fontWeight: '600' }}>{type}</h4>
                            <p style={{ margin: 0, fontSize: '12px', color: isSelected ? '#3b82f6' : '#6b7280' }}>Standard leave request</p>
                        </div>
                    </>
                )}
            </div>
        );
    };

    return (
        <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
            <style>
                {`
                .leave-card {
                  transition: all 0.3s ease;
                  cursor: pointer;
                }
                .leave-card:hover {
                  transform: translateY(-4px);
                  box-shadow: 0 10px 25px rgba(0,0,0,0.08) !important;
                }
                .leave-card:hover:not(.selected) {
                  border-color: #93c5fd !important;
                }
                .leave-icon {
                  color: #9CA3AF;
                  transition: color 0.3s ease;
                }
                .annual-card:hover .leave-icon {
                  color: #2563EB !important;
                }
                .sick-card:hover .leave-icon {
                  color: #DC2626 !important;
                }
                .casual-card:hover .leave-icon {
                  color: #F59E0B !important;
                }
                .annual-card.selected .leave-icon,
                .sick-card.selected .leave-icon,
                .casual-card.selected .leave-icon {
                  color: #3b82f6 !important;
                }
                `}
            </style>
            <h3 style={{ fontSize: '20px', color: '#111827', margin: '0 0 8px 0', fontWeight: '600' }}>Select Leave Type</h3>
            <p style={{ color: '#6b7280', fontSize: '14px', margin: '0 0 24px 0' }}>Choose the category of leave you are applying for.</p>
            
            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: '#6b7280' }}>
                    <i className="fa fa-spinner fa-spin" style={{ fontSize: '24px', marginBottom: '12px' }}></i>
                    <p>Loading available leave types...</p>
                </div>
            ) : (
                <>
                    <h4 style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#6b7280', marginBottom: '16px', fontWeight: '600' }}>Popular Leave Types</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '32px' }}>
                        {displayPopular.map(type => renderCard(type, true))}
                    </div>

                    {otherTypes.length > 0 && (
                        <>
                            <h4 style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#6b7280', marginBottom: '16px', fontWeight: '600', borderTop: '1px solid #e5e7eb', paddingTop: '24px' }}>Other Leave Types</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
                                {otherTypes.map(type => renderCard(type, false))}
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default StepLeaveType;
