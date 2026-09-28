import {
  ArrowLeft,
  CheckCircle2,
  ReceiptText
} from 'lucide-react'

function ReservationConfirmation({
  currentUser,
  parkingData,
  reservationData,
  onNavigate
}) {
  const paidReservations = reservationData.filter(
    (reservation) =>
      reservation.clientId === currentUser.id &&
      reservation.status === 'Paid'
  )

  const latestReservation =
    paidReservations[paidReservations.length - 1]

  if (!latestReservation) {
    return (
      <div className="page-container">

        <div className="confirmation-card">

          <div className="icon-badge neutral lg">
            <ReceiptText size={30} />
          </div>

          <h2>No Confirmation Available</h2>

          <p className="confirmation-message">
            You don't have a paid reservation yet.
          </p>

          <button
            className="btn-primary"
            onClick={() => onNavigate('reservations')}
          >
            Make a Reservation
          </button>

        </div>

      </div>
    )
  }

  const parking = parkingData.find(
    (parking) =>
      parking.id === latestReservation.parkingId
  )

  return (
    <div className="page-container">

      <div className="confirmation-card">

        <div className="confirmation-icon">
          <CheckCircle2 size={38} />
        </div>

        <h2>
          Reservation Confirmed!
        </h2>

        <p className="confirmation-message">
          Your parking reservation has been
          successfully confirmed and paid.
        </p>

        <div className="confirmation-details">

          <div className="detail-row">
            <span>Parking Location</span>
            <strong>
              {parking?.name}
            </strong>
          </div>

          <div className="detail-row">
            <span>Address</span>
            <strong>
              {parking?.address}
            </strong>
          </div>

          <div className="detail-row">
            <span>Parking Slot</span>
            <strong>
              {latestReservation.slotNumber}
            </strong>
          </div>

          <div className="detail-row">
            <span>Time</span>
            <strong>
              {latestReservation.startTime}
              {' - '}
              {latestReservation.endTime}
            </strong>
          </div>

          <div className="detail-row">
            <span>Vehicle Number</span>
            <strong>
              {latestReservation.vehicleNumber}
            </strong>
          </div>

          <div className="detail-row">
            <span>Payment Method</span>
            <strong>
              {latestReservation.paymentMethod}
            </strong>
          </div>

          <div className="detail-row">
            <span>Payment Status</span>
            <strong>
              {latestReservation.status}
            </strong>
          </div>

          <div className="detail-row total-row">
            <span>Total Paid</span>
            <strong>
              Rp{' '}
              {latestReservation.paymentAmount?.toLocaleString(
                'id-ID'
              )}
            </strong>
          </div>

        </div>

        <div className="confirmation-actions">

          <button
            className="btn-ghost"
            onClick={() =>
              onNavigate('my-reservations')
            }
          >
            <ReceiptText size={15} />
            My Reservations
          </button>

          <button
            className="btn-primary"
            onClick={() =>
              onNavigate('dashboard')
            }
          >
            <ArrowLeft size={15} />
            Back to Dashboard
          </button>

        </div>

      </div>

    </div>
  )
}

export default ReservationConfirmation
