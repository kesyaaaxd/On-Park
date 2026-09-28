import { useState } from 'react'

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

        <label>
          Select Parking Location
        </label>

        <select
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

            <div className="occupancy-card">
              <span>Available</span>
              <strong>{availableCount}</strong>
            </div>

            <div className="occupancy-card">
              <span>Held</span>
              <strong>{heldCount}</strong>
            </div>

            <div className="occupancy-card">
              <span>Reserved</span>
              <strong>{reservedCount}</strong>
            </div>

            <div className="occupancy-card">
              <span>Occupied</span>
              <strong>{occupiedCount}</strong>
            </div>

            <div className="occupancy-card">
              <span>Maintenance</span>
              <strong>{maintenanceCount}</strong>
            </div>

          </div>

          <div className="occupancy-header">

            <div>
              <h3>
                {selectedParking.name}
              </h3>

              <p>
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
              <p>
                No slots available for this location.
              </p>
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