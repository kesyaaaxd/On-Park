import { useState } from 'react'
import {
  CircleParking,
  LogIn,
  User,
  Lock
} from 'lucide-react'

function Login({ onLogin }) {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })

  const [errorMessage, setErrorMessage] = useState('')

  function handleSubmit(event) {
    event.preventDefault()

    const success = onLogin(formData)

    if (!success) {
      setErrorMessage('Invalid username or password.')
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">

        <div className="icon-badge brand lg">
          <CircleParking size={30} strokeWidth={2} />
        </div>

        <h1>ON PARK</h1>
        <p className="login-subtitle">
          Smart Parking Platform
        </p>

        <h2>Welcome Back!</h2>
        <p>Login to your account</p>

        <form onSubmit={handleSubmit}>

          <label htmlFor="login-username">Username</label>

          <div className="input-icon-wrap">
            <input
              id="login-username"
              type="text"
              placeholder="Enter your username"
              value={formData.username}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  username: event.target.value
                })
              }
            />
            <User size={16} className="input-icon" />
          </div>

          <label htmlFor="login-password">Password</label>

          <div className="input-icon-wrap">
            <input
              id="login-password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  password: event.target.value
                })
              }
            />
            <Lock size={16} className="input-icon" />
          </div>

          {errorMessage && (
            <p className="error-message">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            className="btn-primary"
          >
            <LogIn size={16} />
            Login
          </button>

        </form>

        <p className="register-text">
          Don't have an account? <span>Register</span>
        </p>

      </div>
    </div>
  )
}

export default Login
