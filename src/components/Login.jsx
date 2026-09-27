import { useState } from 'react'

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

        <h1>ON PARK</h1>
        <p className="login-subtitle">
          Smart Parking Platform
        </p>

        <h2>Welcome Back!</h2>
        <p>Login to your account</p>

        <form onSubmit={handleSubmit}>

          <label>Username</label>

          <input
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

          <label>Password</label>

          <input
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

          {errorMessage && (
            <p className="error-message">
              {errorMessage}
            </p>
          )}

          <button type="submit">
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