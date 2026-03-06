import { useEffect, useState } from 'react'
import { api } from '../api/client'
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
      padding: '3px 9px',
      borderRadius: '20px',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      whiteSpace: 'nowrap',
    }}>
      {s.label}
    </span>
  )
}

function SentimentBadge({ sentiment }) {
  if (!sentiment) return <span style={{ color: '#4a6080', fontSize: '12px' }}>—</span>
  const map = {
    positive: { color: '#22c55e', label: 'Positive' },
    negative: { color: '#ef4444', label: 'Negative' },
    urgent: { color: '#f59e0b', label: 'Urgent' },
  }
  const s = map[sentiment] || { color: '#7c93b4', label: sentiment }
  return (
    <span style={{ color: s.color, fontSize: '12px', fontWeight: '500' }}>{s.label}</span>
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
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '4px' }}>Patients</h1>
        <p style={{ color: '#7c93b4', fontSize: '14px' }}>{total} patients total</p>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {FILTERS.map(f => (
          <button
            key={f.value}
            onClick={() => handleFilterChange(f.value)}
            style={{
              padding: '7px 16px',
              borderRadius: '8px',
              border: filter === f.value ? '1px solid rgba(8,145,178,0.4)' : '1px solid #1a3352',
              background: filter === f.value ? 'rgba(8,145,178,0.12)' : '#0D2448',
              color: filter === f.value ? '#0891B2' : '#7c93b4',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {error && (
        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '10px', padding: '14px 18px', color: '#ef4444', marginBottom: '20px' }}>
          {error}
        </div>
      )}

      <div style={{ background: '#0D2448', border: '1px solid #1a3352', borderRadius: '14px', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '64px' }}>
            <Spinner size={32} />
          </div>
        ) : patients.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#7c93b4' }}>
            No patients found for this filter.
          </div>
        ) : (
          <>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #1a3352' }}>
                    {['Patient', 'Type', 'Risk', 'Score', 'Days Since Reorder', 'Last Reorder', 'Last Appointment', 'Sentiment'].map(h => (
                      <th key={h} style={{ padding: '12px 18px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: '#7c93b4', textTransform: 'uppercase', letterSpacing: '0.6px', whiteSpace: 'nowrap' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {patients.map((p, i) => (
                    <tr
                      key={p.id}
                      style={{ borderBottom: i < patients.length - 1 ? '1px solid #1a3352' : 'none' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '13px 18px' }}>
                        <div style={{ fontWeight: '500', fontSize: '14px', whiteSpace: 'nowrap' }}>{p.name}</div>
                      </td>
                      <td style={{ padding: '13px 18px' }}>
                        <span style={{
                          background: p.patient_type === 'contact_lens' ? 'rgba(8,145,178,0.12)' : 'rgba(124,147,180,0.12)',
                          color: p.patient_type === 'contact_lens' ? '#0891B2' : '#7c93b4',
                          fontSize: '11px',
                          fontWeight: '600',
                          padding: '3px 8px',
                          borderRadius: '20px',
                          whiteSpace: 'nowrap',
                        }}>
                          {p.patient_type === 'contact_lens' ? 'CL' : 'General'}
                        </span>
                      </td>
                      <td style={{ padding: '13px 18px' }}>
                        <RiskBadge status={p.risk_status} />
                      </td>
                      <td style={{ padding: '13px 18px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ flex: 1, height: '4px', background: '#1a3352', borderRadius: '2px', width: '48px', overflow: 'hidden' }}>
                            <div style={{
                              height: '100%',
                              width: `${p.risk_score}%`,
                              background: p.risk_status === 'high' ? '#ef4444' : p.risk_status === 'medium' ? '#f59e0b' : '#22c55e',
                              borderRadius: '2px',
                            }} />
                          </div>
                          <span style={{ fontSize: '12px', color: '#7c93b4', width: '28px' }}>{p.risk_score}</span>
                        </div>
                      </td>
                      <td style={{ padding: '13px 18px' }}>
                        <span style={{
                          color: p.days_since_reorder > 42 ? '#ef4444' : p.days_since_reorder > 28 ? '#f59e0b' : '#22c55e',
                          fontWeight: '600',
                          fontSize: '14px',
                        }}>
                          {p.days_since_reorder != null ? `${p.days_since_reorder}d` : '—'}
                        </span>
                      </td>
                      <td style={{ padding: '13px 18px', color: '#7c93b4', fontSize: '13px', whiteSpace: 'nowrap' }}>
                        {formatDate(p.last_reorder_date)}
                      </td>
                      <td style={{ padding: '13px 18px', color: '#7c93b4', fontSize: '13px', whiteSpace: 'nowrap' }}>
                        {formatDate(p.last_appointment_date)}
                      </td>
                      <td style={{ padding: '13px 18px' }}>
                        <SentimentBadge sentiment={p.last_sentiment} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ padding: '16px 18px', borderTop: '1px solid #1a3352', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ color: '#7c93b4', fontSize: '13px' }}>
                  Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total}
                </span>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #1a3352', background: 'none', color: page === 1 ? '#4a6080' : '#7c93b4', cursor: page === 1 ? 'default' : 'pointer', fontSize: '13px' }}
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #1a3352', background: 'none', color: page === totalPages ? '#4a6080' : '#7c93b4', cursor: page === totalPages ? 'default' : 'pointer', fontSize: '13px' }}
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
