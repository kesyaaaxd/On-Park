import { useState } from 'react'
import {
  CalendarCheck,
  Car
} from 'lucide-react'

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
          <div className="form-card empty-card">
            <div className="icon-badge neutral lg">
              <CalendarCheck size={28} />
            </div>

            <h3>No Reservations Yet</h3>

            <p>
              No client reservations have been made.
            </p>
          </div>
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
                    <span
                      className={`table-badge status-${reservation.status.toLowerCase()}`}
                    >
                      {reservation.status}
                    </span>
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

          <label htmlFor="res-parking">
            Parking Location
          </label>

          <select
            id="res-parking"
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

          <label htmlFor="res-slot">
            Parking Slot
          </label>

          <select
            id="res-slot"
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

          <label htmlFor="res-start">
            Start Time
          </label>

          <input
            id="res-start"
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

          <label htmlFor="res-end">
            End Time
          </label>

          <input
            id="res-end"
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

          <label htmlFor="res-vehicle">
            Vehicle Number
          </label>

          <input
            id="res-vehicle"
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
            className="btn-primary"
            disabled={availableSlots.length === 0}
          >
            <Car size={16} />
            Confirm Reservation
          </button>

        </form>

      </div>

    </div>
  )
}

export default ReservationManager
