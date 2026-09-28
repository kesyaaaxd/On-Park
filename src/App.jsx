import { useState } from 'react'
import { users, parkingLocations, reservations } from './data/mockData'
import LoginPage from './pages/LoginPage'
import Navigation from './components/Navigation'
import Dashboard from './components/Dashboard'
import ParkingLocationManager from './components/ParkingLocationManager'

function App() {
  const [currentUser, setCurrentUser] = useState(null)
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [parkingData, setParkingData] = useState(parkingLocations)


  function handleLogin(formData) {
    const user = users.find(
      (user) =>
        user.username === formData.username &&
        user.password === formData.password
    )

    if (user) {
      setCurrentUser(user)
      setCurrentPage('dashboard')
      return true
    }

    return false
  }

  function handleLogout() {
    setCurrentUser(null)
    setCurrentPage('dashboard')
  }

  function renderPage() {
    if (currentPage === 'dashboard') {
      return (
        <Dashboard
          currentUser={currentUser}
          parkingLocations={parkingData}
          reservations={reservations}
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
  
    return (
      <div>
        <h2>Coming Soon</h2>
        <p>This page will be built next.</p>
      </div>
    )
  }
  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />
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
  return (
    <Navigation
      currentUser={currentUser}
      currentPage={currentPage}
      onNavigate={setCurrentPage}
      onLogout={handleLogout}
    >
      {renderPage()}
    </Navigation>
  )
}

export default App