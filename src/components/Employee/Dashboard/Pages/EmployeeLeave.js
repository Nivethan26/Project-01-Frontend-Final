import React from 'react';
import LeaveWizard from './LeaveWizard/LeaveWizard';

const EmployeeLeave = () => {
    return (
        <div className="emp-leave-page" style={{ margin: '-20px', background: '#f5f7fb' }}>
            <LeaveWizard />
        </div>
    );
};

export default EmployeeLeave;
