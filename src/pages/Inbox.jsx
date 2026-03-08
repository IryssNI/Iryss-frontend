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

function SentimentBadge({ sentiment }) {
  const map = {
    positive: { bg: 'rgba(34,197,94,0.12)', color: '#22c55e', label: 'Positive' },
    negative: { bg: 'rgba(239,68,68,0.12)', color: '#ef4444', label: 'Negative' },
    urgent:   { bg: 'rgba(245,158,11,0.12)', color: '#f59e0b', label: 'Urgent' },
  }
  if (!sentiment) {
    return (
      <span style={{ background: 'rgba(124,147,180,0.1)', color: '#7c93b4', fontSize: '11px', fontWeight: '600', padding: '3px 9px', borderRadius: '20px' }}>
        Unanalysed
      </span>
    )
  }
  const s = map[sentiment] || { bg: 'rgba(124,147,180,0.1)', color: '#7c93b4', label: sentiment }
  return (
    <span style={{ background: s.bg, color: s.color, fontSize: '11px', fontWeight: '600', padding: '3px 9px', borderRadius: '20px', textTransform: 'capitalize' }}>
      {s.label}
    </span>
  )
}

export default function Inbox() {
  const [messages, setMessages] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const limit = 30

  async function fetchMessages(pg = page) {
    setLoading(true)
    setError('')
    try {
      const params = new URLSearchParams({ page: pg, limit })
      const res = await api(`/api/messages/inbound?${params}`)
      setMessages(res.messages)
      setTotal(res.total)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchMessages(page) }, [page])

  const totalPages = Math.ceil(total / limit)

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '4px' }}>Inbox</h1>
        <p style={{ color: '#7c93b4', fontSize: '14px' }}>
          Inbound patient replies — {total} total
        </p>
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
        ) : messages.length === 0 ? (
          <div style={{ padding: '64px', textAlign: 'center' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>💬</div>
            <div style={{ fontSize: '15px', fontWeight: '500', color: '#7c93b4' }}>No inbound messages yet</div>
            <div style={{ fontSize: '13px', color: '#4a6080', marginTop: '4px' }}>
              Patient replies will appear here once the Twilio webhook is configured
            </div>
          </div>
        ) : (
          <>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #1a3352' }}>
                    {['Patient', 'Message', 'Sentiment', 'Received'].map(h => (
                      <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: '#7c93b4', textTransform: 'uppercase', letterSpacing: '0.6px', whiteSpace: 'nowrap' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {messages.map((m, i) => (
                    <tr
                      key={m.id}
                      style={{ borderBottom: i < messages.length - 1 ? '1px solid #1a3352' : 'none' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '14px 20px', whiteSpace: 'nowrap' }}>
                        <div style={{ fontWeight: '500', fontSize: '14px' }}>{m.patient_name}</div>
                        <div style={{ fontSize: '12px', color: '#4a6080', marginTop: '2px' }}>{m.practice_name}</div>
                      </td>
                      <td style={{ padding: '14px 20px', maxWidth: '420px' }}>
                        <div style={{
                          background: 'rgba(0,0,0,0.2)',
                          border: '1px solid #1a3352',
                          borderRadius: '8px',
                          padding: '8px 12px',
                          fontSize: '13px',
                          color: '#a0b4cc',
                          lineHeight: 1.5,
                        }}>
                          {m.message_body}
                        </div>
                      </td>
                      <td style={{ padding: '14px 20px', whiteSpace: 'nowrap' }}>
                        <SentimentBadge sentiment={m.sentiment} />
                      </td>
                      <td style={{ padding: '14px 20px', color: '#7c93b4', fontSize: '13px', whiteSpace: 'nowrap' }}>
                        {formatDateTime(m.sent_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div style={{ padding: '16px 20px', borderTop: '1px solid #1a3352', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ color: '#7c93b4', fontSize: '13px' }}>
                  Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total}
                </span>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                    style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #1a3352', background: 'none', color: page === 1 ? '#4a6080' : '#7c93b4', cursor: page === 1 ? 'default' : 'pointer', fontSize: '13px' }}>
                    Previous
                  </button>
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                    style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #1a3352', background: 'none', color: page === totalPages ? '#4a6080' : '#7c93b4', cursor: page === totalPages ? 'default' : 'pointer', fontSize: '13px' }}>
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
