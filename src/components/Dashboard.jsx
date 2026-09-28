import {
  CalendarClock,
  Car,
  MapPin,
  Search
} from 'lucide-react'

function Dashboard({ currentUser, parkingLocations, reservations }) {
  const isAdmin = currentUser.role === 'Administrator'

  if (isAdmin) {
    const totalLocations = parkingLocations.length

    const totalSlots = parkingLocations.reduce(
      (total, parking) => total + parking.totalSlots,
      0
    )

    const totalReservations = reservations.length

    return (
      <div className="dashboard">
        <h2>Administrator Dashboard</h2>

        <p>
          Welcome back, {currentUser.username}!
        </p>

        <div className="dashboard-cards">

          <div className="dashboard-card">
            <div className="icon-badge brand">
              <MapPin size={20} />
            </div>
            <div>
              <h3>Parking Locations</h3>
              <p>{totalLocations}</p>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="icon-badge info">
              <Car size={20} />
            </div>
            <div>
              <h3>Parking Slots</h3>
              <p>{totalSlots}</p>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="icon-badge success">
              <CalendarClock size={20} />
            </div>
            <div>
              <h3>Reservations</h3>
              <p>{totalReservations}</p>
            </div>
          </div>

        </div>
      </div>
    )
  }

  const clientReservations = reservations.filter(
    (reservation) =>
      reservation.clientId === currentUser.id
  )

  return (
    <div className="dashboard">
      <h2>Client Dashboard</h2>

      <p>
        Welcome back, {currentUser.username}!
      </p>

      <h3>Available Parking</h3>

      <div className="parking-list">
        {parkingLocations.map((parking) => (
          <div
            className="parking-card"
            key={parking.id}
          >
            <div className="icon-badge brand">
              <MapPin size={19} />
            </div>

            <h3>{parking.name}</h3>

            <p>{parking.address}</p>

            <p>
              {parking.availableSlots} slots available
            </p>

            <p className="parking-price">
              Rp {parking.pricePerHour.toLocaleString('id-ID')}
              /hour
            </p>

            <button className="btn-ghost">
              <Search size={15} />
              View Parking
            </button>
          </div>
        ))}
      </div>

      <h3>My Recent Reservations</h3>

      {clientReservations.length === 0 ? (
        <p>No reservations yet.</p>
      ) : (
        clientReservations.map((reservation) => (
          <div
            className="reservation-item"
            key={reservation.id}
          >
            <div className="icon-badge sm neutral">
              <CalendarClock size={16} />
            </div>

            <div>
              <p>
                Slot: <strong>{reservation.slotNumber}</strong>
              </p>

              <p>
                {reservation.startTime} - {reservation.endTime}
              </p>

              <p>
                Status: {reservation.status}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default Dashboard
