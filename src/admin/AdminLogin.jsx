import { useState } from 'react'
import logo from '../assets/logo.jpg'
import { api } from '../lib/api.js'
import { Lock, Loader2, ArrowLeft } from 'lucide-react'

export default function AdminLogin({ onSuccess, onExit }) {
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await api.login(password)
      onSuccess()
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-login">
      <div className="admin-login-card">
        <img src={logo} alt="Unique Online Services" className="admin-login-logo" />
        <h2>Admin Login</h2>
        <p className="muted">Dashboard kholne ke liye password daalo.</p>

        <form onSubmit={submit}>
          <div className="admin-input-wrap">
            <Lock size={18} />
            <input
              type="password"
              placeholder="Admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
          </div>
          {error && <p className="admin-error">{error}</p>}
          <button type="submit" className="btn btn-primary btn-block" disabled={loading || !password}>
            {loading ? <><Loader2 size={17} className="spin" /> Checking...</> : 'Login'}
          </button>
        </form>

        <button className="admin-back" onClick={onExit}>
          <ArrowLeft size={15} /> Back to website
        </button>
      </div>
    </div>
  )
}
