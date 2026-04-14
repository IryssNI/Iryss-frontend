import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/client'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await api('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })
      login(data.token, data.practice)
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#F8FAFB',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        {/* Card */}
        <div style={{
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '20px',
          padding: '40px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
        }}>
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ fontSize: '32px', fontWeight: '800', letterSpacing: '-1px', marginBottom: '8px' }}>
              <span style={{ color: '#0F172A' }}>iry</span>
              <span style={{
                backgroundImage: 'linear-gradient(135deg, #0891B2, #06B6D4, #22D3EE)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>ss</span>
            </div>
            <div style={{ color: '#94A3B8', fontSize: '12px', fontWeight: '500', letterSpacing: '1px', textTransform: 'uppercase' }}>
              Patient Retention Platform
            </div>
          </div>

          <h1 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px', color: '#0F172A' }}>
            Sign in to your practice
          </h1>
          <p style={{ color: '#64748B', fontSize: '14px', marginBottom: '28px' }}>
            Enter your credentials to continue
          </p>

          {error && (
            <div style={{
              background: '#FEF2F2',
              border: '1px solid #FECACA',
              borderRadius: '10px',
              padding: '12px 14px',
              color: '#DC2626',
              fontSize: '14px',
              marginBottom: '20px',
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoFocus
                placeholder="you@practice.co.uk"
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  background: '#F8FAFB',
                  border: '1px solid #E2E8F0',
                  borderRadius: '10px',
                  padding: '12px 16px',
                  color: '#0F172A',
                  fontSize: '14px',
                  fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                  outline: 'none',
                  transition: 'border-color 0.15s',
                }}
                onFocus={e => e.target.style.borderColor = '#0891B2'}
                onBlur={e => e.target.style.borderColor = '#E2E8F0'}
              />
            </div>

            <div style={{ marginBottom: '28px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  background: '#F8FAFB',
                  border: '1px solid #E2E8F0',
                  borderRadius: '10px',
                  padding: '12px 16px',
                  color: '#0F172A',
                  fontSize: '14px',
                  fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                  outline: 'none',
                  transition: 'border-color 0.15s',
                }}
                onFocus={e => e.target.style.borderColor = '#0891B2'}
                onBlur={e => e.target.style.borderColor = '#E2E8F0'}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                background: loading ? 'linear-gradient(135deg, #0891B2, #06B6D4)' : 'linear-gradient(135deg, #0891B2, #06B6D4)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '10px',
                padding: '13px',
                fontSize: '15px',
                fontWeight: '600',
                fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.75 : 1,
                boxShadow: loading ? '0 2px 8px rgba(8,145,178,0.25)' : '0 2px 8px rgba(8,145,178,0.25)',
                transition: 'all 0.2s',
                transform: loading ? 'translateY(0px)' : 'translateY(0px)',
              }}
              onMouseEnter={e => {
                if (!loading) {
                  e.target.style.boxShadow = '0 4px 16px rgba(8,145,178,0.35)'
                  e.target.style.transform = 'translateY(-1px)'
                }
              }}
              onMouseLeave={e => {
                if (!loading) {
                  e.target.style.boxShadow = '0 2px 8px rgba(8,145,178,0.25)'
                  e.target.style.transform = 'translateY(0px)'
                }
              }}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
