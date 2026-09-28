import { useState } from 'react'

function Payment({
  currentUser,
  parkingData,
  reservationData,
  onPayment
}) {
  const [selectedReservationId, setSelectedReservationId] =
    useState('')

  const [paymentMethod, setPaymentMethod] =
    useState('E-Wallet')

  const clientReservations = reservationData.filter(
    (reservation) =>
      reservation.clientId === currentUser.id &&
      reservation.status === 'Confirmed'
  )

  const selectedReservation = reservationData.find(
    (reservation) =>
      reservation.id === Number(selectedReservationId)
  )

  function getParkingPrice(reservation) {
    const parking = parkingData.find(
      (parking) =>
        parking.id === reservation.parkingId
    )

    return parking?.pricePerHour || 0
  }

  function calculateDuration(reservation) {
    const start = reservation.startTime.split(':')
    const end = reservation.endTime.split(':')

    const startHour = Number(start[0])
    const startMinute = Number(start[1])

    const endHour = Number(end[0])
    const endMinute = Number(end[1])

    const startTotalMinutes =
      startHour * 60 + startMinute

    const endTotalMinutes =
      endHour * 60 + endMinute

    const duration =
      (endTotalMinutes - startTotalMinutes) / 60

    return duration > 0 ? duration : 1
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (!selectedReservation) {
      return
    }

    const pricePerHour =
      getParkingPrice(selectedReservation)

    const duration =
      calculateDuration(selectedReservation)

    const totalPrice =
      pricePerHour * duration

    onPayment(
      selectedReservation.id,
      {
        method: paymentMethod,
        amount: totalPrice
      }
    )

    setSelectedReservationId('')
  }

  return (
    <div className="page-container">

      <div className="page-header">
        <div>
          <h2>Payment</h2>

          <p>
            Complete your parking reservation payment.
          </p>
        </div>
      </div>

      {clientReservations.length === 0 ? (
        <div className="form-card">
          <h3>No Pending Payment</h3>

          <p>
            You don't have any confirmed reservations
            waiting for payment.
          </p>
        </div>
      ) : (
        <div className="payment-layout">

          <div className="form-card">

            <h3>
              Select Reservation
            </h3>

            <form onSubmit={handleSubmit}>

              <label>
                Reservation
              </label>

              <select
                value={selectedReservationId}
                onChange={(event) =>
                  setSelectedReservationId(
                    event.target.value
                  )
                }
                required
              >
                <option value="">
                  Select a reservation
                </option>

                {clientReservations.map(
                  (reservation) => (
                    <option
                      key={reservation.id}
                      value={reservation.id}
                    >
                      {reservation.slotNumber}
                      {' - '}
                      {reservation.startTime}
                      {' to '}
                      {reservation.endTime}
                    </option>
                  )
                )}
              </select>

              {selectedReservation && (
                <div className="payment-summary">

                  <h3>
                    Payment Summary
                  </h3>

                  <p>
                    Slot:{' '}
                    {selectedReservation.slotNumber}
                  </p>

                  <p>
                    Time:{' '}
                    {selectedReservation.startTime}
                    {' - '}
                    {selectedReservation.endTime}
                  </p>

                  <p>
                    Vehicle:{' '}
                    {selectedReservation.vehicleNumber}
                  </p>

                  <p>
                    Price per hour:{' '}
                    Rp{' '}
                    {getParkingPrice(
                      selectedReservation
                    ).toLocaleString('id-ID')}
                  </p>

                  <p>
                    Duration:{' '}
                    {calculateDuration(
                      selectedReservation
                    )}{' '}
                    hour(s)
                  </p>

                  <h3>
                    Total:{' '}
                    Rp{' '}
                    {(
                      getParkingPrice(
                        selectedReservation
                      ) *
                      calculateDuration(
                        selectedReservation
                      )
                    ).toLocaleString('id-ID')}
                  </h3>

                </div>
              )}

              <label>
                Payment Method
              </label>

              <select
                value={paymentMethod}
                onChange={(event) =>
                  setPaymentMethod(
                    event.target.value
                  )
                }
              >
                <option value="E-Wallet">
                  E-Wallet
                </option>

                <option value="Bank Transfer">
                  Bank Transfer
                </option>

                <option value="Virtual Account">
                  Virtual Account
                </option>
              </select>

              <button
                type="submit"
                disabled={!selectedReservation}
              >
                Pay Now
              </button>

            </form>

          </div>

        </div>
      )}

    </div>
  )
}

export default Payment