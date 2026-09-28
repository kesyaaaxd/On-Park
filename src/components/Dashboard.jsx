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
            <h3>Parking Locations</h3>
            <p>{totalLocations}</p>
          </div>

          <div className="dashboard-card">
            <h3>Parking Slots</h3>
            <p>{totalSlots}</p>
          </div>

          <div className="dashboard-card">
            <h3>Reservations</h3>
            <p>{totalReservations}</p>
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
            <h3>{parking.name}</h3>

            <p>{parking.address}</p>

            <p>
              {parking.availableSlots} slots available
            </p>

            <p>
              Rp {parking.pricePerHour.toLocaleString('id-ID')}
              /hour
            </p>

            <button>
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
            <p>
              Slot: {reservation.slotNumber}
            </p>

            <p>
              {reservation.startTime} - {reservation.endTime}
            </p>

            <p>
              Status: {reservation.status}
            </p>
          </div>
        ))
      )}
    </div>
  )
}

export default Dashboard