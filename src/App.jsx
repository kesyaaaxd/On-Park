import { useState } from 'react'
import { users } from './data/mockData'
import LoginPage from './pages/LoginPage'
import Navigation from './components/Navigation'

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

  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />
  }

  return (
    <Navigation
      currentUser={currentUser}
      currentPage={currentPage}
      onNavigate={setCurrentPage}
      onLogout={handleLogout}
    />
  )
}

export default App