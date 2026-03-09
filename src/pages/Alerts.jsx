import { useEffect, useState } from 'react'
import { api } from '../api/client'
import Spinner from '../components/Spinner'

function formatDateTime(d) {
  if (!d) return '—'
  return new Date(d).toLocaleString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export default function Alerts() {
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [resolving, setResolving] = useState(null)

  async function fetchAlerts() {
    setLoading(true)
    setError('')
    try {
      const res = await api('/api/alerts')
      setAlerts(res.alerts)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAlerts() }, [])

  async function handleResolve(id) {
    setResolving(id)
    try {
      await api(`/api/alerts/${id}/resolve`, { method: 'POST' })
      setAlerts(prev => prev.filter(a => a.id !== id))
    } catch (err) {
      setError(err.message)
    } finally {
      setResolving(null)
    }
  }

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '4px' }}>Urgent Alerts</h1>
        <p style={{ color: '#7c93b4', fontSize: '14px' }}>
          Patient replies that require immediate staff attention
        </p>
      </div>

      {error && (
        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '10px', padding: '14px 18px', color: '#ef4444', marginBottom: '20px' }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}>
          <Spinner size={36} />
        </div>
      ) : alerts.length === 0 ? (
        <div style={{
          background: '#0D2448',
          border: '1px solid #1a3352',
          borderRadius: '14px',
          padding: '64px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '40px', marginBottom: '16px' }}>✓</div>
          <div style={{ fontSize: '18px', fontWeight: '600', color: '#22c55e', marginBottom: '6px' }}>
            No urgent alerts
          </div>
          <div style={{ color: '#7c93b4', fontSize: '14px' }}>
            All patient replies have been reviewed and resolved
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {alerts.map(alert => (
            <div
              key={alert.id}
              style={{
                background: '#0D2448',
                border: '1px solid rgba(245,158,11,0.2)',
                borderLeft: '4px solid #f59e0b',
                borderRadius: '12px',
                padding: '20px 24px',
              }}
            >
              <div className="alert-card-inner">
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                  <span style={{
                    background: 'rgba(245,158,11,0.12)',
                    color: '#f59e0b',
                    fontSize: '10px',
                    fontWeight: '700',
                    padding: '3px 8px',
                    borderRadius: '20px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.8px',
                  }}>
                    Urgent Reply
                  </span>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: '#ffffff' }}>
                    {alert.patient_name}
                  </span>
                </div>

                {alert.trigger_message ? (
                  <div style={{
                    background: 'rgba(0,0,0,0.2)',
                    border: '1px solid #1a3352',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    fontSize: '14px',
                    color: '#a0b4cc',
                    fontStyle: 'italic',
                    marginBottom: '10px',
                    lineHeight: 1.5,
                  }}>
                    "{alert.trigger_message}"
                  </div>
                ) : null}

                <div style={{ fontSize: '12px', color: '#4a6080' }}>
                  Received {formatDateTime(alert.message_at || alert.created_at)}
                </div>
              </div>

              <button
                onClick={() => handleResolve(alert.id)}
                disabled={resolving === alert.id}
                style={{
                  flexShrink: 0,
                  padding: '9px 18px',
                  borderRadius: '8px',
                  border: '1px solid rgba(34,197,94,0.3)',
                  background: 'rgba(34,197,94,0.1)',
                  color: '#22c55e',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: resolving === alert.id ? 'default' : 'pointer',
                  opacity: resolving === alert.id ? 0.6 : 1,
                  transition: 'all 0.15s',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => { if (resolving !== alert.id) e.currentTarget.style.background = 'rgba(34,197,94,0.18)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(34,197,94,0.1)' }}
              >
                {resolving === alert.id ? 'Resolving…' : 'Mark Resolved'}
              </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
