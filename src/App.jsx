import { useState } from 'react'
import { users } from './data/mockData'
import LoginPage from './pages/LoginPage'

function App() {
  const [currentUser, setCurrentUser] = useState(null)

  function handleLogin(formData) {
    const user = users.find(
      (user) =>
        user.username === formData.username &&
        user.password === formData.password
    )

    if (user) {
      setCurrentUser(user)
      return true
    }

    return false
  }

  if (currentUser) {
    return (
      <div>
        <h1>Welcome to On Park!</h1>
        <p>
          Logged in as: {currentUser.username}
        </p>
        <p>
          Role: {currentUser.role}
        </p>
      </div>
    )
  }

  return (
    <LoginPage onLogin={handleLogin} />
  )
}

export default App