import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/client'
import { useAuth } from '../context/AuthContext'
import StatCard from '../components/StatCard'
import Spinner from '../components/Spinner'

function formatDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function formatDateTime(d) {
  if (!d) return '—'
  const date = new Date(d)
  const today = new Date()
  const isToday = date.toDateString() === today.toDateString()
  if (isToday) return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) +
    ' ' + date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
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
      background: s.bg, color: s.color,
      fontSize: '11px', fontWeight: '600',
      padding: '3px 8px', borderRadius: '20px',
      textTransform: 'uppercase', letterSpacing: '0.5px',
    }}>
      {s.label}
    </span>
  )
}

function TriggerBadge({ trigger }) {
  const isReply = trigger === 'Replied positively'
  const isAppt = trigger === 'Booked appointment'
  const color = isReply ? '#22c55e' : isAppt ? '#0891B2' : '#7c93b4'
  const bg = isReply ? 'rgba(34,197,94,0.1)' : isAppt ? 'rgba(8,145,178,0.1)' : 'rgba(124,147,180,0.1)'
  return (
    <span style={{
      background: bg, color,
      fontSize: '11px', fontWeight: '600',
      padding: '3px 8px', borderRadius: '20px',
    }}>
      {trigger}
    </span>
  )
}

function SendButton({ patientId, onSent }) {
  const [state, setState] = useState('idle')

  async function handleClick(e) {
    e.stopPropagation()
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
        background: v.bg, color: v.color, border: v.border,
        borderRadius: '6px', padding: '6px 14px',
        fontSize: '13px', fontWeight: '500',
        cursor: state === 'loading' ? 'default' : 'pointer',
        whiteSpace: 'nowrap', transition: 'all 0.2s',
      }}
    >
      {v.label}
    </button>
  )
}

// ── Shared panel shell ────────────────────────────────────────────────────────

function Panel({ title, subtitle, onClose, children }) {
  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(4,12,24,0.7)', zIndex: 100 }} />
      <div className="responsive-panel" style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: '560px',
        background: '#0a1f3a', borderLeft: '1px solid #1a3352',
        zIndex: 101, display: 'flex', flexDirection: 'column',
        boxShadow: '-8px 0 32px rgba(0,0,0,0.4)',
      }}>
        <div style={{
          padding: '20px 24px', borderBottom: '1px solid #1a3352',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0,
        }}>
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '2px' }}>{title}</h2>
            {subtitle && <p style={{ color: '#7c93b4', fontSize: '13px' }}>{subtitle}</p>}
          </div>
          <button onClick={onClose} style={{
            background: 'rgba(255,255,255,0.06)', border: '1px solid #1a3352',
            borderRadius: '8px', color: '#7c93b4', width: '34px', height: '34px',
            cursor: 'pointer', fontSize: '18px', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
          }}>×</button>
        </div>
        <div style={{ overflowY: 'auto', flex: 1, padding: '16px' }}>
          {children}
        </div>
      </div>
    </>
  )
}

function PanelEmpty({ message }) {
  return (
    <div style={{ textAlign: 'center', color: '#7c93b4', padding: '48px 24px' }}>
      <div style={{ fontSize: '28px', marginBottom: '10px' }}>✓</div>
      <div style={{ fontSize: '14px' }}>{message}</div>
    </div>
  )
}

function PanelLoading() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '48px' }}>
      <Spinner size={28} />
    </div>
  )
}

// ── Panel 1 & 2: At-risk patients ────────────────────────────────────────────

function AtRiskPanel({ mode, onClose }) {
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api('/api/dashboard/at-risk')
      .then(res => {
        const sorted = [...(res.patients || [])]
        if (mode === 'revenue') {
          sorted.sort((a, b) => b.revenue_at_risk - a.revenue_at_risk)
        }
        setPatients(sorted)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [mode])

  const totalRevenue = patients.reduce((s, p) => s + Number(p.revenue_at_risk), 0)
  const title = mode === 'revenue' ? 'Revenue at Risk' : 'Patients at Risk'
  const subtitle = loading ? null :
    mode === 'revenue'
      ? `£${totalRevenue.toLocaleString()} estimated across ${patients.length} patient${patients.length !== 1 ? 's' : ''}`
      : `${patients.length} patient${patients.length !== 1 ? 's' : ''} need re-engagement`

  return (
    <Panel title={title} subtitle={subtitle} onClose={onClose}>
      {loading ? <PanelLoading /> : patients.length === 0 ? (
        <PanelEmpty message="No at-risk patients right now" />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {patients.map(p => (
            <div key={p.id} style={{
              background: 'rgba(13,36,72,0.6)', border: '1px solid #1a3352',
              borderRadius: '10px', padding: '14px 16px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                  <div style={{ fontWeight: '600', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                  <RiskBadge status={p.risk_status} />
                </div>
                {mode === 'revenue' ? (
                  <span style={{ color: '#f59e0b', fontWeight: '700', fontSize: '15px', flexShrink: 0 }}>
                    £{Number(p.revenue_at_risk).toLocaleString()}
                  </span>
                ) : (
                  <SendButton patientId={p.id} />
                )}
              </div>
              <div style={{ display: 'flex', gap: '20px', fontSize: '12px', color: '#7c93b4' }}>
                <span>
                  <span style={{ color: '#4a6080' }}>Due: </span>
                  <span style={{ color: p.days_since_reorder > 60 ? '#ef4444' : '#f59e0b', fontWeight: '600' }}>
                    {p.days_since_reorder != null ? `${p.days_since_reorder}d` : '—'}
                  </span>
                </span>
                <span>
                  <span style={{ color: '#4a6080' }}>Last appt: </span>
                  {formatDate(p.last_appointment_date)}
                </span>
                <span style={{
                  background: p.patient_type === 'contact_lens' ? 'rgba(8,145,178,0.1)' : 'rgba(124,147,180,0.1)',
                  color: p.patient_type === 'contact_lens' ? '#0891B2' : '#7c93b4',
                  padding: '2px 7px', borderRadius: '20px', fontWeight: '600', fontSize: '11px',
                }}>
                  {p.patient_type === 'contact_lens' ? 'Contact Lens' : 'General'}
                </span>
              </div>
              {mode === 'patients' && (
                <div style={{ marginTop: '10px', fontSize: '11px', color: '#4a6080' }}>
                  Est. revenue at risk: <span style={{ color: '#f59e0b' }}>£{Number(p.revenue_at_risk).toLocaleString()}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </Panel>
  )
}

// ── Panel 3 & 4: Recovered patients ──────────────────────────────────────────

function RecoveredPanel({ mode, onClose }) {
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api('/api/dashboard/recovered')
      .then(res => setPatients(res.patients || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const totalRevenue = patients.length * 150
  const title = mode === 'revenue' ? 'Revenue Recovered' : 'Patients Recovered'
  const subtitle = loading ? null :
    mode === 'revenue'
      ? `£${totalRevenue.toLocaleString()} recovered this month from ${patients.length} patient${patients.length !== 1 ? 's' : ''}`
      : `${patients.length} patient${patients.length !== 1 ? 's' : ''} re-engaged this month`

  return (
    <Panel title={title} subtitle={subtitle} onClose={onClose}>
      {loading ? <PanelLoading /> : patients.length === 0 ? (
        <PanelEmpty message="No patients recovered yet this month" />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {patients.map(p => (
            <div key={p.id} style={{
              background: 'rgba(13,36,72,0.6)', border: '1px solid #1a3352',
              borderRadius: '10px', padding: '14px 16px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '8px' }}>
                <div style={{ fontWeight: '600', fontSize: '14px' }}>{p.name}</div>
                {mode === 'revenue' ? (
                  <span style={{ color: '#22c55e', fontWeight: '700', fontSize: '15px' }}>£150</span>
                ) : (
                  <TriggerBadge trigger={p.trigger} />
                )}
              </div>
              <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#7c93b4', alignItems: 'center' }}>
                <span>
                  <span style={{ color: '#4a6080' }}>Recovered: </span>
                  {formatDateTime(p.recovered_at)}
                </span>
                {mode === 'revenue' && (
                  <TriggerBadge trigger={p.trigger} />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </Panel>
  )
}

// ── Panels 5: WhatsApp messages this week ─────────────────────────────────────

function ChatThread({ messages }) {
  return (
    <div style={{
      padding: '16px', background: '#071829', borderRadius: '10px',
      marginTop: '2px', maxHeight: '420px', overflowY: 'auto',
      display: 'flex', flexDirection: 'column', gap: '8px',
    }}>
      {messages.length === 0 && (
        <div style={{ color: '#4a6080', fontSize: '13px', textAlign: 'center', padding: '16px' }}>No messages yet</div>
      )}
      {messages.map(msg => {
        const isOutbound = msg.direction === 'outbound'
        return (
          <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: isOutbound ? 'flex-end' : 'flex-start' }}>
            <div style={{
              maxWidth: '78%',
              background: isOutbound ? '#0e7490' : '#1a3352',
              color: isOutbound ? '#fff' : '#e2e8f0',
              borderRadius: isOutbound ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
              padding: '10px 14px', fontSize: '13px', lineHeight: '1.5', whiteSpace: 'pre-wrap',
            }}>
              {msg.message_body}
            </div>
            <div style={{ fontSize: '11px', color: '#4a6080', marginTop: '3px', paddingLeft: '2px', paddingRight: '2px' }}>
              {formatDateTime(msg.sent_at)}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function MessagesPanel({ onClose }) {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedPatientId, setExpandedPatientId] = useState(null)
  const [threads, setThreads] = useState({})
  const [threadLoading, setThreadLoading] = useState(null)

  useEffect(() => {
    api('/api/messages/sent-this-week')
      .then(res => setMessages(res.messages || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  async function toggleThread(patientId) {
    if (expandedPatientId === patientId) { setExpandedPatientId(null); return }
    setExpandedPatientId(patientId)
    if (!threads[patientId]) {
      setThreadLoading(patientId)
      try {
        const res = await api(`/api/messages/thread/${patientId}`)
        setThreads(prev => ({ ...prev, [patientId]: res.messages || [] }))
      } catch {
        setThreads(prev => ({ ...prev, [patientId]: [] }))
      }
      setThreadLoading(null)
    }
  }

  const patientMap = {}
  for (const msg of messages) {
    if (!patientMap[msg.patient_id]) patientMap[msg.patient_id] = msg
  }
  const patients = Object.values(patientMap)

  return (
    <Panel
      title="WhatsApp Messages Sent This Week"
      subtitle={loading ? null : `${messages.length} message${messages.length !== 1 ? 's' : ''} · ${patients.length} patient${patients.length !== 1 ? 's' : ''}`}
      onClose={onClose}
    >
      {loading ? <PanelLoading /> : patients.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#7c93b4', padding: '48px 24px' }}>
          <div style={{ fontSize: '28px', marginBottom: '10px' }}>💬</div>
          <div style={{ fontSize: '14px' }}>No messages sent this week yet</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {patients.map(msg => {
            const isExpanded = expandedPatientId === msg.patient_id
            const isLoadingThread = threadLoading === msg.patient_id
            return (
              <div key={msg.patient_id}>
                <div
                  onClick={() => toggleThread(msg.patient_id)}
                  style={{
                    background: isExpanded ? '#0D2448' : 'rgba(13,36,72,0.6)',
                    border: `1px solid ${isExpanded ? '#0891B2' : '#1a3352'}`,
                    borderRadius: isExpanded ? '10px 10px 0 0' : '10px',
                    padding: '14px 16px', cursor: 'pointer', transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { if (!isExpanded) e.currentTarget.style.borderColor = '#2a4a72' }}
                  onMouseLeave={e => { if (!isExpanded) e.currentTarget.style.borderColor = '#1a3352' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: '600', fontSize: '14px', marginBottom: '4px' }}>{msg.patient_name}</div>
                      <div style={{ fontSize: '13px', color: '#7c93b4', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {msg.message_body}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                      <span style={{ fontSize: '11px', color: '#4a6080' }}>{formatDateTime(msg.sent_at)}</span>
                      <span style={{ color: '#7c93b4', fontSize: '12px' }}>{isExpanded ? '▲' : '▼'}</span>
                    </div>
                  </div>
                </div>
                {isExpanded && (
                  <div style={{ border: '1px solid #0891B2', borderTop: 'none', borderRadius: '0 0 10px 10px', overflow: 'hidden' }}>
                    {isLoadingThread ? (
                      <div style={{ display: 'flex', justifyContent: 'center', padding: '32px', background: '#071829' }}>
                        <Spinner size={22} />
                      </div>
                    ) : (
                      <ChatThread messages={threads[msg.patient_id] || []} />
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </Panel>
  )
}

// ── Panel 6: Reviews requested this month ─────────────────────────────────────

function ReviewsPanel({ onClose }) {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api('/api/reviews/requests')
      .then(res => setRequests(res.requests || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <Panel
      title="Reviews Requested This Month"
      subtitle={loading ? null : `${requests.length} patient${requests.length !== 1 ? 's' : ''} sent a review request`}
      onClose={onClose}
    >
      {loading ? <PanelLoading /> : requests.length === 0 ? (
        <PanelEmpty message="No review requests sent this month yet" />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {requests.map(r => (
            <div key={r.id || r.patient_id} style={{
              background: 'rgba(13,36,72,0.6)', border: '1px solid #1a3352',
              borderRadius: '10px', padding: '14px 16px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '6px' }}>
                <div style={{ fontWeight: '600', fontSize: '14px' }}>{r.patient_name}</div>
                <span style={{
                  background: r.message_type === 'follow_up' ? 'rgba(245,158,11,0.12)' : 'rgba(8,145,178,0.12)',
                  color: r.message_type === 'follow_up' ? '#f59e0b' : '#0891B2',
                  fontSize: '11px', fontWeight: '600', padding: '3px 8px', borderRadius: '20px',
                }}>
                  {r.message_type === 'follow_up' ? 'Follow-up' : 'Initial'}
                </span>
              </div>
              <div style={{ fontSize: '12px', color: '#7c93b4' }}>
                <span style={{ color: '#4a6080' }}>Sent: </span>
                {formatDate(r.sent_at)}
              </div>
            </div>
          ))}
        </div>
      )}
    </Panel>
  )
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const { practice } = useAuth()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [reviewsCount, setReviewsCount] = useState(null)
  const [error, setError] = useState('')
  const [panel, setPanel] = useState(null) // null | 'at-risk' | 'revenue-risk' | 'recovered' | 'revenue-recovered' | 'messages' | 'reviews'

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

  useEffect(() => {
    fetchData()
    api('/api/reviews/stats')
      .then(res => setReviewsCount(res.review_requests_sent_this_month ?? 0))
      .catch(() => setReviewsCount(0))
  }, [])

  const summary = data?.summary || {}
  const highRisk = data?.high_risk_patients || []

  return (
    <div>
      {panel === 'at-risk' && <AtRiskPanel mode="patients" onClose={() => setPanel(null)} />}
      {panel === 'revenue-risk' && <AtRiskPanel mode="revenue" onClose={() => setPanel(null)} />}
      {panel === 'recovered' && <RecoveredPanel mode="patients" onClose={() => setPanel(null)} />}
      {panel === 'revenue-recovered' && <RecoveredPanel mode="revenue" onClose={() => setPanel(null)} />}
      {panel === 'messages' && <MessagesPanel onClose={() => setPanel(null)} />}
      {panel === 'reviews' && <ReviewsPanel onClose={() => setPanel(null)} />}

      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '4px' }}>Dashboard</h1>
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
      <div className="stat-grid">
        <StatCard
          label="Patients at risk"
          value={loading ? '—' : summary.patients_at_risk ?? 0}
          sub="This month · click to view"
          color="#ef4444"
          loading={loading}
          onClick={() => setPanel('at-risk')}
        />
        <StatCard
          label="Revenue at risk"
          value={loading ? '—' : `£${(summary.revenue_at_risk ?? 0).toLocaleString()}`}
          sub="Click to view breakdown"
          color="#f59e0b"
          loading={loading}
          onClick={() => setPanel('revenue-risk')}
        />
        <StatCard
          label="Patients recovered"
          value={loading ? '—' : summary.patients_recovered ?? 0}
          sub="This month · click to view"
          color="#22c55e"
          loading={loading}
          onClick={() => setPanel('recovered')}
        />
        <StatCard
          label="Revenue recovered"
          value={loading ? '—' : `£${(summary.revenue_recovered ?? 0).toLocaleString()}`}
          sub="This month · click to view"
          color="#22c55e"
          loading={loading}
          onClick={() => setPanel('revenue-recovered')}
        />
        <StatCard
          label="Reviews requested"
          value={reviewsCount === null ? '—' : reviewsCount}
          sub="this month"
          color="#F59E0B"
          loading={reviewsCount === null}
          onClick={() => setPanel('reviews')}
        />
      </div>

      {/* Secondary stats */}
      {!loading && (
        <div className="secondary-stats">
          <div
            onClick={() => navigate('/alerts')}
            style={{
              background: '#0D2448', border: '1px solid #1a3352', borderRadius: '10px',
              padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px',
              cursor: 'pointer', transition: 'border-color 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#f59e0b'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#1a3352'}
          >
            <span style={{ fontSize: '22px', fontWeight: '700', color: '#f59e0b' }}>{summary.unresolved_alerts ?? 0}</span>
            <span style={{ color: '#7c93b4', fontSize: '14px' }}>Unresolved urgent alerts</span>
            <span style={{ color: '#f59e0b', fontSize: '12px', marginLeft: 'auto' }}>View →</span>
          </div>
          <div
            onClick={() => setPanel('messages')}
            style={{
              background: '#0D2448', border: '1px solid #1a3352', borderRadius: '10px',
              padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px',
              cursor: 'pointer', transition: 'border-color 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#0891B2'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#1a3352'}
          >
            <span style={{ fontSize: '22px', fontWeight: '700', color: '#0891B2' }}>{summary.messages_sent_this_week ?? 0}</span>
            <span style={{ color: '#7c93b4', fontSize: '14px' }}>WhatsApp messages sent this week</span>
            <span style={{ color: '#0891B2', fontSize: '12px', marginLeft: 'auto' }}>View →</span>
          </div>
        </div>
      )}

      {/* High Risk Patients Table */}
      <div style={{ background: '#0D2448', border: '1px solid #1a3352', borderRadius: '14px', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #1a3352', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: '600' }}>High Risk Patients</h2>
            <p style={{ color: '#7c93b4', fontSize: '13px', marginTop: '2px' }}>Patients requiring immediate re-engagement</p>
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
                  {['Patient', 'Type', 'Days Since Visit', 'Last Appointment', 'Last Message', ''].map(h => (
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
                    style={{ borderBottom: i < highRisk.length - 1 ? '1px solid #1a3352' : 'none', transition: 'background 0.1s' }}
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
                        fontSize: '11px', fontWeight: '600', padding: '3px 8px', borderRadius: '20px',
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
