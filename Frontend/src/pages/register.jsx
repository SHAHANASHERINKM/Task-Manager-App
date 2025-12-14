import { useState } from 'react'
import { registerUser } from '../services/authService' // make sure you have this API
import '../App.css'
import { Link, useNavigate } from 'react-router-dom'

function Register() {
    const navigate = useNavigate() //
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')

    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Invalid email format')
      return
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    if (!passwordRegex.test(password)) {
      setError(
        'Password must be at least 8 characters long, include 1 uppercase, 1 lowercase, 1 number, and 1 special character.'
      )
      return
    }


    setLoading(true)
    try {
  const data = await registerUser({ name, email, password })
  console.log(data)


  localStorage.setItem('token', data.token)
  localStorage.setItem('user', JSON.stringify(data.user))

  /
  navigate('/')  
} catch (err) {
  setError(err.response?.data?.message || 'Registration failed')
}
 finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-wrapper">
      {/* Left side */}
      <div className="auth-left">
        <h1>Create Your Account</h1>
        <p>
          Sign up and manage your tasks efficiently. Keep track of your
          projects, deadlines, and to-dos in one place!
        </p>
      </div>

      {/* Right side */}
      <div className="auth-right">
        <div className="auth-card">
          <h2 className="auth-title">Task Manager</h2>

          <form className="auth-form" onSubmit={handleRegister}>
            <input
              type="text"
              placeholder="Full Name"
              className="auth-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email"
              className="auth-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="auth-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && <p className="auth-error">{error}</p>}

            <button className="auth-button" disabled={loading}>
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>

          <p className="auth-text">
            Already have an account? <Link to="/">Login</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
