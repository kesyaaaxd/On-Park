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

          <h2>No Confirmation Available</h2>

          <p>
            You don't have a paid reservation yet.
          </p>

          <button
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
          ✓
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
            onClick={() =>
              onNavigate('my-reservations')
            }
          >
            My Reservations
          </button>

          <button
            onClick={() =>
              onNavigate('dashboard')
            }
          >
            Back to Dashboard
          </button>

        </div>

      </div>

    </div>
  )
}

export default ReservationConfirmation