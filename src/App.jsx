import { useState } from 'react'
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

function App() {
  const [currentUser, setCurrentUser] = useState(null)
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [parkingData, setParkingData] = useState(parkingLocations)
  const [slotData, setSlotData] = useState(parkingSlots)

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
  
    return (
      <div>
        <h2>Coming Soon</h2>
        <p>This page will be built next.</p>
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

  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />
  }
  
  

}

export default App