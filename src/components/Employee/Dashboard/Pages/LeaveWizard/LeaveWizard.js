import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import StepIndicator from './StepIndicator';
import StepLeaveType from './StepLeaveType';
import StepDateSelection from './StepDateSelection';
import StepReason from './StepReason';
import StepReview from './StepReview';

const LeaveWizard = () => {
    const { user } = useOutletContext();
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [userDetails, setUserDetails] = useState({ name: '', email: '', phone: '' });

    const [formData, setFormData] = useState({
        leave_type: '',
        start_date: '',
        end_date: '',
        reason: ''
    });

    useEffect(() => {
        if (user && (user.id || user.employeeId)) {
            const employeeId = user.id || user.employeeId;
            axios.get(`http://localhost/Backend/api/getUserDetails.php?id=${employeeId}`, { withCredentials: true })
                .then(res => {
                    if (res.data && res.data.success && res.data.data) {
                        const ud = res.data.data;
                        setUserDetails({
                            name: ud.name || ud.firstname || ud.fullName || 'Employee',
                            email: ud.email || '',
                            phone: ud.phone || ud.mobile || ''
                        });
                    }
                })
                .catch(err => console.error(err));
        }
    }, [user]);

    const handleNext = () => {
        if (currentStep < 4) setCurrentStep(currentStep + 1);
    };

    const handleBack = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    };

    const validateStep = () => {
        if (currentStep === 1) return formData.leave_type !== '';
        if (currentStep === 2) {
            if (!formData.start_date || !formData.end_date) return false;
            if (new Date(formData.end_date) < new Date(formData.start_date)) return false;
            return true;
        }
        if (currentStep === 3) return formData.reason.trim().length > 0;
        return true;
    };

    const handleSubmit = async () => {
        if (!validateStep()) return;
        setIsSubmitting(true);
        const employeeId = user.id || user.employeeId;

        try {
            const payload = {
                employeeId: employeeId,
                username: user.username || userDetails.name || 'Unknown',
                fullName: userDetails.name || 'Unknown',
                email: userDetails.email || 'unknown@example.com',
                phoneNumber: userDetails.phone || '0000000000',
                leaveType: formData.leave_type,
                startDate: formData.start_date,
                endDate: formData.end_date,
                reason: formData.reason
            };
            
            const response = await axios.post('http://localhost/Backend/api/submitLeave.php', payload, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });

            if (response.data.success || response.data.status === 'success') {
                toast.success('Leave application submitted successfully!', {
                    position: 'top-right',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: 'colored'
                });
                setFormData({ leave_type: '', start_date: '', end_date: '', reason: '' });
                setCurrentStep(1);
            } else {
                toast.error(response.data.message || response.data.error || 'Failed to submit application.');
            }
        } catch (error) {
            toast.error('Network Error. Please try again.');
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{ background: '#f5f7fb', minHeight: 'calc(100vh - 60px)', padding: '40px 20px', fontFamily: '"Inter", "Segoe UI", sans-serif', width: '100%', boxSizing: 'border-box' }}>
            <div style={{ maxWidth: '900px', margin: '0 auto', background: '#ffffff', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.06)', padding: '40px', color: '#111827' }}>
                
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <h2 style={{ color: '#111827', fontSize: '28px', fontWeight: 'bold', margin: '0 0 8px 0' }}>Apply for Leave</h2>
                    <p style={{ color: '#6b7280', fontSize: '15px', margin: 0 }}>Submit your leave request in a few simple steps</p>
                </div>

                <StepIndicator currentStep={currentStep} />

                <div style={{ minHeight: '320px', padding: '10px 0' }}>
                    {currentStep === 1 && <StepLeaveType formData={formData} setFormData={setFormData} />}
                    {currentStep === 2 && <StepDateSelection formData={formData} setFormData={setFormData} />}
                    {currentStep === 3 && <StepReason formData={formData} setFormData={setFormData} />}
                    {currentStep === 4 && <StepReview formData={formData} userDetails={userDetails} />}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '40px', paddingTop: '32px', borderTop: '1px solid #e5e7eb' }}>
                    <div>
                        {currentStep > 1 && (
                            <button 
                                onClick={handleBack}
                                disabled={isSubmitting}
                                style={{ background: 'transparent', color: '#4b5563', border: '1px solid #d1d5db', padding: '12px 24px', borderRadius: '8px', fontSize: '15px', fontWeight: '500', cursor: isSubmitting ? 'not-allowed' : 'pointer', transition: 'all 0.2s', outline: 'none' }}
                                onMouseOver={(e) => { if(!isSubmitting) e.target.style.background = '#f9fafb' }}
                                onMouseOut={(e) => { if(!isSubmitting) e.target.style.background = 'transparent' }}
                            >
                                <i className="fa fa-arrow-left" style={{ marginRight: '8px' }}></i> Back
                            </button>
                        )}
                    </div>
                    
                    <div>
                        {currentStep < 4 ? (
                            <button 
                                onClick={handleNext}
                                disabled={!validateStep()}
                                style={{ background: validateStep() ? '#3b82f6' : '#e5e7eb', color: validateStep() ? '#ffffff' : '#9ca3af', border: 'none', padding: '12px 32px', borderRadius: '8px', fontSize: '15px', fontWeight: '600', cursor: validateStep() ? 'pointer' : 'not-allowed', transition: 'all 0.2s', boxShadow: validateStep() ? '0 4px 12px rgba(59, 130, 246, 0.25)' : 'none', outline: 'none' }}
                                onMouseOver={(e) => { if(validateStep()) e.target.style.background = '#2563eb' }}
                                onMouseOut={(e) => { if(validateStep()) e.target.style.background = '#3b82f6' }}
                            >
                                Next Step <i className="fa fa-arrow-right" style={{ marginLeft: '8px' }}></i>
                            </button>
                        ) : (
                            <button 
                                onClick={handleSubmit}
                                disabled={isSubmitting || !validateStep()}
                                style={{ background: isSubmitting ? '#9ca3af' : 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)', color: '#ffffff', border: 'none', padding: '12px 32px', borderRadius: '8px', fontSize: '15px', fontWeight: 'bold', cursor: isSubmitting ? 'wait' : 'pointer', transition: 'all 0.2s', boxShadow: isSubmitting ? 'none' : '0 4px 14px rgba(37, 99, 235, 0.3)', outline: 'none', display: 'flex', alignItems: 'center' }}
                            >
                                {isSubmitting ? (
                                    <><i className="fa fa-spinner fa-spin" style={{ marginRight: '8px' }}></i> Submitting...</>
                                ) : (
                                    <><i className="fa fa-paper-plane" style={{ marginRight: '8px' }}></i> Submit Application</>
                                )}
                            </button>
                        )}
                    </div>
                </div>
                
            </div>
        </div>
    );
};

export default LeaveWizard;
