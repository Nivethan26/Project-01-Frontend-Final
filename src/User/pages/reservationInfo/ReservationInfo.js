import React from 'react';
import "./reservationInfo.css";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import CancelScheduleSendIcon from '@mui/icons-material/CancelScheduleSend';
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';

export default function ReservationInfo() {
  const lastUpdatedDate = "April 9, 2026";

  return (
    <div className="reservationInfo">
        <div className="reservationInfo-card">
            <header className="reservationInfo-header">
                <h1 className="refund-title">Refund & Cancellation Policy</h1>
                <p className="last-updated">Last Updated: {lastUpdatedDate}</p>
            </header>

            <hr className="divider" />

            <section className="policy-section">
                <h2 className="section-header">
                    <InsertDriveFileIcon className="section-icon" /> 
                    1. Introduction
                </h2>
                <p className="policy-text">
                    Welcome to AutoCare Lanka. We are committed to providing transparency and fairness in all our transactions. 
                    This Refund Policy outlines the terms and conditions under which refunds and cancellations are processed for our web application and services. 
                    By making a booking, you agree to these terms.
                </p>
            </section>

            <section className="policy-section">
                <h2 className="section-header">
                    <EventAvailableIcon className="section-icon" /> 
                    2. Definitions
                </h2>
                <ul className="policy-list">
                    <li><strong>Booking</strong>: A confirmed reservation made via the AutoCare Lanka platform for a specific service.</li>
                    <li><strong>Reservation Fee</strong>: A non-refundable or partially refundable initial payment required to secure an appointment.</li>
                    <li><strong>Service Appointment</strong>: The exact date, time, and scope of vehicular services agreed upon via our platform.</li>
                </ul>
            </section>

            <section className="policy-section">
                <h2 className="section-header">
                    <CancelScheduleSendIcon className="section-icon" /> 
                    3. Cancellation Policy
                </h2>
                <p className="policy-text">
                    Customers may cancel their Service Appointments directly through our platform. 
                    To be eligible for a partial refund of the Reservation Fee, any cancellation requests must be initiated 
                    at least <span className="highlight">24 hours</span> prior to the scheduled Service Appointment.
                </p>
            </section>

            <section className="policy-section">
                <h2 className="section-header">
                    <AttachMoneyIcon className="section-icon" /> 
                    4. Refund Breakdown
                </h2>
                <ul className="policy-list">
                    <li><strong>Cancellations made 24+ hours in advance:</strong> Eligible for a <span className="highlight">50% refund</span> of the Reservation Fee.</li>
                    <li><strong>Cancellations made less than 24 hours in advance:</strong> No refund will be issued.</li>
                    <li><strong>System Error or Company Fault:</strong> In the rare event that AutoCare Lanka cannot fulfill a confirmed service due to internal delays or system errors, you are entitled to a full 100% refund.</li>
                </ul>
            </section>

            <section className="policy-section">
                <h2 className="section-header">
                    <EventBusyIcon className="section-icon" /> 
                    5. No-Show Policy
                </h2>
                <p className="policy-text">
                    A "No-Show" occurs when a customer fails to arrive for the scheduled Service Appointment without prior cancellation. 
                    In the event of a no-show, <strong>no refund</strong> will be issued, and the Reservation Fee will be forfeited in full to cover the allocated time and resources.
                </p>
            </section>

            <section className="policy-section">
                <h2 className="section-header">
                    <SyncAltIcon className="section-icon" /> 
                    6. Rescheduling Policy
                </h2>
                <p className="policy-text">
                    We understand that plans can change. Instead of canceling, customers are encouraged to use the rescheduling feature in our application. 
                    Rescheduling is allowed up to 24 hours prior to the original appointment without penalty, provided timeslots are available.
                </p>
            </section>

            <section className="policy-section">
                <h2 className="section-header">
                    <AccessTimeIcon className="section-icon" /> 
                    7. Refund Processing Time
                </h2>
                <p className="policy-text">
                    Once a refund is approved by our financial team, please allow <span className="highlight">7–10 business days</span> for the funds to be successfully credited back to your account. 
                    Processing times may fluctuate marginally depending on your banking institution.
                </p>
            </section>

            <section className="policy-section">
                <h2 className="section-header">
                    <CreditCardIcon className="section-icon" /> 
                    8. Refund Method
                </h2>
                <p className="policy-text">
                    All approved refunds are systematically routed to the original payment method utilized during the booking process. 
                    If the original payment method is inaccessible (e.g., closed account), our support team will contact you to arrange an alternative deposit method.
                </p>
            </section>

            <section className="policy-section">
                <h2 className="section-header">
                    <VerifiedUserIcon className="section-icon" /> 
                    9. Conditions & Exceptions
                </h2>
                <ul className="policy-list">
                    <li>All refund requests are strictly subject to internal verification and manual approval.</li>
                    <li>Specialized service parts ordered explicitly for your custom repair are non-refundable.</li>
                    <li>No refunds are provided for fully rendered or partially rendered services satisfying industry standards.</li>
                </ul>
            </section>

            <section className="policy-section">
                <h2 className="section-header">
                    <ReportProblemIcon className="section-icon" /> 
                    10. Fraud / Misuse Clause
                </h2>
                <p className="policy-text">
                    AutoCare Lanka retains the absolute right to deny refund claims where there is evidence suggesting fraudulent activity, 
                    app exploitation, chargeback abuse, or intentional violations of our Terms of Service.
                </p>
            </section>

            <section className="policy-section">
                <h2 className="section-header">
                    <WarningAmberIcon className="section-icon" /> 
                    11. Force Majeure
                </h2>
                <p className="policy-text">
                    AutoCare Lanka holds no liability for unforeseen delays, cancellations, or service interruptions caused by acts of God, 
                    severe natural events, sweeping infrastructure or network failures, and other uncontrollable circumstances. 
                    Affected bookings will be deferred or credited at the company's discretion.
                </p>
            </section>

            <hr className="divider" />

            <section className="policy-section">
                <h2 className="section-header">
                    <SupportAgentIcon className="section-icon" /> 
                    12. Contact Information
                </h2>
                <p className="policy-text">
                    For any queries regarding this policy, dispute resolutions, or assistance with an active booking, please reach out to our support hub:
                </p>
                <div className="contact-info">
                    <p><strong>Email:</strong> <a href="mailto:support@autocarelanka.com">support@autocarelanka.com</a></p>
                    <p><strong>Phone:</strong> +94 74 191 5898</p>
                    <p><strong>Support Hours:</strong> 9:00 AM – 6:00 PM (Sri Lankan Time)</p>
                </div>
            </section>
        </div>
    </div>
  );
}