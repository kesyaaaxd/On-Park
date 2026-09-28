import { useState } from 'react'

function ReservationManager({
  currentUser,
  parkingData,
  slotData,
  reservationData,
  onAddReservation
}) {
  const isAdmin = currentUser.role === 'Administrator'

  const [formData, setFormData] = useState({
    parkingId: parkingData[0]?.id || '',
    slotId: '',
    startTime: '',
    endTime: '',
    vehicleNumber: ''
  })

  const availableSlots = slotData.filter(
    (slot) =>
      slot.parkingId === Number(formData.parkingId) &&
      slot.status === 'Available'
  )

  function handleSubmit(event) {
    event.preventDefault()

    const selectedSlot = slotData.find(
      (slot) => slot.id === Number(formData.slotId)
    )

    const newReservation = {
      clientId: currentUser.id,
      parkingId: Number(formData.parkingId),
      slotNumber: selectedSlot.slotNumber,
      startTime: formData.startTime,
      endTime: formData.endTime,
      vehicleNumber: formData.vehicleNumber,
      status: 'Confirmed'
    }

    onAddReservation(newReservation)

    setFormData({
      parkingId: parkingData[0]?.id || '',
      slotId: '',
      startTime: '',
      endTime: '',
      vehicleNumber: ''
    })
  }

  if (isAdmin) {
    return (
      <div className="page-container">

        <div className="page-header">
          <div>
            <h2>Reservations</h2>

            <p>
              View and monitor client reservations.
            </p>
          </div>
        </div>

        {reservationData.length === 0 ? (
          <p>
            No reservations yet.
          </p>
        ) : (
          <div className="reservation-table">

            <div className="reservation-table-header">
              <span>Parking</span>
              <span>Slot</span>
              <span>Time</span>
              <span>Vehicle</span>
              <span>Status</span>
            </div>

            {reservationData.map((reservation) => {

              const parking = parkingData.find(
                (parking) =>
                  parking.id === reservation.parkingId
              )

              return (
                <div
                  className="reservation-table-row"
                  key={reservation.id}
                >
                  <span>
                    {parking?.name}
                  </span>

                  <span>
                    {reservation.slotNumber}
                  </span>

                  <span>
                    {reservation.startTime}
                    {' - '}
                    {reservation.endTime}
                  </span>

                  <span>
                    {reservation.vehicleNumber}
                  </span>

                  <span>
                    {reservation.status}
                  </span>
                </div>
              )
            })}

          </div>
        )}

      </div>
    )
  }

  return (
    <div className="page-container">

      <div className="page-header">
        <div>
          <h2>Make a Reservation</h2>

          <p>
            Reserve a parking slot for your vehicle.
          </p>
        </div>
      </div>

      <div className="form-card">

        <form onSubmit={handleSubmit}>

          <label>
            Parking Location
          </label>

          <select
            value={formData.parkingId}
            onChange={(event) =>
              setFormData({
                ...formData,
                parkingId: event.target.value,
                slotId: ''
              })
            }
            required
          >
            {parkingData.map((parking) => (
              <option
                key={parking.id}
                value={parking.id}
              >
                {parking.name}
              </option>
            ))}
          </select>

          <label>
            Parking Slot
          </label>

          <select
            value={formData.slotId}
            onChange={(event) =>
              setFormData({
                ...formData,
                slotId: event.target.value
              })
            }
            required
          >
            <option value="">
              Select a slot
            </option>

            {availableSlots.map((slot) => (
              <option
                key={slot.id}
                value={slot.id}
              >
                {slot.slotNumber}
              </option>
            ))}
          </select>

          {availableSlots.length === 0 && (
            <p className="form-message">
              No available slots for this parking location.
            </p>
          )}

          <label>
            Start Time
          </label>

          <input
            type="time"
            value={formData.startTime}
            onChange={(event) =>
              setFormData({
                ...formData,
                startTime: event.target.value
              })
            }
            required
          />

          <label>
            End Time
          </label>

          <input
            type="time"
            value={formData.endTime}
            onChange={(event) =>
              setFormData({
                ...formData,
                endTime: event.target.value
              })
            }
            required
          />

          <label>
            Vehicle Number
          </label>

          <input
            type="text"
            placeholder="Example: B 1234 ABC"
            value={formData.vehicleNumber}
            onChange={(event) =>
              setFormData({
                ...formData,
                vehicleNumber: event.target.value
              })
            }
            required
          />

          <button
            type="submit"
            disabled={availableSlots.length === 0}
          >
            Confirm Reservation
          </button>

        </form>

      </div>

    </div>
  )
}

export default ReservationManager