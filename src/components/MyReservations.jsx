import {
  Banknote,
  Car,
  CheckCircle2,
  Clock,
  CreditCard,
  Plus,
  ReceiptText,
  SquareParking
} from 'lucide-react'

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
        <div className="form-card empty-card">

          <div className="icon-badge neutral lg">
            <ReceiptText size={28} />
          </div>

          <h3>
            No Reservations Yet
          </h3>

          <p>
            You haven't made any parking reservations.
          </p>

          <button
            className="btn-primary"
            onClick={() =>
              onNavigate('reservations')
            }
          >
            <Plus size={16} />
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
                    <span>
                      <SquareParking size={14} />
                      Parking Slot
                    </span>

                    <strong>
                      {reservation.slotNumber}
                    </strong>
                  </div>

                  <div>
                    <span>
                      <Clock size={14} />
                      Time
                    </span>

                    <strong>
                      {reservation.startTime}
                      {' - '}
                      {reservation.endTime}
                    </strong>
                  </div>

                  <div>
                    <span>
                      <Car size={14} />
                      Vehicle
                    </span>

                    <strong>
                      {reservation.vehicleNumber}
                    </strong>
                  </div>

                </div>

                {reservation.status === 'Paid' && (
                  <div className="payment-info">

                    <div className="icon-badge success sm">
                      <Banknote size={16} />
                    </div>

                    <div>
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

                  </div>
                )}

                <div className="reservation-card-actions">

                  {reservation.status === 'Confirmed' && (
                    <button
                      className="btn-primary"
                      onClick={() =>
                        onNavigate('payment')
                      }
                    >
                      <CreditCard size={15} />
                      Pay Now
                    </button>
                  )}

                  {reservation.status === 'Paid' && (
                    <button
                      className="btn-ghost"
                      onClick={() =>
                        onNavigate('confirmation')
                      }
                    >
                      <CheckCircle2 size={15} />
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
