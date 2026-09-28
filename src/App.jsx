import { useState } from 'react'
import { users, parkingLocations, reservations } from './data/mockData'
import LoginPage from './pages/LoginPage'
import Navigation from './components/Navigation'
import Dashboard from './components/Dashboard'

function App() {
  const [currentUser, setCurrentUser] = useState(null)
  const [currentPage, setCurrentPage] = useState('dashboard')

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
          parkingLocations={parkingLocations}
          reservations={reservations}
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