function MyReservations({
  currentUser,
  parkingData,
  reservationData,
  onNavigate
}) {
  const myReservations = reservationData.filter(
    (reservation) =>
      reservation.clientId === currentUser.id
  )

  function getParking(parkingId) {
    return parkingData.find(
      (parking) => parking.id === parkingId
    )
  }

  return (
    <div className="page-container">

      <div className="page-header">
        <div>
          <h2>My Reservations</h2>

          <p>
            View and manage your parking reservations.
          </p>
        </div>
      </div>

      {myReservations.length === 0 ? (
        <div className="form-card">

          <h3>
            No Reservations Yet
          </h3>

          <p>
            You haven't made any parking reservations.
          </p>

          <button
            onClick={() =>
              onNavigate('reservations')
            }
          >
            Make a Reservation
          </button>

        </div>
      ) : (
        <div className="my-reservation-list">

          {myReservations.map((reservation) => {

            const parking = getParking(
              reservation.parkingId
            )

            return (
              <div
                className="my-reservation-card"
                key={reservation.id}
              >

                <div className="reservation-card-header">

                  <div>
                    <h3>
                      {parking?.name}
                    </h3>

                    <p>
                      {parking?.address}
                    </p>
                  </div>

                  <span
                    className={
                      `reservation-status status-${reservation.status.toLowerCase()}`
                    }
                  >
                    {reservation.status}
                  </span>

                </div>

                <div className="reservation-info">

                  <div>
                    <span>Parking Slot</span>

                    <strong>
                      {reservation.slotNumber}
                    </strong>
                  </div>

                  <div>
                    <span>Time</span>

                    <strong>
                      {reservation.startTime}
                      {' - '}
                      {reservation.endTime}
                    </strong>
                  </div>

                  <div>
                    <span>Vehicle</span>

                    <strong>
                      {reservation.vehicleNumber}
                    </strong>
                  </div>

                </div>

                {reservation.status === 'Paid' && (
                  <div className="payment-info">

                    <p>
                      Payment Method:{' '}
                      <strong>
                        {reservation.paymentMethod}
                      </strong>
                    </p>

                    <p>
                      Total Paid:{' '}
                      <strong>
                        Rp{' '}
                        {reservation.paymentAmount?.toLocaleString(
                          'id-ID'
                        )}
                      </strong>
                    </p>

                  </div>
                )}

                <div className="reservation-card-actions">

                  {reservation.status === 'Confirmed' && (
                    <button
                      onClick={() =>
                        onNavigate('payment')
                      }
                    >
                      Pay Now
                    </button>
                  )}

                  {reservation.status === 'Paid' && (
                    <button
                      onClick={() =>
                        onNavigate('confirmation')
                      }
                    >
                      View Confirmation
                    </button>
                  )}

                </div>

              </div>
            )
          })}

        </div>
      )}

    </div>
  )
}

export default MyReservations