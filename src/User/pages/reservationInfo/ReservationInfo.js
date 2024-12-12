import "./reservationInfo.css";

export default function ReservationInfo() {
  return (
    <div className="reservationInfo">
      <div className="refundPolicy">
        <h2>Refund Policy</h2>
        <p>
          At Autocare Lanka, we value our customers and strive to offer a
          seamless booking experience. Our refund policy ensures transparency
          and fairness when handling cancellations and refunds. Please read the
          following rules and regulations carefully before making a reservation:
        </p>
        <ul>
          <li>
            <strong>Cancellation Eligibility:</strong> Customers are eligible
            for a partial refund if the booking is canceled at least{" "}
            <strong>24 hours</strong> before the scheduled appointment time.
            Bookings canceled <strong>less than 24 hours</strong> before the
            appointment will not be eligible for a refund.
          </li>
          <li>
            <strong>Refund Amount:</strong> If the cancellation is made at least
            24 hours in advance, customers will receive <strong>50%</strong> of
            the reservation fee (Rs. 250) as a refund. No refunds will be issued
            for cancellations made less than 24 hours before the scheduled time.
          </li>
          <li>
            <strong>How to Cancel a Booking:</strong>
            Cancellations can be processed by contacting our customer support
            team via phone or email.
          </li>
          <li>
            <strong>Refund Processing Time:</strong> Refunds will be processed
            within <strong>7-10 business days</strong> from the date of
            cancellation approval. The refunded amount will be credited to the
            original payment method used at the time of booking.
          </li>
          <li>
            <strong>Conditions for Refund:</strong> Refunds will only be
            processed if the cancellation request meets the eligibility criteria
            outlined above. Any service charges or additional fees incurred
            during the booking will not be refunded.
          </li>
          <li>
            <strong>Exceptions:</strong> In case of unavoidable circumstances
            (e.g., system error, incorrect scheduling by Autocare Lanka), full
            refunds may be issued at the discretion of the management. Customers
            experiencing issues related to refunds can contact our support team
            for assistance.
          </li>
          <li>
            <strong>Changes to the Refund Policy:</strong> Autocare Lanka
            reserves the right to update or modify this refund policy at any
            time without prior notice. Any changes to the policy will be posted
            on our website.
          </li>
        </ul>
      </div>
    </div>
  );
}