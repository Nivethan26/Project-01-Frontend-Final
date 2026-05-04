import React from 'react';

const StepIndicator = ({ currentStep }) => {
    const steps = [
        { id: 1, label: 'Leave Type' },
        { id: 2, label: 'Select Dates' },
        { id: 3, label: 'Reason' },
        { id: 4, label: 'Review & Submit' }
    ];

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', margin: '0 auto 40px', position: 'relative', maxWidth: '600px' }}>
            <div style={{ position: 'absolute', top: '15px', left: '10%', right: '10%', height: '2px', background: '#e5e7eb', zIndex: 0 }}></div>
            {steps.map((step) => {
                const isActive = step.id === currentStep;
                const isCompleted = step.id < currentStep;
                
                let bgColor = '#ffffff';
                let borderColor = '#e5e7eb';
                let textColor = '#9ca3af';

                if (isActive) {
                    bgColor = '#3b82f6';
                    borderColor = '#3b82f6';
                    textColor = '#ffffff';
                } else if (isCompleted) {
                    bgColor = '#10b981';
                    borderColor = '#10b981';
                    textColor = '#ffffff';
                }

                return (
                    <div key={step.id} style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '80px' }}>
                        <div style={{
                            width: '32px', height: '32px', borderRadius: '50%',
                            display: 'flex', justifyContent: 'center', alignItems: 'center',
                            background: bgColor,
                            border: `2px solid ${borderColor}`,
                            color: textColor,
                            fontWeight: 'bold', fontSize: '14px', transition: 'all 0.3s ease',
                            boxShadow: isActive ? '0 0 0 4px rgba(59, 130, 246, 0.2)' : 'none'
                        }}>
                            {isCompleted ? <i className="fa fa-check"></i> : step.id}
                        </div>
                        <span style={{ 
                            marginTop: '10px', 
                            fontSize: '12px', 
                            fontWeight: isActive ? '600' : '500', 
                            color: isActive ? '#1f2937' : (isCompleted ? '#4b5563' : '#9ca3af'),
                            textAlign: 'center',
                            whiteSpace: 'nowrap'
                        }}>
                            {step.label}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};

export default StepIndicator;
