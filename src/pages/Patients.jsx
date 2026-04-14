// rebuild
import { useEffect, useState } from 'react'
import { api } from '../api/client'
import Spinner from '../components/Spinner'

function formatDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function getRiskGradient(status) {
  const gradients = {
    high: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
    medium: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
    low: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
  }
  return gradients[status] || gradients.low
}

function RiskBadge({ status }) {
  const map = {
    high: { bg: '#FEF2F2', color: '#EF4444', label: 'High' },
    medium: { bg: '#FFFBEB', color: '#D97706', label: 'Medium' },
    low: { bg: '#ECFDF5', color: '#10B981', label: 'Low' },
  }
  const s = map[status] || map.low
  return (
    <span style={{
      background: s.bg, color: s.color,
      fontSize: '12px', fontWeight: '600',
      padding: '6px 12px', borderRadius: '6px',
      whiteSpace: 'nowrap',
    }}>
      {s.label}
    </span>
  )
}

function CheckinButton({ patientId }) {
  const [state, setState] = useState('idle')

  async function handleClick(e) {
    e.stopPropagation()
    setState('loading')
    try {
      await api(`/api/patients/${patientId}/send-checkin`, { method: 'POST' })
      setState('sent')
    } catch {
      setState('error')
    }
  }

  if (state === 'sent') {
    return <span style={{ fontSize: '13px', color: '#10B981', whiteSpace: 'nowrap', fontWeight: '500' }}>Sent ✓</span>
  }

  if (state === 'error') {
    return (
      <span
        onClick={handleClick}
        style={{ fontSize: '13px', color: '#EF4444', cursor: 'pointer', whiteSpace: 'nowrap', fontWeight: '500' }}
        title="Click to retry"
      >
        Failed — try again
      </span>
    )
  }

  return (
    <button
      onClick={handleClick}
      disabled={state === 'loading'}
      style={{
        background: state === 'loading' ? 'rgba(8,145,178,0.06)' : 'transparent',
        border: '1.5px solid rgba(8,145,178,0.25)',
        borderRadius: '8px',
        color: '#0891B2',
        fontSize: '13px',
        fontWeight: '600',
        padding: '6px 14px',
        cursor: state === 'loading' ? 'default' : 'pointer',
        whiteSpace: 'nowrap',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        opacity: state === 'loading' ? 0.7 : 1,
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={(e) => {
        if (state !== 'loading') {
          e.currentTarget.style.background = 'rgba(8,145,178,0.06)'
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent'
      }}
    >
      {state === 'loading' ? (
        <><span style={{ width: '12px', height: '12px', border: '2px solid rgba(8,145,178,0.3)', borderTopColor: '#0891B2', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.6s linear infinite' }} />Sending…</>
      ) : '👋 Check in'}
    </button>
  )
}

const FILTERS = [
  { label: 'All', value: '' },
  { label: 'High Risk', value: 'high' },
  { label: 'Medium Risk', value: 'medium' },
  { label: 'Low Risk', value: 'low' },
]

export default function Patients() {
  const [patients, setPatients] = useState([])
  const [total, setTotal] = useState(0)
  const [filter, setFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const limit = 25

  async function fetchPatients(riskStatus = filter, pg = page) {
    setLoading(true)
    setError('')
    try {
      const params = new URLSearchParams({ page: pg, limit })
      if (riskStatus) params.append('risk_status', riskStatus)
      const res = await api(`/api/patients?${params}`)
      setPatients(res.patients)
      setTotal(res.total)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchPatients(filter, page) }, [filter, page])

  function handleFilterChange(v) {
    setFilter(v)
    setPage(1)
  }

  const totalPages = Math.ceil(total / limit)

  return (
    <div style={{ background: '#F8FAFB', minHeight: '100vh', padding: '32px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#0F172A', marginBottom: '8px', marginTop: '0' }}>Patients</h1>
        <p style={{ color: '#64748B', fontSize: '14px', margin: '0' }}>{total} patients total</p>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {FILTERS.map(f => (
          <button
            key={f.value}
            onClick={() => handleFilterChange(f.value)}
            style={{
              padding: '10px 18px',
              borderRadius: '20px',
              border: filter === f.value ? '1px solid rgba(8,145,178,0.2)' : '1px solid #E2E8F0',
              background: filter === f.value ? 'rgba(8,145,178,0.08)' : '#FFFFFF',
              color: filter === f.value ? '#0891B2' : '#64748B',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            }}
            onMouseEnter={(e) => {
              if (filter !== f.value) {
                e.currentTarget.style.transform = 'translateY(-1px)'
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(15, 23, 42, 0.07)'
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {error && (
        <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: '12px', padding: '14px 16px', color: '#EF4444', marginBottom: '24px', fontSize: '13px', fontWeight: '500' }}>
          {error}
        </div>
      )}

      <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(15, 23, 42, 0.08)' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '64px 32px', minHeight: '300px' }}>
            <Spinner size={32} />
          </div>
        ) : patients.length === 0 ? (
          <div style={{ padding: '48px 32px', textAlign: 'center', color: '#94A3B8', fontSize: '14px' }}>
            No patients found for this filter.
          </div>
        ) : (
          <>
            {/* ── Desktop table ── */}
            <div className="desktop-only" style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#F8FAFB', borderBottom: '1px solid #E2E8F0' }}>
                    {['Patient', 'Type', 'Risk', 'Days Overdue', 'Last Appointment', ''].map(h => (
                      <th key={h} style={{ padding: '14px 18px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {patients.map((p, i) => (
                    <tr
                      key={p.id}
                      style={{ borderBottom: i < patients.length - 1 ? '1px solid #E2E8F0' : 'none', transition: 'background 0.15s ease' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(8,145,178,0.02)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '10px',
                            background: getRiskGradient(p.risk_status),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#FFFFFF',
                            fontSize: '13px',
                            fontWeight: '700',
                            flexShrink: 0,
                          }}>
                            {p.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </div>
                          <div style={{ fontWeight: '600', fontSize: '14px', color: '#0F172A', whiteSpace: 'nowrap' }}>{p.name}</div>
                        </div>
                      </td>
                      <td style={{ padding: '14px 18px' }}>
                        <span style={{
                          background: p.patient_type === 'contact_lens' ? 'rgba(8,145,178,0.08)' : '#F1F5F9',
                          color: p.patient_type === 'contact_lens' ? '#0891B2' : '#64748B',
                          fontSize: '12px', fontWeight: '600', padding: '5px 11px', borderRadius: '6px', whiteSpace: 'nowrap',
                        }}>
                          {p.patient_type === 'contact_lens' ? 'Contact Lens' : 'General'}
                        </span>
                      </td>
                      <td style={{ padding: '14px 18px' }}>
                        <RiskBadge status={p.risk_status} />
                      </td>
                      <td style={{ padding: '14px 18px' }}>
                        <span style={{
                          color: p.days_since_reorder > 42 ? '#EF4444' : p.days_since_reorder > 28 ? '#F59E0B' : '#10B981',
                          fontWeight: '700', fontSize: '14px',
                        }}>
                          {p.days_since_reorder != null ? `${p.days_since_reorder}d` : '—'}
                        </span>
                      </td>
                      <td style={{ padding: '14px 18px', color: '#64748B', fontSize: '13px', whiteSpace: 'nowrap' }}>
                        {formatDate(p.last_appointment_date)}
                      </td>
                      <td style={{ padding: '14px 18px' }}>
                        {p.risk_status === 'low' && <CheckinButton patientId={p.id} />}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ── Mobile cards ── */}
            <div className="mobile-only" style={{ display: 'none' }}>
              {patients.map((p, i) => (
                <div
                  key={p.id}
                  style={{
                    padding: '16px',
                    borderBottom: i < patients.length - 1 ? '1px solid #E2E8F0' : 'none',
                  }}
                >
                  {/* Row 1: avatar + name + risk badge */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      background: getRiskGradient(p.risk_status),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFFFFF',
                      fontSize: '13px',
                      fontWeight: '700',
                      flexShrink: 0,
                    }}>
                      {p.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '700', fontSize: '15px', color: '#0F172A', marginBottom: '2px' }}>{p.name}</div>
                      <RiskBadge status={p.risk_status} />
                    </div>
                  </div>

                  {/* Row 2: type + days overdue */}
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{
                      background: p.patient_type === 'contact_lens' ? 'rgba(8,145,178,0.08)' : '#F1F5F9',
                      color: p.patient_type === 'contact_lens' ? '#0891B2' : '#64748B',
                      fontSize: '12px', fontWeight: '600', padding: '5px 11px', borderRadius: '6px',
                    }}>
                      {p.patient_type === 'contact_lens' ? 'Contact Lens' : 'General'}
                    </span>
                    {p.days_since_reorder != null && (
                      <span style={{
                        color: p.days_since_reorder > 42 ? '#EF4444' : p.days_since_reorder > 28 ? '#F59E0B' : '#10B981',
                        fontSize: '13px', fontWeight: '700',
                      }}>
                        {p.days_since_reorder}d overdue
                      </span>
                    )}
                  </div>

                  {/* Row 3: last appointment */}
                  <div style={{ fontSize: '12px', color: '#64748B', marginBottom: p.risk_status === 'low' ? '12px' : '0' }}>
                    Last appt: {formatDate(p.last_appointment_date)}
                  </div>

                  {/* Check-in button for low-risk */}
                  {p.risk_status === 'low' && (
                    <div style={{ marginTop: '10px' }}>
                      <CheckinButton patientId={p.id} />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ padding: '16px 18px', borderTop: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#F8FAFB' }}>
                <span style={{ color: '#64748B', fontSize: '13px', fontWeight: '500' }}>
                  {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total}
                </span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: '1px solid #E2E8F0',
                      background: '#FFFFFF',
                      color: page === 1 ? '#CBD5E1' : '#64748B',
                      cursor: page === 1 ? 'default' : 'pointer',
                      fontSize: '13px',
                      fontWeight: '600',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (page > 1) {
                        e.currentTarget.style.background = '#F1F5F9'
                        e.currentTarget.style.transform = 'translateY(-1px)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#FFFFFF'
                      e.currentTarget.style.transform = 'translateY(0)'
                    }}
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: '1px solid #E2E8F0',
                      background: '#FFFFFF',
                      color: page === totalPages ? '#CBD5E1' : '#64748B',
                      cursor: page === totalPages ? 'default' : 'pointer',
                      fontSize: '13px',
                      fontWeight: '600',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (page < totalPages) {
                        e.currentTarget.style.background = '#F1F5F9'
                        e.currentTarget.style.transform = 'translateY(-1px)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#FFFFFF'
                      e.currentTarget.style.transform = 'translateY(0)'
                    }}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
