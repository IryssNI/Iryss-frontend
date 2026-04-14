import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/client'
import { useAuth } from '../context/AuthContext'
import Spinner from '../components/Spinner'

// ─ Utility Functions ────────────────────────────────────────────────────────

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

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

function getInitials(name) {
  return name
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
}

function getAvatarGradient(risk) {
  if (risk === 'high' || risk > 50) return 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)'
  if (risk === 'medium' || (risk > 28 && risk <= 50)) return 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)'
  return 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
}

// ─ Badge Components ────────────────────────────────────────────────────────

function RiskBadge({ status }) {
  const map = {
    high: { bg: '#FEE2E2', color: '#DC2626', label: 'High' },
    medium: { bg: '#FEF3C7', color: '#D97706', label: 'Medium' },
    low: { bg: '#DCFCE7', color: '#059669', label: 'Low' },
  }
  const s = map[status] || map.low
  return (
    <span style={{
      background: s.bg, color: s.color,
      fontSize: '11px', fontWeight: '600',
      padding: '4px 10px', borderRadius: '12px',
      textTransform: 'uppercase', letterSpacing: '0.5px',
    }}>
      {s.label}
    </span>
  )
}

function TriggerBadge({ trigger }) {
  const isReply = trigger === 'Replied positively'
  const isAppt = trigger === 'Booked appointment'
  const color = isReply ? '#059669' : isAppt ? '#0891B2' : '#94A3B8'
  const bg = isReply ? '#DCFCE7' : isAppt ? '#CFFAFE' : '#F1F5F9'
  return (
    <span style={{
      background: bg, color,
      fontSize: '11px', fontWeight: '600',
      padding: '4px 10px', borderRadius: '12px',
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
    idle: { bg: 'linear-gradient(135deg, #0891B2 0%, #0E7490 100%)', color: '#FFFFFF', label: 'Send WhatsApp', shadow: '0 4px 12px rgba(8, 145, 178, 0.25)' },
    loading: { bg: '#CBD5E1', color: '#64748B', label: 'Sending…', shadow: '0 2px 6px rgba(0,0,0,0.08)' },
    sent: { bg: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', color: '#FFFFFF', label: 'Sent ✓', shadow: '0 4px 12px rgba(16, 185, 129, 0.25)' },
    error: { bg: '#FEE2E2', color: '#DC2626', label: 'Failed', shadow: '0 2px 6px rgba(0,0,0,0.08)' },
  }
  const v = variants[state]

  return (
    <button
      onClick={handleClick}
      disabled={state === 'loading'}
      style={{
        background: v.bg, color: v.color,
        borderRadius: '8px', padding: '8px 16px',
        fontSize: '13px', fontWeight: '600',
        cursor: state === 'loading' ? 'default' : 'pointer',
        whiteSpace: 'nowrap', transition: 'all 0.2s',
        border: 'none',
        boxShadow: v.shadow,
        transform: state === 'loading' ? 'none' : 'translateY(0)',
      }}
      onMouseEnter={e => {
        if (state === 'idle' || state === 'error') {
          e.currentTarget.style.transform = 'translateY(-2px)'
          e.currentTarget.style.boxShadow = state === 'idle'
            ? '0 8px 20px rgba(8, 145, 178, 0.35)'
            : '0 4px 12px rgba(0,0,0,0.12)'
        }
      }}
      onMouseLeave={e => {
        if (state === 'idle' || state === 'error') {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = v.shadow
        }
      }}
    >
      {v.label}
    </button>
  )
}

// ─ Shared Panel Shell ──────────────────────────────────────────────────────

function Panel({ title, subtitle, onClose, children }) {
  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0, 0, 0, 0.4)', zIndex: 100 }} />
      <div className="responsive-panel" style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: '560px',
        background: '#FFFFFF', borderLeft: '1px solid #E2E8F0',
        zIndex: 101, display: 'flex', flexDirection: 'column',
        boxShadow: '-8px 0 32px rgba(0, 0, 0, 0.12)',
      }}>
        <div style={{
          padding: '24px', borderBottom: '1px solid #E2E8F0',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0,
        }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '4px', color: '#0F172A' }}>{title}</h2>
            {subtitle && <p style={{ color: '#64748B', fontSize: '13px' }}>{subtitle}</p>}
          </div>
          <button onClick={onClose} style={{
            background: '#F1F5F9', border: 'none',
            borderRadius: '8px', color: '#64748B', width: '36px', height: '36px',
            cursor: 'pointer', fontSize: '20px', display: 'flex',
            alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#E2E8F0'; e.currentTarget.style.color = '#475569' }}
          onMouseLeave={e => { e.currentTarget.style.background = '#F1F5F9'; e.currentTarget.style.color = '#64748B' }}
          >×</button>
        </div>
        <div style={{ overflowY: 'auto', flex: 1, padding: '20px 24px' }}>
          {children}
        </div>
      </div>
    </>
  )
}

function PanelEmpty({ message }) {
  return (
    <div style={{ textAlign: 'center', color: '#94A3B8', padding: '48px 24px' }}>
      <div style={{ fontSize: '32px', marginBottom: '12px' }}>✓</div>
      <div style={{ fontSize: '14px', color: '#64748B' }}>{message}</div>
    </div>
  )
}

function PanelLoading() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '48px' }}>
      <Spinner size={28} color="#0891B2" />
    </div>
  )
}

// ─ Panel 1 & 2: At-Risk Patients ──────────────────────────────────────────

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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {patients.map(p => (
            <div key={p.id} style={{
              background: '#F8FAFB', border: '1px solid #E2E8F0',
              borderRadius: '12px', padding: '16px', transition: 'all 0.2s',
              cursor: 'pointer'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#0891B2'
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(8, 145, 178, 0.12)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = '#E2E8F0'
              e.currentTarget.style.boxShadow = 'none'
            }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                  <div style={{ fontWeight: '600', fontSize: '14px', color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                  <RiskBadge status={p.risk_status} />
                </div>
                {mode === 'revenue' ? (
                  <span style={{ color: '#F59E0B', fontWeight: '700', fontSize: '15px', flexShrink: 0 }}>
                    £{Number(p.revenue_at_risk).toLocaleString()}
                  </span>
                ) : (
                  <SendButton patientId={p.id} />
                )}
              </div>
              <div style={{ display: 'flex', gap: '20px', fontSize: '13px', color: '#64748B', flexWrap: 'wrap' }}>
                <span>
                  <span style={{ color: '#94A3B8' }}>Due: </span>
                  <span style={{ color: p.days_since_reorder > 60 ? '#DC2626' : '#D97706', fontWeight: '600' }}>
                    {p.days_since_reorder != null ? `${p.days_since_reorder}d` : '—'}
                  </span>
                </span>
                <span>
                  <span style={{ color: '#94A3B8' }}>Last appt: </span>
                  <span style={{ color: '#475569' }}>{formatDate(p.last_appointment_date)}</span>
                </span>
                <span style={{
                  background: p.patient_type === 'contact_lens' ? '#CFFAFE' : '#F1F5F9',
                  color: p.patient_type === 'contact_lens' ? '#0891B2' : '#64748B',
                  padding: '4px 10px', borderRadius: '12px', fontWeight: '600', fontSize: '11px',
                }}>
                  {p.patient_type === 'contact_lens' ? 'Contact Lens' : 'General'}
                </span>
              </div>
              {mode === 'patients' && (
                <div style={{ marginTop: '12px', fontSize: '12px', color: '#94A3B8' }}>
                  Est. revenue at risk: <span style={{ color: '#F59E0B', fontWeight: '600' }}>£{Number(p.revenue_at_risk).toLocaleString()}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </Panel>
  )
}

// ─ Panel 3 & 4: Recovered Patients ───────────────────────────────────────────

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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {patients.map(p => (
            <div key={p.id} style={{
              background: '#F8FAFB', border: '1px solid #E2E8F0',
              borderRadius: '12px', padding: '16px', transition: 'all 0.2s'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#0891B2'
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(8, 145, 178, 0.12)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = '#E2E8F0'
              e.currentTarget.style.boxShadow = 'none'
            }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '12px' }}>
                <div style={{ fontWeight: '600', fontSize: '14px', color: '#0F172A' }}>{p.name}</div>
                {mode === 'revenue' ? (
                  <span style={{ color: '#10B981', fontWeight: '700', fontSize: '15px' }}>£150</span>
                ) : (
                  <TriggerBadge trigger={p.trigger} />
                )}
              </div>
              <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: '#64748B', alignItems: 'center', flexWrap: 'wrap' }}>
                <span>
                  <span style={{ color: '#94A3B8' }}>Recovered: </span>
                  <span style={{ color: '#475569' }}>{formatDateTime(p.recovered_at)}</span>
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

// ─ Panel 5: WhatsApp Messages This Week ────────────────────────────────────

function ChatThread({ messages }) {
  return (
    <div style={{
      padding: '16px', background: '#F8FAFB', borderRadius: '0 0 12px 12px',
      borderTop: '1px solid #E2E8F0', maxHeight: '420px', overflowY: 'auto',
      display: 'flex', flexDirection: 'column', gap: '8px',
    }}>
      {messages.length === 0 && (
        <div style={{ color: '#94A3B8', fontSize: '13px', textAlign: 'center', padding: '16px' }}>No messages yet</div>
      )}
      {messages.map(msg => {
        const isOutbound = msg.direction === 'outbound'
        return (
          <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: isOutbound ? 'flex-end' : 'flex-start' }}>
            <div style={{
              maxWidth: '78%',
              background: isOutbound ? '#0891B2' : '#E2E8F0',
              color: isOutbound ? '#FFFFFF' : '#0F172A',
              borderRadius: isOutbound ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
              padding: '12px 14px', fontSize: '13px', lineHeight: '1.5', whiteSpace: 'pre-wrap',
            }}>
              {msg.message_body}
            </div>
            <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '4px', paddingLeft: '2px', paddingRight: '2px' }}>
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
        <div style={{ textAlign: 'center', color: '#94A3B8', padding: '48px 24px' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>💬</div>
          <div style={{ fontSize: '14px', color: '#64748B' }}>No messages sent this week yet</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {patients.map(msg => {
            const isExpanded = expandedPatientId === msg.patient_id
            const isLoadingThread = threadLoading === msg.patient_id
            return (
              <div key={msg.patient_id}>
                <div
                  onClick={() => toggleThread(msg.patient_id)}
                  style={{
                    background: isExpanded ? '#F0F9FF' : '#FFFFFF',
                    border: `1px solid ${isExpanded ? '#0891B2' : '#E2E8F0'}`,
                    borderRadius: isExpanded ? '12px 12px 0 0' : '12px',
                    padding: '16px', cursor: 'pointer', transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { if (!isExpanded) e.currentTarget.style.borderColor = '#CBD5E1' }}
                  onMouseLeave={e => { if (!isExpanded) e.currentTarget.style.borderColor = '#E2E8F0' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: '600', fontSize: '14px', marginBottom: '6px', color: '#0F172A' }}>{msg.patient_name}</div>
                      <div style={{ fontSize: '13px', color: '#64748B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {msg.message_body}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                      <span style={{ fontSize: '11px', color: '#94A3B8' }}>{formatDateTime(msg.sent_at)}</span>
                      <span style={{ color: '#64748B', fontSize: '12px' }}>{isExpanded ? '▲' : '▼'}</span>
                    </div>
                  </div>
                </div>
                {isExpanded && (
                  <div style={{ border: '1px solid #0891B2', borderTop: 'none', borderRadius: '0 0 12px 12px', overflow: 'hidden' }}>
                    {isLoadingThread ? (
                      <div style={{ display: 'flex', justifyContent: 'center', padding: '32px', background: '#F8FAFB' }}>
                        <Spinner size={22} color="#0891B2" />
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


// ─ Practice Score Ring (SVG) ───────────────────────────────────────────────

function PracticeScoreRing({ score }) {
  const circumference = 2 * Math.PI * 54
  const strokeDashoffset = circumference - (score / 100) * circumference

  let color = '#10B981' // green >=70
  let label = 'Excellent'
  if (score < 60) {
    color = '#EF4444'
    label = 'Needs attention'
  } else if (score < 80) {
    color = '#F59E0B'
    label = score < 70 ? 'Needs attention' : 'Good'
  } else if (score >= 90) {
    label = 'Excellent'
  } else {
    label = 'Great'
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
      <div style={{ fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#94A3B8' }}>Practice Health</div>
      <svg width="120" height="120" viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
        {/* Background ring */}
        <circle cx="60" cy="60" r="54" fill="none" stroke="#F1F5F9" strokeWidth="10" />
        {/* Active ring with animation */}
        <circle
          cx="60" cy="60" r="54" fill="none" stroke={color} strokeWidth="10"
          strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
        />
      </svg>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '40px', fontWeight: '800', color: '#0F172A', lineHeight: '1' }}>{score}</div>
        <div style={{ fontSize: '11px', fontWeight: '600', color, marginTop: '4px' }}>{label}</div>
      </div>
    </div>
  )
}

// ─ Stat Card Component ──────────────────────────────────────────────────────

function MetricCard({ label, value, sub, color, onClick, trend }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '16px',
        padding: '20px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = color
        e.currentTarget.style.boxShadow = `0 8px 24px rgba(${color === '#0891B2' ? '8, 145, 178' : '239, 68, 68'}, 0.12)`
        e.currentTarget.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = '#E2E8F0'
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.04)'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#94A3B8', marginBottom: '12px' }}>
        {label}
      </div>
      <div style={{ fontSize: '32px', fontWeight: '800', color: '#0F172A', marginBottom: '8px', lineHeight: '1' }}>
        {value}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{
          background: color === '#EF4444' ? '#FEE2E2' : color === '#F59E0B' ? '#FEF3C7' : '#DCFCE7',
          color: color === '#EF4444' ? '#DC2626' : color === '#F59E0B' ? '#D97706' : '#059669',
          fontSize: '11px', fontWeight: '600', padding: '4px 8px', borderRadius: '6px'
        }}>
          {trend || 'This month'}
        </div>
        <span style={{ color: '#94A3B8', fontSize: '12px' }}>→</span>
      </div>
    </div>
  )
}

// ─ Placeholder Card Component ──────────────────────────────────────────────

function PlaceholderCard({ icon, title, subtitle }) {
  return (
    <div style={{
      background: '#FFFFFF',
      border: '1px solid #E2E8F0',
      borderRadius: '16px',
      padding: '24px',
      textAlign: 'center',
      opacity: 0.6,
    }}>
      <div style={{ fontSize: '32px', marginBottom: '12px' }}>{icon}</div>
      <div style={{ fontSize: '14px', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>{title}</div>
      <div style={{ fontSize: '13px', color: '#94A3B8' }}>{subtitle}</div>
    </div>
  )
}

// ─ Main Dashboard Component ────────────────────────────────────────────────

export default function Dashboard() {
  const { practice } = useAuth()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [panel, setPanel] = useState(null)

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
  }, [])

  const summary = data?.summary || {}
  const highRisk = data?.high_risk_patients || []

  const practiceScore = Math.round(
    (summary.patients_recovered / Math.max(summary.patients_at_risk + summary.patients_recovered, 1)) * 100
  )

  const firstName = practice?.name?.split(' ')[0] || 'there'
  const greeting = getGreeting()
  const today = new Date()
  const dateStr = today.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <div style={{ background: '#F8FAFB', minHeight: '100vh' }}>
      {/* Panel overlays */}
      {panel === 'at-risk' && <AtRiskPanel mode="patients" onClose={() => setPanel(null)} />}
      {panel === 'revenue-risk' && <AtRiskPanel mode="revenue" onClose={() => setPanel(null)} />}
      {panel === 'recovered' && <RecoveredPanel mode="patients" onClose={() => setPanel(null)} />}
      {panel === 'revenue-recovered' && <RecoveredPanel mode="revenue" onClose={() => setPanel(null)} />}
      {panel === 'messages' && <MessagesPanel onClose={() => setPanel(null)} />}

      <div style={{ padding: '32px' }}>
        {/* Greeting Header */}
        <div style={{ marginBottom: '32px', animation: 'fadeInUp 0.5s ease-out' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#0F172A', marginBottom: '4px' }}>
            {greeting}, {firstName}
          </h1>
          <p style={{ fontSize: '14px', color: '#64748B' }}>{dateStr}</p>
        </div>

        {/* Error */}
        {error && (
          <div style={{ background: '#FEE2E2', border: '1px solid #FECACA', borderRadius: '12px', padding: '16px', color: '#DC2626', marginBottom: '24px', fontSize: '13px' }}>
            {error}
          </div>
        )}

        {/* Urgent Alert Banner */}
        {!loading && summary.unresolved_alerts > 0 && (
          <div
            onClick={() => navigate('/alerts')}
            style={{
              background: '#FFFBEB',
              border: '1px solid #FCD34D',
              borderRadius: '12px',
              padding: '16px 20px',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#F59E0B'
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(245, 158, 11, 0.15)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = '#FCD34D'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            <div style={{
              width: '8px', height: '8px', background: '#F59E0B', borderRadius: '50%',
              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
            }} />
            <span style={{ color: '#92400E', fontSize: '14px', fontWeight: '600', flex: 1 }}>
              {summary.unresolved_alerts} patient{summary.unresolved_alerts !== 1 ? 's' : ''} replied urgently — they need you today
            </span>
            <span style={{ color: '#F59E0B', fontSize: '12px', fontWeight: '600' }}>View →</span>
          </div>
        )}

        {/* Practice Score + 4 Metrics Grid */}
        {!loading && (
          <div style={{ marginBottom: '32px', animation: 'fadeInUp 0.5s ease-out 0.1s both' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'auto 1fr 1fr',
              gap: '20px',
              alignItems: 'start',
            }}>
              {/* Practice Score Circle */}
              <div style={{
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '16px',
                padding: '24px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '300px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
              }}>
                <PracticeScoreRing score={practiceScore} />
              </div>

              {/* Metrics Grid 2x2 */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <MetricCard
                  label="Patients at Risk"
                  value={summary.patients_at_risk ?? 0}
                  color="#EF4444"
                  onClick={() => setPanel('at-risk')}
                />
                <MetricCard
                  label="Revenue at Risk"
                  value={`£${(summary.revenue_at_risk ?? 0).toLocaleString()}`}
                  color="#F59E0B"
                  onClick={() => setPanel('revenue-risk')}
                />
                <MetricCard
                  label="Patients Recovered"
                  value={summary.patients_recovered ?? 0}
                  color="#10B981"
                  onClick={() => setPanel('recovered')}
                />
                <MetricCard
                  label="Revenue Recovered"
                  value={`£${(summary.revenue_recovered ?? 0).toLocaleString()}`}
                  color="#10B981"
                  onClick={() => setPanel('revenue-recovered')}
                />
              </div>
            </div>
          </div>
        )}

        {/* AI Insight Bar */}
        <div style={{
          background: 'linear-gradient(135deg, #CFFAFE 0%, #A5F3FC 100%)',
          border: '1px solid #22D3EE',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '32px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          animation: 'fadeInUp 0.5s ease-out 0.2s both',
        }}>
          <div style={{ fontSize: '24px' }}>✨</div>
          <div>
            <div style={{ fontSize: '13px', color: '#155E75', fontWeight: '600', marginBottom: '2px' }}>AI Insight</div>
            <div style={{ fontSize: '13px', color: '#0E7490' }}>
              12 contact lens patients are overdue by 30+ days. Reaching out could recover an estimated £1,800 in revenue.
            </div>
          </div>
        </div>

        {/* Today's Schedule & Contact Lens Retention Placeholders */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px', animation: 'fadeInUp 0.5s ease-out 0.3s both' }}>
          <PlaceholderCard icon="📅" title="Today's Schedule" subtitle="Coming soon — track appointments, fill rates, and no-shows" />
          <PlaceholderCard icon="👁" title="Contact Lens Retention" subtitle="Coming soon — prevent dropouts with automated milestone check-ins" />
        </div>

        {/* Needs Your Attention Table */}
        <div style={{
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
          animation: 'fadeInUp 0.5s ease-out 0.4s both',
        }}>
          <div style={{ padding: '24px', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#0F172A', marginBottom: '2px' }}>Needs Your Attention</h2>
              <p style={{ fontSize: '13px', color: '#64748B' }}>High-risk patients — act now to retain them</p>
            </div>
            {!loading && (
              <span style={{ background: '#FEE2E2', color: '#DC2626', fontSize: '12px', fontWeight: '700', padding: '6px 12px', borderRadius: '12px' }}>
                {highRisk.length} patient{highRisk.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '48px' }}>
              <Spinner size={32} color="#0891B2" />
            </div>
          ) : highRisk.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>✓</div>
              <div style={{ fontSize: '15px', fontWeight: '600', color: '#10B981', marginBottom: '4px' }}>No high risk patients right now</div>
              <div style={{ fontSize: '13px', color: '#94A3B8' }}>Your retention campaigns are working well</div>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #E2E8F0', background: '#F8FAFB' }}>
                    {['Patient', 'Type', 'Days Overdue', 'Last Appointment', ''].map(h => (
                      <th key={h} style={{
                        padding: '14px 20px',
                        textAlign: 'left',
                        fontSize: '11px',
                        fontWeight: '700',
                        color: '#94A3B8',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        whiteSpace: 'nowrap'
                      }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {highRisk.map((p, i) => {
                    const daysOverdue = p.days_since_reorder || 0
                    const riskLevel = daysOverdue > 50 ? 'high' : daysOverdue > 28 ? 'medium' : 'low'

                    return (
                      <tr
                        key={p.id}
                        style={{
                          borderBottom: i < highRisk.length - 1 ? '1px solid #E2E8F0' : 'none',
                          transition: 'background 0.2s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#F8FAFB'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <td style={{ padding: '16px 20px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '50%',
                              background: getAvatarGradient(riskLevel),
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#FFFFFF',
                              fontWeight: '700',
                              fontSize: '12px',
                            }}>
                              {getInitials(p.name)}
                            </div>
                            <div style={{ fontWeight: '600', fontSize: '14px', color: '#0F172A' }}>{p.name}</div>
                          </div>
                        </td>
                        <td style={{ padding: '16px 20px' }}>
                          <span style={{
                            background: p.patient_type === 'contact_lens' ? '#CFFAFE' : '#F1F5F9',
                            color: p.patient_type === 'contact_lens' ? '#0891B2' : '#64748B',
                            fontSize: '11px',
                            fontWeight: '700',
                            padding: '4px 10px',
                            borderRadius: '12px',
                          }}>
                            {p.patient_type === 'contact_lens' ? 'Contact Lens' : 'General'}
                          </span>
                        </td>
                        <td style={{ padding: '16px 20px' }}>
                          <span style={{
                            color: daysOverdue > 42 ? '#DC2626' : daysOverdue > 28 ? '#D97706' : '#64748B',
                            fontWeight: '700',
                            fontSize: '14px',
                          }}>
                            {daysOverdue > 0 ? `${daysOverdue}d` : '—'}
                          </span>
                        </td>
                        <td style={{ padding: '16px 20px', color: '#64748B', fontSize: '13px' }}>
                          {formatDate(p.last_appointment_date)}
                        </td>
                        <td style={{ padding: '16px 20px' }}>
                          <SendButton patientId={p.id} onSent={fetchData} />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  )
}
