import { Link } from 'react-router-dom'
import {
  CalendarCheck,
  CalendarClock,
  Car,
  CircleParking,
  CreditCard,
  Gauge,
  LayoutDashboard,
  LogOut,
  MapPin,
  ReceiptText,
  Search,
  User
} from 'lucide-react'

function Navigation({
  currentUser,
  currentPage,
  onLogout,
  children
}) {
  const isAdmin = currentUser.role === 'Administrator'

  const adminLinks = [
    { to: '/dashboard', label: 'Dashboard', Icon: LayoutDashboard },
    { to: '/locations', label: 'Parking Locations', Icon: MapPin },
    { to: '/slots', label: 'Parking Slots', Icon: Car },
    { to: '/reservations', label: 'Reservations', Icon: CalendarCheck },
    { to: '/occupancy', label: 'Occupancy Monitoring', Icon: Gauge }
  ]

  const clientLinks = [
    { to: '/dashboard', label: 'Dashboard', Icon: LayoutDashboard },
    { to: '/find-parking', label: 'Find Parking', Icon: Search },
    { to: '/reservations', label: 'Reservation', Icon: CalendarClock },
    { to: '/my-reservations', label: 'My Reservations', Icon: ReceiptText },
    { to: '/payment', label: 'Payment', Icon: CreditCard }
  ]

  const links = isAdmin ? adminLinks : clientLinks

  return (
    <div className="app-layout">

      <header className="topbar">

        <div className="brand">
          <span className="brand-logo">
            <CircleParking size={21} strokeWidth={2.2} />
          </span>

          <h1>ON PARK</h1>
        </div>

        <div className="user-section">

          <span className="user-chip">
            <User size={15} />
            {currentUser.username}
          </span>

          <button
            className="btn-ghost"
            onClick={onLogout}
          >
            <LogOut size={15} />
            Logout
          </button>

        </div>

      </header>

      <div className="content-layout">

        <nav className="sidebar">
          {links.map(({ to, label, Icon }) => (
            <Link
              key={to}
              to={to}
              className={
                currentPage === to.replace('/', '')
                  ? 'active'
                  : ''
              }
            >
              <Icon size={17} />
              {label}
            </Link>
          ))}
        </nav>

        <main className="main-content">
          {children}
        </main>

      </div>

      <footer className="app-footer">
        <p>
          ON PARK &mdash; Smart Parking Platform &middot; Midterm Project
        </p>
      </footer>

    </div>
  )
}

export default Navigation
