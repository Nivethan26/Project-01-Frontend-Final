import React, { useState } from 'react';

const StepReason = ({ formData, setFormData }) => {
    const maxLength = 300;
    const [isFocused, setIsFocused] = useState(false);

    return (
        <div>
            <h3 style={{ fontSize: '20px', color: '#111827', margin: '0 0 8px 0', fontWeight: '600' }}>Reason for Leave</h3>
            <p style={{ color: '#6b7280', fontSize: '14px', margin: '0 0 24px 0' }}>Please provide a brief explanation for your request.</p>
            
            <div style={{ position: 'relative' }}>
                <textarea
                    value={formData.reason}
                    onChange={(e) => {
                        if (e.target.value.length <= maxLength) {
                            setFormData({...formData, reason: e.target.value});
                        }
                    }}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="Enter reason for leave... (e.g., Medical appointment, family event)"
                    style={{
                        width: '100%', height: '160px', padding: '16px', borderRadius: '12px', 
                        border: `1px solid ${isFocused ? '#3b82f6' : '#d1d5db'}`,
                        fontSize: '15px', color: '#1f2937', outline: 'none', background: '#f9fafb', 
                        resize: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
                        transition: 'all 0.2s', boxShadow: isFocused ? '0 0 0 4px rgba(59, 130, 246, 0.1)' : 'none',
                        lineHeight: '1.5'
                    }}
                ></textarea>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                    <span style={{ fontSize: '13px', color: formData.reason.trim().length === 0 ? '#ef4444' : 'transparent', fontWeight: '500', transition: 'color 0.2s' }}>
                        <i className="fa fa-exclamation-circle" style={{ marginRight: '6px' }}></i> Reason is required to proceed
                    </span>
                    <span 
                        style={{ 
                            fontSize: '13px', 
                            fontWeight: '600',
                            color: formData.reason.length === maxLength ? '#ef4444' : (formData.reason.length > (maxLength * 0.8) ? '#f59e0b' : '#9ca3af'),
                            background: '#f3f4f6',
                            padding: '4px 10px',
                            borderRadius: '12px'
                        }}
                    >
                        {formData.reason.length} / {maxLength}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default StepReason;
