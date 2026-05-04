import React from 'react';

const StepDateSelection = ({ formData, setFormData }) => {
    
    const calculateDays = () => {
        if (formData.start_date && formData.end_date) {
            const start = new Date(formData.start_date);
            const end = new Date(formData.end_date);
            if (end >= start) {
                const diffTime = Math.abs(end - start);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; 
                return diffDays;
            }
        }
        return 0;
    };

    const days = calculateDays();
    const isValid = !formData.end_date || (new Date(formData.end_date) >= new Date(formData.start_date));

    return (
        <div>
            <h3 style={{ fontSize: '20px', color: '#111827', margin: '0 0 8px 0', fontWeight: '600' }}>Select Leave Dates</h3>
            <p style={{ color: '#6b7280', fontSize: '14px', margin: '0 0 24px 0' }}>Specify the start and end dates of your absence.</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '30px' }}>
                <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Start Date</label>
                    <input 
                        type="date" 
                        value={formData.start_date}
                        onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                        style={{
                            width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #d1d5db',
                            fontSize: '15px', color: '#1f2937', outline: 'none', background: '#f9fafb', boxSizing: 'border-box',
                            transition: 'border-color 0.2s', fontFamily: 'inherit'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                        onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>End Date</label>
                    <input 
                        type="date" 
                        value={formData.end_date}
                        min={formData.start_date}
                        onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                        style={{
                            width: '100%', padding: '12px 16px', borderRadius: '8px', 
                            border: `1px solid ${!isValid ? '#ef4444' : '#d1d5db'}`,
                            fontSize: '15px', color: '#1f2937', outline: 'none', background: '#f9fafb', boxSizing: 'border-box',
                            transition: 'border-color 0.2s', fontFamily: 'inherit'
                        }}
                        onFocus={(e) => e.target.style.borderColor = !isValid ? '#ef4444' : '#3b82f6'}
                        onBlur={(e) => e.target.style.borderColor = !isValid ? '#ef4444' : '#d1d5db'}
                    />
                    {!isValid && <span style={{ color: '#ef4444', fontSize: '13px', marginTop: '6px', display: 'block' }}>End date cannot be earlier than start date</span>}
                </div>
            </div>

            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '20px', display: 'flex', alignItems: 'center', color: '#166534' }}>
                <div style={{ background: '#dcfce7', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '16px' }}>
                    <i className="fa fa-calendar-check-o" style={{ fontSize: '20px', color: '#15803d' }}></i>
                </div>
                <div>
                    <span style={{ display: 'block', fontSize: '13px', color: '#166534', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Duration</span>
                    <strong style={{ fontSize: '24px', display: 'block', marginTop: '2px' }}>{days} {days === 1 ? 'Day' : 'Days'}</strong>
                </div>
            </div>
        </div>
    );
};

export default StepDateSelection;
