import { useState } from 'react'
import {
  CalendarCheck,
  Car,
  CircleCheck,
  Clock,
  MapPin,
  Wrench
} from 'lucide-react'

function OccupancyMonitoring({
  parkingData,
  slotData
}) {
  const [selectedParkingId, setSelectedParkingId] =
    useState(
      parkingData[0]?.id || ''
    )

  const selectedParking = parkingData.find(
    (parking) =>
      parking.id === Number(selectedParkingId)
  )

  const parkingSlots = slotData.filter(
    (slot) =>
      slot.parkingId === Number(selectedParkingId)
  )

  const availableCount = parkingSlots.filter(
    (slot) => slot.status === 'Available'
  ).length

  const heldCount = parkingSlots.filter(
    (slot) => slot.status === 'Held'
  ).length

  const reservedCount = parkingSlots.filter(
    (slot) => slot.status === 'Reserved'
  ).length

  const occupiedCount = parkingSlots.filter(
    (slot) => slot.status === 'Occupied'
  ).length

  const maintenanceCount = parkingSlots.filter(
    (slot) => slot.status === 'Maintenance'
  ).length

  const summaryCards = [
    {
      key: 'available',
      label: 'Available',
      count: availableCount,
      badge: 'success',
      icon: CircleCheck
    },
    {
      key: 'held',
      label: 'Held',
      count: heldCount,
      badge: 'warning',
      icon: Clock
    },
    {
      key: 'reserved',
      label: 'Reserved',
      count: reservedCount,
      badge: 'info',
      icon: CalendarCheck
    },
    {
      key: 'occupied',
      label: 'Occupied',
      count: occupiedCount,
      badge: 'danger',
      icon: Car
    },
    {
      key: 'maintenance',
      label: 'Maintenance',
      count: maintenanceCount,
      badge: 'neutral',
      icon: Wrench
    }
  ]

  return (
    <div className="page-container">

      <div className="page-header">

        <div>
          <h2>Occupancy Monitoring</h2>

          <p>
            Monitor the current status of parking slots.
          </p>
        </div>

      </div>

      <div className="parking-selector">

        <label htmlFor="occupancy-parking-select">
          Select Parking Location
        </label>

        <select
          id="occupancy-parking-select"
          value={selectedParkingId}
          onChange={(event) =>
            setSelectedParkingId(
              event.target.value
            )
          }
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

      </div>

      {selectedParking && (
        <>
          <div className="occupancy-summary">

            {summaryCards.map((card) => {
              const Icon = card.icon

              return (
                <div
                  className="occupancy-card"
                  key={card.key}
                >
                  <div
                    className={`icon-badge sm ${card.badge}`}
                  >
                    <Icon size={16} />
                  </div>

                  <span>{card.label}</span>

                  <strong>{card.count}</strong>
                </div>
              )
            })}

          </div>

          <div className="occupancy-header">

            <div>
              <h3>
                {selectedParking.name}
              </h3>

              <p>
                <MapPin size={13} />
                {selectedParking.address}
              </p>
            </div>

            <div>
              <strong>
                {parkingSlots.length}
              </strong>

              {' '}slots monitored
            </div>

          </div>

          <div className="slot-grid">

            {parkingSlots.length === 0 ? (
              <div className="form-card empty-card">
                <div className="icon-badge neutral lg">
                  <CircleCheck size={28} />
                </div>

                <h3>No Slots</h3>

                <p>
                  No slots available for this location.
                </p>
              </div>
            ) : (
              parkingSlots.map((slot) => (
                <div
                  className={
                    `occupancy-slot status-${slot.status.toLowerCase()}`
                  }
                  key={slot.id}
                >

                  <strong>
                    {slot.slotNumber}
                  </strong>

                  <span>
                    {slot.status}
                  </span>

                </div>
              ))
            )}

          </div>
        </>
      )}

    </div>
  )
}

export default OccupancyMonitoring
