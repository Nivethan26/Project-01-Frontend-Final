import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const EmployeeMessages = () => {
    const { user } = useOutletContext();
    const [subject, setSubject] = useState('');
    const [category, setCategory] = useState('General Inquiry');
    const [message, setMessage] = useState('');
    const [sending, setSending] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!subject.trim() || !message.trim()) {
            toast.error('Please fill in all fields');
            return;
        }
        
        setSending(true);
        const employeeId = user?.id || user?.employeeId;
        
        try {
            const formattedMessage = `Category: ${category}\nSubject: ${subject}\n\n${message}`;

            const res = await axios.post('http://localhost/Backend/api/sendEmployeeMessage.php', {
                employee_id: employeeId,
                message: formattedMessage,
                sender: 'Employee'
            }, {
                withCredentials: true,
                headers: { 'Content-Type': 'application/json' }
            });

            if (res.data.success) {
                toast.success('Message sent successfully! Admin / HR will contact you soon.');
                setSubject('');
                setCategory('General Inquiry');
                setMessage('');
            } else {
                toast.error(res.data.message || 'Failed to send message');
            }
        } catch (err) {
            toast.error('Network Error. Could not connect to server.');
            console.error('Error:', err);
        } finally {
            setSending(false);
        }
    };

    return (
        <div style={{ margin: '-20px', padding: '40px 20px', background: '#F9FAFB', minHeight: 'calc(100vh - 60px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            
            <style>
                {`
                    .hr-form-input {
                        width: 100%;
                        padding: 12px 16px;
                        border-radius: 8px;
                        border: 1px solid #E5E7EB;
                        font-size: 15px;
                        outline: none;
                        transition: all 0.2s ease;
                        box-sizing: border-box;
                        background-color: #FFFFFF;
                        color: #111827;
                    }
                    .hr-form-input:focus {
                        border-color: #2563EB;
                        box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
                    }
                    .hr-form-input:disabled {
                        background-color: #F3F4F6;
                        cursor: not-allowed;
                    }
                    .hr-submit-btn {
                        background: linear-gradient(to right, #2563EB, #1D4ED8);
                        color: #FFFFFF;
                        border: none;
                        padding: 12px 24px;
                        border-radius: 10px;
                        font-size: 15px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.2s ease;
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        box-shadow: 0 6px 15px rgba(37, 99, 235, 0.3);
                    }
                    .hr-submit-btn:hover:not(:disabled) {
                        transform: translateY(-2px);
                        background: linear-gradient(to right, #1D4ED8, #1E3A8A);
                        box-shadow: 0 8px 20px rgba(37, 99, 235, 0.4);
                    }
                    .hr-submit-btn:disabled {
                        background: #9CA3AF;
                        box-shadow: none;
                        cursor: not-allowed;
                        transform: none;
                    }
                `}
            </style>

            <div style={{ 
                width: '100%', 
                maxWidth: '600px', 
                background: '#FFFFFF', 
                padding: '32px 28px', 
                borderRadius: '14px', 
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
                boxSizing: 'border-box'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{ 
                        width: '56px', 
                        height: '56px', 
                        background: '#EFF6FF', 
                        color: '#2563EB', 
                        borderRadius: '50%', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        margin: '0 auto 16px',
                        fontSize: '24px'
                    }}>
                        <i className="fa fa-envelope"></i>
                    </div>
                    <h2 style={{ margin: '0 0 8px 0', color: '#111827', fontSize: '26px', fontWeight: 'bold' }}>Contact Admin / HR</h2>
                    <p style={{ margin: 0, color: '#6B7280', fontSize: '15px' }}>Send your queries or concerns. Our team will respond shortly.</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: '#374151', fontSize: '14px', fontWeight: '600' }}>Subject</label>
                        <input
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="Enter subject"
                            disabled={sending}
                            className="hr-form-input"
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: '#374151', fontSize: '14px', fontWeight: '600' }}>Category</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            disabled={sending}
                            className="hr-form-input"
                            style={{ cursor: sending ? 'not-allowed' : 'pointer' }}
                        >
                            <option value="General Inquiry">General Inquiry</option>
                            <option value="Leave Issue">Leave Issue</option>
                            <option value="Booking Issue">Booking Issue</option>
                        </select>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: '#374151', fontSize: '14px', fontWeight: '600' }}>Message</label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type your message here..."
                            disabled={sending}
                            className="hr-form-input"
                            style={{ minHeight: '120px', resize: 'vertical' }}
                        ></textarea>
                    </div>

                    <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'flex-end' }}>
                        <button
                            type="submit"
                            disabled={sending || !subject.trim() || !message.trim()}
                            className="hr-submit-btn"
                        >
                            {sending ? (
                                <>
                                    <i className="fa fa-spinner fa-spin"></i>
                                    Sending...
                                </>
                            ) : (
                                <>
                                    <i className="fa fa-paper-plane"></i>
                                    Send Message
                                </>
                            )}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default EmployeeMessages;
