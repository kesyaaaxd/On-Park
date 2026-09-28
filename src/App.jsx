import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  users,
  parkingLocations,
  reservations,
  parkingSlots
} from './data/mockData'
import LoginPage from './pages/LoginPage'
import Navigation from './components/Navigation'
import Dashboard from './components/Dashboard'
import ParkingLocationManager from './components/ParkingLocationManager'
import ParkingSlotManager from './components/ParkingSlotManager'
import ReservationManager from './components/ReservationManager'
import Payment from './components/Payment'
import ReservationConfirmation from './components/ReservationConfirmation'
import MyReservations from './components/MyReservations'
import OccupancyMonitoring from './components/OccupancyMonitoring'

const KNOWN_PAGES = [
  'dashboard',
  'locations',
  'slots',
  'reservations',
  'payment',
  'confirmation',
  'my-reservations',
  'occupancy',
  'find-parking'
]

function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('onpark_user')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })
  const [parkingData, setParkingData] = useState(parkingLocations)
  const [slotData, setSlotData] = useState(parkingSlots)
  const [reservationData, setReservationData] = useState(reservations)

  // Page is now driven by the URL hash (HashRouter) instead of local state,
  // so refreshing any page keeps the user where they are.
  const location = useLocation()
  const navigate = useNavigate()
  const currentPage = location.pathname.replace(/^\//, '')

  // No hash yet (e.g. first load or after login): land on the dashboard.
  useEffect(() => {
    if (currentUser && currentPage === '') {
      navigate('/dashboard', { replace: true })
    }
  }, [currentUser, currentPage, navigate])

  function handleLogin(formData) {
    const user = users.find(
      (user) =>
        user.username === formData.username &&
        user.password === formData.password
    )

    if (user) {
      setCurrentUser(user)
      localStorage.setItem('onpark_user', JSON.stringify(user))
      navigate('/dashboard')
      return true
    }

    return false
  }

  function handleLogout() {
    setCurrentUser(null)
    localStorage.removeItem('onpark_user')
    navigate('/dashboard')
  }

  function renderPage() {
    if (KNOWN_PAGES.includes(currentPage)) {
      if (currentPage === 'dashboard') {
        return (
          <Dashboard
            currentUser={currentUser}
            parkingLocations={parkingData}
            reservations={reservationData}
          />
        )
      }

      if (currentPage === 'locations') {
        return (
          <ParkingLocationManager
            parkingData={parkingData}
            onAdd={handleAddLocation}
            onEdit={handleEditLocation}
            onDelete={handleDeleteLocation}
          />
        )
      }

      if (currentPage === 'slots') {
        return (
          <ParkingSlotManager
            parkingData={parkingData}
            slotData={slotData}
            onAdd={handleAddSlot}
            onEdit={handleEditSlot}
            onDelete={handleDeleteSlot}
          />
        )
      }

      if (currentPage === 'reservations') {
        return (
          <ReservationManager
            currentUser={currentUser}
            parkingData={parkingData}
            slotData={slotData}
            reservationData={reservationData}
            onAddReservation={handleAddReservation}
          />
        )
      }

      if (currentPage === 'payment') {
        return (
          <Payment
            currentUser={currentUser}
            parkingData={parkingData}
            reservationData={reservationData}
            onPayment={handlePayment}
          />
        )
      }

      if (currentPage === 'confirmation') {
        return (
          <ReservationConfirmation
            currentUser={currentUser}
            parkingData={parkingData}
            reservationData={reservationData}
            onNavigate={onNavigatePage}
          />
        )
      }

      if (currentPage === 'my-reservations') {
        return (
          <MyReservations
            currentUser={currentUser}
            parkingData={parkingData}
            reservationData={reservationData}
            onNavigate={onNavigatePage}
          />
        )
      }

      if (currentPage === 'occupancy') {
        return (
          <OccupancyMonitoring
            parkingData={parkingData}
            slotData={slotData}
          />
        )
      }

      if (currentPage === 'find-parking') {
        return (
          <div>
            <h2>Coming Soon</h2>
            <p>This page will be built next.</p>
          </div>
        )
      }
    }

    // 404 fallback: unknown routes land here with a way back.
    return (
      <div className="empty-state">
        <h2>Page Not Found</h2>
        <p>
          The page you are looking for does not exist
          {' '}(<code>{location.pathname}</code>).
        </p>
        <button
          className="btn-primary"
          onClick={() => navigate('/dashboard')}
        >
          Back to Dashboard
        </button>
      </div>
    )
  }

  function handleAddLocation(locationData) {
    const newLocation = {
      id: Date.now(),
      ...locationData
    }

    setParkingData([
      ...parkingData,
      newLocation
      ])
  }

  function handleEditLocation(id, locationData) {
    setParkingData(
      parkingData.map((parking) =>
        parking.id === id
          ? {
              ...parking,
              ...locationData
            }
          : parking
        )
      )
  }

  function handleDeleteLocation(id) {
    setParkingData(
      parkingData.filter(
        (parking) => parking.id !== id
        )
      )
  }

  function handleAddSlot(newSlotData) {
    const newSlot = {
      id: Date.now(),
      ...newSlotData
    }

    setSlotData([
      ...slotData,
      newSlot
    ])
  }

  function handleEditSlot(id, updatedSlotData) {
    setSlotData(
      slotData.map((slot) =>
        slot.id === id
          ? {
              ...slot,
              ...updatedSlotData
            }
          : slot
      )
    )
  }

  function handleDeleteSlot(id) {
    setSlotData(
      slotData.filter(
        (slot) => slot.id !== id
        )
      )
  }

  function handleAddReservation(newReservationData) {
    const newReservation = {
      id: Date.now(),
      ...newReservationData
    }

    setReservationData([
      ...reservationData,
      newReservation
    ])
  }

  function handlePayment(
    reservationId,
    paymentData
  ) {
    setReservationData(
      reservationData.map((reservation) =>
        reservation.id === reservationId
          ? {
              ...reservation,
              status: 'Paid',
              paymentMethod: paymentData.method,
              paymentAmount: paymentData.amount
            }
          : reservation
      )
     )

    navigate('/confirmation')
  }

  // Components (MyReservations, ReservationConfirmation) still call
  // onNavigate with a page name, e.g. onNavigate('payment').
  function onNavigatePage(page) {
    navigate('/' + page)
  }

  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />
  }

  return (
    <Navigation
      currentUser={currentUser}
      currentPage={KNOWN_PAGES.includes(currentPage) ? currentPage : ''}
      onLogout={handleLogout}
    >
      {renderPage()}
    </Navigation>
  )
}

export default App
