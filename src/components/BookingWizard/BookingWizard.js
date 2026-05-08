import React, { useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ServiceStep from './steps/ServiceStep';
import DateStep from './steps/DateStep';
import CustomerStep from './steps/CustomerStep';
import PaymentStep from './steps/PaymentStep';
import ConfirmationStep from './steps/ConfirmationStep';
import WashConfirmStep from './steps/WashConfirmStep';
import './BookingWizard.css';

/* ─────────────────────────────────────────────
   Step labels per flow
   ─────────────────────────────────────────────
   WASH flow  (station pre-selected from BookingPage):
     1=Confirm Station → 2=Date+Time → 3=Details → 4=Payment → 5=Done

   OTHER flow (category pre-selected from BookingPage):
     1=Select Service → 2=Date+Avail → 3=Details → 4=Payment → 5=Done
   ───────────────────────────────────────────── */

const WASH_LABELS  = ['Confirm', 'Schedule', 'Details', 'Payment', 'Done'];
const OTHER_LABELS = ['Service', 'Schedule', 'Details', 'Payment', 'Done'];

const initialState = {
  selectedCategory: null,
  selectedService: null,
  selectedStation: null,
  selectedDate: null,
  selectedTimeslot: null,
  availabilityInfo: null,
  customerDetails: { name: '', email: '', phone: '', vehicle_model: '', vehicle_number: '' },
  paymentMethod: null,
  bookingConfirmation: null,
};

export default function BookingWizard({ preSelectedProps, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();

  // Pre-selection passed from BookingPage (via route state) or as a prop (via modal)
  const preSelected = preSelectedProps || location.state || {};
  const entryType = preSelected.entryType || (preSelected.preSelectedStation ? 'wash' : 'other');
  const isWash = entryType === 'wash';

  const [currentStep, setCurrentStep] = useState(1);
  const [state, setState] = useState({
    ...initialState,
    selectedCategory: preSelected.preSelectedCategory || preSelected.category || null,
    selectedService: preSelected.service || null,
    selectedStation: preSelected.preSelectedStation || null,
  });

  // Pre-fill customer info from session
  React.useEffect(() => {
    const email = sessionStorage.getItem('email') || '';
    const name = sessionStorage.getItem('username') || '';
    if (email || name) {
      setState(prev => ({
        ...prev,
        customerDetails: { ...prev.customerDetails, email, name }
      }));
    }
  }, []);

  // Scroll to top on step change inside the booking wizard
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStep]);

  const update = useCallback((partial) => {
    setState(prev => ({ ...prev, ...partial }));
  }, []);

  const goTo = useCallback((step) => setCurrentStep(step), []);

  const resetWizard = () => {
    if (onClose) onClose();
    else {
      const email = sessionStorage.getItem('email');
      const role = sessionStorage.getItem('user-role');
      if (role && role.toLowerCase() === 'employee') {
        navigate('/employee/bookings');
      } else if (email) {
        navigate('/user');
      } else {
        navigate('/booking');
      }
    }
  };

  const displayLabels = isWash ? WASH_LABELS : OTHER_LABELS;
  const totalSteps = 5;

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        if (isWash) {
          // Wash: Show confirmation of the pre-selected station
          return <WashConfirmStep state={state} update={update} goTo={goTo} navigate={navigate} />;
        }
        // Other: Service selection from the pre-selected category
        return <ServiceStep state={state} update={update} goTo={goTo} />;

      case 2:
        // Both: Date selection (wash=timeslots, other=capacity)
        return <DateStep state={state} update={update} goTo={goTo} isWash={isWash} />;

      case 3:
        // Customer details
        return <CustomerStep state={state} update={update} goTo={goTo} />;

      case 4:
        // Payment + confirm
        return <PaymentStep state={state} update={update} goTo={goTo} navigate={navigate} />;

      case 5:
        // Done
        return <ConfirmationStep state={state} resetWizard={resetWizard} navigate={navigate} />;

      default:
        return null;
    }
  };

  return (
    <div className="bw-page">
      <div className="bw-header">
        <h1>Book a Service</h1>
        <p>Complete the steps below to schedule your vehicle service</p>
      </div>

      {/* Progress Bar */}
      <div className="bw-progress-bar">
        {displayLabels.map((label, idx) => {
          const stepNum = idx + 1;
          const isDone = currentStep > stepNum;
          const isActive = currentStep === stepNum;
          return (
            <React.Fragment key={label}>
              {idx > 0 && <div className={`bw-step-line ${isDone ? 'done' : ''}`} />}
              <div className="bw-step-indicator">
                <div className={`bw-step-circle ${isDone ? 'done' : ''} ${isActive ? 'active' : ''}`}>
                  {isDone ? '✓' : stepNum}
                </div>
                <span className={`bw-step-label ${isDone ? 'done' : ''} ${isActive ? 'active' : ''}`}>
                  {label}
                </span>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      {/* Step Content */}
      <div className="bw-content">
        {renderStep()}
      </div>
    </div>
  );
}
