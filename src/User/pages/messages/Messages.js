import { toast } from 'react-toastify';
import React, { useState, useEffect } from "react";
import "./messages.css";
import EmailIcon from '@mui/icons-material/Email';
import SendIcon from '@mui/icons-material/Send';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

export default function Messages() {
  const [formData, setFormData] = useState({
    subject: "",
    category: "General Inquiry",
    message: ""
  });
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [refNumber, setRefNumber] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const email = sessionStorage.getItem('email');
      if (!email) return;
      try {
        const response = await fetch(`/Backend/getProfile.php?email=${encodeURIComponent(email)}`);
        const data = await response.json();
        if (data.success) {
          setUserProfile(data.user);
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const formatMsgId = (id) => {
    return 'MSG-' + new Date().getFullYear() + '-' + String(id).padStart(4, '0');
  };

  const handleCopy = () => {
    const formattedId = formatMsgId(refNumber);
    navigator.clipboard.writeText(formattedId);
    setCopied(true);
    toast.info('Reference number copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userProfile) {
      toast.error('User profile not loaded. Please try again.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        firstName: userProfile.name,
        email: userProfile.email,
        phone: userProfile.phone || '0000000000',
        subject: formData.subject,
        category: formData.category,
        message: formData.message
      };

      const response = await fetch('/Backend/submit_message.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      if (result.success) {
        setRefNumber(result.messageId);
        setSubmitted(true);
        toast.success('Message sent successfully!');
      } else {
        toast.error(result.message || 'Failed to send message.');
      }
    } catch (err) {
      toast.error('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setRefNumber('');
    setFormData({
      subject: "",
      category: "General Inquiry",
      message: ""
    });
  };

  if (submitted) {
    const formattedId = formatMsgId(refNumber);
    return (
      <div className="messages-container">
        <div className="messages-card success-card">
          <div className="success-icon-wrapper">
            <CheckCircleIcon className="success-icon" />
          </div>
          <h2 className="success-title">Message Sent!</h2>
          <p className="success-desc">
            We've received your message and will respond within 24-48 hours.
          </p>

          <div className="ref-number-box">
            <span className="ref-label">Reference Number</span>
            <div className="ref-value-row">
              <span className="ref-value">{formattedId}</span>
              <button onClick={handleCopy} className="copy-btn">
                <ContentCopyIcon style={{ fontSize: 16 }} /> {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          <div className="confirmation-pill">
            <EmailIcon style={{ fontSize: 16, color: '#1d4ed8' }} />
            <span>Confirmation email sent to <strong>{userProfile?.email}</strong></span>
          </div>

          <button onClick={resetForm} className="another-msg-btn">
            Send Another Message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="messages-container">
      <div className="messages-card">
        
        <div className="messages-header">
          <div className="icon-wrapper">
            <EmailIcon className="header-icon" />
          </div>
          <h2>Contact Admin / HR</h2>
          <p>Send your queries or concerns. Our team will respond shortly.</p>
        </div>

        <form onSubmit={handleSubmit} className="messages-form">
          <div className="form-group">
            <label htmlFor="subject">Subject</label>
            <input 
              type="text" 
              id="subject" 
              name="subject" 
              value={formData.subject}
              onChange={handleChange}
              placeholder="Brief subject of your inquiry"
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select 
              id="category" 
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="General Inquiry">General Inquiry</option>
              <option value="Booking Issue">Booking Issue</option>
              <option value="Payment Issue">Payment Issue</option>
              <option value="Complaint">Complaint</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea 
              id="message" 
              name="message" 
              rows="6"
              value={formData.message}
              onChange={handleChange}
              placeholder="Provide details about your query..."
              required 
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="send-btn" disabled={loading}>
              {loading ? 'Sending...' : 'Send Message'} <SendIcon className="btn-icon" />
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
