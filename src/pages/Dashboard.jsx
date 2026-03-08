import { useEffect, useState } from 'react'
import { api } from '../api/client'
import { useAuth } from '../context/AuthContext'
import StatCard from '../components/StatCard'
import Spinner from '../components/Spinner'

function formatDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function RiskBadge({ status }) {
  const map = {
    high: { bg: 'rgba(239,68,68,0.12)', color: '#ef4444', label: 'High' },
    medium: { bg: 'rgba(245,158,11,0.12)', color: '#f59e0b', label: 'Medium' },
    low: { bg: 'rgba(34,197,94,0.12)', color: '#22c55e', label: 'Low' },
  }
  const s = map[status] || map.low
  return (
    <span style={{
      background: s.bg,
      color: s.color,
      fontSize: '11px',
      fontWeight: '600',
      padding: '3px 8px',
      borderRadius: '20px',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    }}>
      {s.label}
    </span>
  )
}

function SendButton({ patientId, onSent }) {
  const [state, setState] = useState('idle') // idle | loading | sent | error

  async function handleClick() {
    setState('loading')
    try {
      await api(`/api/patients/${patientId}/message`, { method: 'POST' })
      setState('sent')
      onSent && onSent()
      setTimeout(() => setState('idle'), 3000)
    } catch {
      setState('error')
      setTimeout(() => setState('idle'), 3000)
    }
  }

  const variants = {
    idle: { bg: 'rgba(8,145,178,0.12)', color: '#0891B2', border: '1px solid rgba(8,145,178,0.3)', label: 'Send WhatsApp' },
    loading: { bg: 'rgba(8,145,178,0.08)', color: '#7c93b4', border: '1px solid #1a3352', label: 'Sending…' },
    sent: { bg: 'rgba(34,197,94,0.12)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.3)', label: 'Sent ✓' },
    error: { bg: 'rgba(239,68,68,0.12)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', label: 'Failed' },
  }
  const v = variants[state]

  return (
    <button
      onClick={handleClick}
      disabled={state === 'loading'}
      style={{
        background: v.bg,
        color: v.color,
        border: v.border,
        borderRadius: '6px',
        padding: '6px 14px',
        fontSize: '13px',
        fontWeight: '500',
        cursor: state === 'loading' ? 'default' : 'pointer',
        whiteSpace: 'nowrap',
        transition: 'all 0.2s',
      }}
    >
      {v.label}
    </button>
  )
}

export default function Dashboard() {
  const { practice } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function fetchData() {
    try {
      const res = await api('/api/dashboard')
      setData(res)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const summary = data?.summary || {}
  const highRisk = data?.high_risk_patients || []

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '4px' }}>
          Dashboard
        </h1>
        <p style={{ color: '#7c93b4', fontSize: '14px' }}>
          {practice?.name} — {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      {error && (
        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '10px', padding: '14px 18px', color: '#ef4444', marginBottom: '24px' }}>
          {error}
        </div>
      )}

      {/* Stat Cards */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '40px', flexWrap: 'wrap' }}>
        <StatCard
          label="Patients at risk"
          value={loading ? '—' : summary.patients_at_risk ?? 0}
          sub="This month"
          color="#ef4444"
          loading={loading}
        />
        <StatCard
          label="Revenue at risk"
          value={loading ? '—' : `£${(summary.revenue_at_risk ?? 0).toLocaleString()}`}
          sub="Based on £150 avg value"
          color="#f59e0b"
          loading={loading}
        />
        <StatCard
          label="Patients recovered"
          value={loading ? '—' : summary.patients_recovered ?? 0}
          sub="This month"
          color="#22c55e"
          loading={loading}
        />
        <StatCard
          label="Revenue recovered"
          value={loading ? '—' : `£${(summary.revenue_recovered ?? 0).toLocaleString()}`}
          sub="This month"
          color="#22c55e"
          loading={loading}
        />
      </div>

      {/* Secondary stats */}
      {!loading && (
        <div style={{ display: 'flex', gap: '16px', marginBottom: '40px' }}>
          <div style={{ background: '#0D2448', border: '1px solid #1a3352', borderRadius: '10px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '22px', fontWeight: '700', color: '#f59e0b' }}>{summary.unresolved_alerts ?? 0}</span>
            <span style={{ color: '#7c93b4', fontSize: '14px' }}>Unresolved urgent alerts</span>
          </div>
          <div style={{ background: '#0D2448', border: '1px solid #1a3352', borderRadius: '10px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '22px', fontWeight: '700', color: '#0891B2' }}>{summary.messages_sent_this_week ?? 0}</span>
            <span style={{ color: '#7c93b4', fontSize: '14px' }}>SMS sent this week</span>
          </div>
        </div>
      )}

      {/* High Risk Patients Table */}
      <div style={{ background: '#0D2448', border: '1px solid #1a3352', borderRadius: '14px', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #1a3352', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: '600' }}>High Risk Patients</h2>
            <p style={{ color: '#7c93b4', fontSize: '13px', marginTop: '2px' }}>
              Patients requiring immediate re-engagement
            </p>
          </div>
          {!loading && (
            <span style={{ background: 'rgba(239,68,68,0.12)', color: '#ef4444', fontSize: '12px', fontWeight: '600', padding: '4px 10px', borderRadius: '20px' }}>
              {highRisk.length} patients
            </span>
          )}
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '48px' }}>
            <Spinner size={32} />
          </div>
        ) : highRisk.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#7c93b4' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>✓</div>
            <div style={{ fontSize: '15px', fontWeight: '500', color: '#22c55e' }}>No high risk patients right now</div>
            <div style={{ fontSize: '13px', marginTop: '4px' }}>Your retention campaigns are working well</div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #1a3352' }}>
                  {['Patient', 'Type', 'Days Since Reorder', 'Last Appointment', 'Last Message', ''].map(h => (
                    <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: '#7c93b4', textTransform: 'uppercase', letterSpacing: '0.6px', whiteSpace: 'nowrap' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {highRisk.map((p, i) => (
                  <tr
                    key={p.id}
                    style={{
                      borderBottom: i < highRisk.length - 1 ? '1px solid #1a3352' : 'none',
                      transition: 'background 0.1s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ fontWeight: '500', fontSize: '14px' }}>{p.name}</div>
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{
                        background: p.patient_type === 'contact_lens' ? 'rgba(8,145,178,0.12)' : 'rgba(124,147,180,0.12)',
                        color: p.patient_type === 'contact_lens' ? '#0891B2' : '#7c93b4',
                        fontSize: '11px',
                        fontWeight: '600',
                        padding: '3px 8px',
                        borderRadius: '20px',
                      }}>
                        {p.patient_type === 'contact_lens' ? 'Contact Lens' : 'General'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{ color: '#ef4444', fontWeight: '600', fontSize: '14px' }}>
                        {p.days_since_reorder != null ? `${p.days_since_reorder}d` : '—'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 20px', color: '#7c93b4', fontSize: '13px' }}>
                      {formatDate(p.last_appointment_date)}
                    </td>
                    <td style={{ padding: '14px 20px', maxWidth: '220px' }}>
                      {p.last_message ? (
                        <div>
                          <div style={{ fontSize: '13px', color: '#a0b4cc', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {p.last_message}
                          </div>
                          <div style={{ fontSize: '11px', color: '#4a6080', marginTop: '2px' }}>
                            {formatDate(p.last_message_at)}
                          </div>
                        </div>
                      ) : (
                        <span style={{ color: '#4a6080', fontSize: '13px' }}>No messages yet</span>
                      )}
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <SendButton patientId={p.id} onSent={fetchData} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
