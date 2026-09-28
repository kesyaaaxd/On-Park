function Navigation({ currentUser, currentPage, onNavigate, onLogout }) {
  const isAdmin = currentUser.role === 'Administrator'

  return (
    <div className="app-layout">

      <header className="topbar">
        <h1>ON PARK</h1>

        <div className="user-section">
          <span>{currentUser.username}</span>
          <button onClick={onLogout}>
            Logout
          </button>
        </div>
      </header>

      <div className="content-layout">

        <aside className="sidebar">

          <button
            className={currentPage === 'dashboard' ? 'active' : ''}
            onClick={() => onNavigate('dashboard')}
          >
            Dashboard
          </button>

          {isAdmin ? (
            <>
              <button
                className={currentPage === 'locations' ? 'active' : ''}
                onClick={() => onNavigate('locations')}
              >
                Parking Locations
              </button>

              <button
                className={currentPage === 'slots' ? 'active' : ''}
                onClick={() => onNavigate('slots')}
              >
                Parking Slots
              </button>

              <button
                className={currentPage === 'reservations' ? 'active' : ''}
                onClick={() => onNavigate('reservations')}
              >
                Reservations
              </button>

              <button
                className={currentPage === 'occupancy' ? 'active' : ''}
                onClick={() => onNavigate('occupancy')}
              >
                Occupancy Monitoring
              </button>
            </>
          ) : (
            <>
              <button
                className={currentPage === 'find-parking' ? 'active' : ''}
                onClick={() => onNavigate('find-parking')}
              >
                Find Parking
              </button>

              <button
                className={currentPage === 'my-reservations' ? 'active' : ''}
                onClick={() => onNavigate('my-reservations')}
              >
                My Reservations
              </button>
            </>
          )}

        </aside>

        <main className="main-content">
          <h2>
            {currentPage === 'dashboard'
              ? 'Dashboard'
              : currentPage === 'locations'
              ? 'Parking Locations'
              : currentPage === 'slots'
              ? 'Parking Slots'
              : currentPage === 'reservations'
              ? 'Reservations'
              : currentPage === 'occupancy'
              ? 'Occupancy Monitoring'
              : currentPage === 'find-parking'
              ? 'Find Parking'
              : 'My Reservations'}
          </h2>

          <p>
            Current page: {currentPage}
          </p>
        </main>

      </div>

    </div>
  )
}

export default Navigation