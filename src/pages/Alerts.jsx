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
    <div style={{ backgroundColor: '#F8FAFB', minHeight: '100vh', padding: '32px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px', color: '#0F172A', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Urgent Alerts
          </h1>
          <p style={{ color: '#64748B', fontSize: '14px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Patient replies that need immediate staff attention
          </p>
        </div>

        {error && (
          <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '14px 18px', color: '#EF4444', marginBottom: '20px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {error}
          </div>
        )}

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}>
            <Spinner size={36} />
          </div>
        ) : alerts.length === 0 ? (
          <div style={{
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '16px',
            padding: '64px 32px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '56px', marginBottom: '20px', color: '#10B981' }}>✓</div>
            <div style={{ fontSize: '18px', fontWeight: '600', color: '#10B981', marginBottom: '8px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              No urgent alerts
            </div>
            <div style={{ color: '#64748B', fontSize: '14px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              All patient replies have been reviewed
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {alerts.map(alert => (
              <div
                key={alert.id}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderLeft: '4px solid #F59E0B',
                  borderRadius: '12px',
                  padding: '20px 24px',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                }}
              >
                <div className="alert-card-inner" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
                      <span style={{
                        background: '#FFFBEB',
                        color: '#D97706',
                        fontSize: '10px',
                        fontWeight: '700',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                      }}>
                        Urgent Reply
                      </span>
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#0F172A', marginBottom: '10px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      {alert.patient_name}
                    </div>

                    {alert.trigger_message ? (
                      <div style={{
                        background: '#F8FAFB',
                        border: '1px solid #E2E8F0',
                        borderRadius: '8px',
                        padding: '10px 14px',
                        fontSize: '14px',
                        color: '#475569',
                        marginBottom: '10px',
                        lineHeight: 1.5,
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                      }}>
                        {alert.trigger_message}
                      </div>
                    ) : null}

                    <div style={{ fontSize: '12px', color: '#94A3B8', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      Received {formatDateTime(alert.message_at || alert.created_at)}
                    </div>
                  </div>

                  <button
                    onClick={() => handleResolve(alert.id)}
                    disabled={resolving === alert.id}
                    style={{
                      flexShrink: 0,
                      padding: '10px 16px',
                      borderRadius: '8px',
                      border: '1px solid #A7F3D0',
                      background: '#ECFDF5',
                      color: '#059669',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: resolving === alert.id ? 'default' : 'pointer',
                      opacity: resolving === alert.id ? 0.6 : 1,
                      transition: 'all 0.15s',
                      whiteSpace: 'nowrap',
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                    }}
                    onMouseEnter={e => { if (resolving !== alert.id) e.currentTarget.style.background = '#D1FAE5' }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#ECFDF5' }}
                  >
                    {resolving === alert.id ? 'Resolving…' : 'Mark Resolved'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
