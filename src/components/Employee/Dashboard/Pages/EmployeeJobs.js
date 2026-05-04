import React from 'react';
import { Link } from 'react-router-dom';

const EmployeeJobs = () => {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '70vh',
            padding: '20px'
        }}>
            <div style={{
                background: '#ffffff',
                borderRadius: '16px',
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
                padding: '40px',
                maxWidth: '500px',
                width: '100%',
                textAlign: 'center',
                color: '#333'
            }}>
                <div style={{ 
                    background: '#f4f7fe', 
                    width: '80px', 
                    height: '80px', 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    margin: '0 auto 20px',
                    color: '#e60000',
                    fontSize: '36px'
                }}>
                    <i className="fa fa-wrench"></i>
                </div>
                
                <h2 style={{ margin: '0 0 15px', color: '#1a1a1a', fontSize: '24px', fontWeight: 'bold' }}>
                    My Jobs - Coming Soon
                </h2>
                
                <p style={{ color: '#666', fontSize: '15px', lineHeight: '1.6', marginBottom: '25px' }}>
                    This feature is currently under development. Soon you will be able to view and manage your assigned service jobs here.
                </p>

                <div style={{ 
                    background: '#f8f9fa', 
                    padding: '20px', 
                    borderRadius: '12px',
                    textAlign: 'left',
                    marginBottom: '30px'
                }}>
                    <ul style={{ margin: 0, paddingLeft: '20px', color: '#555', fontSize: '14px', lineHeight: '1.8' }}>
                        <li>View assigned jobs</li>
                        <li>Update job status</li>
                        <li>Track service progress</li>
                    </ul>
                </div>

                <Link to="/employee/dashboard" style={{ textDecoration: 'none' }}>
                    <button style={{
                        background: '#e60000',
                        color: 'white',
                        border: 'none',
                        padding: '12px 24px',
                        borderRadius: '8px',
                        fontSize: '15px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        width: '100%',
                        transition: 'background 0.3s ease',
                        boxShadow: '0 4px 12px rgba(230, 0, 0, 0.2)'
                    }}
                    onMouseOver={(e) => e.target.style.background = '#cc0000'}
                    onMouseOut={(e) => e.target.style.background = '#e60000'}
                    >
                        Go to Dashboard
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default EmployeeJobs;
