import React from 'react';

const StepReview = ({ formData, userDetails }) => {
    
    const calculateDays = () => {
        if (formData.start_date && formData.end_date) {
            const start = new Date(formData.start_date);
            const end = new Date(formData.end_date);
            if (end >= start) {
                const diffTime = Math.abs(end - start);
                return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; 
            }
        }
        return 0;
    };

    return (
        <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
            <style>
                {`
                    @keyframes fadeIn {
                        from { opacity: 0; transform: translateY(10px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                `}
            </style>
            <h3 style={{ fontSize: '20px', color: '#111827', margin: '0 0 8px 0', fontWeight: '600' }}>Review & Submit</h3>
            <p style={{ color: '#6b7280', fontSize: '14px', margin: '0 0 24px 0' }}>Please review your application details carefully before submitting.</p>
            
            <div style={{ background: '#f9fafb', borderRadius: '16px', border: '1px solid #e5e7eb', overflow: 'hidden', marginBottom: '24px' }}>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid #e5e7eb', background: '#f3f4f6', display: 'flex', alignItems: 'center' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#bfdbfe', color: '#1e3a8a', display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: '16px', fontSize: '18px', fontWeight: 'bold', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                        {userDetails.name ? userDetails.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div>
                        <div style={{ fontWeight: '600', color: '#111827', fontSize: '16px', marginBottom: '2px' }}>{userDetails.name || 'Not available'}</div>
                        <div style={{ fontSize: '13px', color: '#6b7280', display: 'flex', gap: '12px' }}>
                            <span><i className="fa fa-envelope-o" style={{ marginRight: '6px' }}></i>{userDetails.email || 'Not available'}</span>
                            <span><i className="fa fa-phone" style={{ marginRight: '6px' }}></i>{userDetails.phone || 'Not available'}</span>
                        </div>
                    </div>
                </div>
                
                <div style={{ padding: '24px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                        <div style={{ background: '#ffffff', padding: '16px', borderRadius: '12px', border: '1px solid #f3f4f6', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
                            <span style={{ display: 'block', fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px', fontWeight: '600' }}>Leave Type</span>
                            <span style={{ fontWeight: '600', color: '#1f2937', fontSize: '16px', display: 'flex', alignItems: 'center' }}>
                                <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#eff6ff', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '10px' }}>
                                    <i className="fa fa-tag" style={{ fontSize: '14px' }}></i>
                                </div>
                                {formData.leave_type || '-'}
                            </span>
                        </div>
                        <div style={{ background: '#ffffff', padding: '16px', borderRadius: '12px', border: '1px solid #f3f4f6', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
                            <span style={{ display: 'block', fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px', fontWeight: '600' }}>Duration</span>
                            <span style={{ fontWeight: '600', color: '#1f2937', fontSize: '16px', display: 'flex', alignItems: 'center' }}>
                                <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#dcfce7', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '10px' }}>
                                    <i className="fa fa-clock-o" style={{ fontSize: '16px' }}></i>
                                </div>
                                {calculateDays()} Days
                            </span>
                        </div>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px', background: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #f3f4f6', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
                        <div>
                            <span style={{ display: 'flex', alignItems: 'center', fontSize: '12px', color: '#6b7280', marginBottom: '6px', fontWeight: '600', textTransform: 'uppercase' }}>
                                <i className="fa fa-calendar-plus-o" style={{ marginRight: '6px' }}></i> Start Date
                            </span>
                            <span style={{ fontWeight: '600', color: '#111827', fontSize: '15px' }}>{formData.start_date || '-'}</span>
                        </div>
                        <div>
                            <span style={{ display: 'flex', alignItems: 'center', fontSize: '12px', color: '#6b7280', marginBottom: '6px', fontWeight: '600', textTransform: 'uppercase' }}>
                                <i className="fa fa-calendar-minus-o" style={{ marginRight: '6px' }}></i> End Date
                            </span>
                            <span style={{ fontWeight: '600', color: '#111827', fontSize: '15px' }}>{formData.end_date || '-'}</span>
                        </div>
                    </div>

                    <div>
                        <span style={{ display: 'block', fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', fontWeight: '600' }}>Reason for Leave</span>
                        <div style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb', color: '#4b5563', fontSize: '15px', lineHeight: '1.6', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.01)' }}>
                            {formData.reason ? formData.reason : <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>No reason provided.</span>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StepReview;
