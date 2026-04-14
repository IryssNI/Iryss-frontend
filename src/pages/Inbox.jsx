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
    <div style={{ backgroundColor: '#F8FAFB', minHeight: '100vh' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '4px', color: '#0F172A', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Inbox</h1>
        <p style={{ color: '#64748B', fontSize: '14px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Inbound patient replies — {total} total
        </p>
      </div>

      {error && (
        <div style={{ background: '#FEE2E2', border: '1px solid #FECACA', borderRadius: '16px', padding: '14px 18px', color: '#DC2626', marginBottom: '20px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          {error}
        </div>
      )}

      <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '64px' }}>
            <Spinner size={32} />
          </div>
        ) : messages.length === 0 ? (
          <div style={{ padding: '64px 24px', textAlign: 'center' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>💬</div>
            <div style={{ fontSize: '15px', fontWeight: '600', color: '#0F172A', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>No inbound messages yet</div>
            <div style={{ fontSize: '13px', color: '#64748B', marginTop: '4px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Patient replies will appear here once the Twilio webhook is configured
            </div>
          </div>
        ) : (
          <>
            {/* ── Desktop table ── */}
            <div className="desktop-only" style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                <thead>
                  <tr style={{ backgroundColor: '#F8FAFB', borderBottom: '1px solid #E2E8F0' }}>
                    {['Patient', 'Message', 'Received'].map(h => (
                      <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.6px', whiteSpace: 'nowrap' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {messages.map((m, i) => (
                    <tr
                      key={m.id}
                      style={{ borderBottom: i < messages.length - 1 ? '1px solid #E2E8F0' : 'none', transition: 'background-color 150ms ease' }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F8FAFB'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <td style={{ padding: '14px 20px', whiteSpace: 'nowrap' }}>
                        <div style={{ fontWeight: '600', fontSize: '14px', color: '#0F172A' }}>{m.patient_name}</div>
                        <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>{m.practice_name}</div>
                      </td>
                      <td style={{ padding: '14px 20px', maxWidth: '420px' }}>
                        <div style={{
                          background: '#F8FAFB', border: '1px solid #E2E8F0',
                          borderRadius: '8px', padding: '10px 14px',
                          fontSize: '13px', color: '#334155', lineHeight: 1.5,
                        }}>
                          {m.message_body}
                        </div>
                      </td>
                      <td style={{ padding: '14px 20px', color: '#94A3B8', fontSize: '13px', whiteSpace: 'nowrap' }}>
                        {formatDateTime(m.sent_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ── Mobile cards ── */}
            <div className="mobile-only" style={{ display: 'none' }}>
              {messages.map((m, i) => (
                <div
                  key={m.id}
                  style={{
                    padding: '16px',
                    borderBottom: i < messages.length - 1 ? '1px solid #E2E8F0' : 'none',
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}
                >
                  {/* Name */}
                  <div style={{ marginBottom: '10px' }}>
                    <div style={{ fontWeight: '600', fontSize: '14px', color: '#0F172A' }}>{m.patient_name}</div>
                    <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>{m.practice_name}</div>
                  </div>

                  {/* Message body */}
                  <div style={{
                    background: '#F8FAFB', border: '1px solid #E2E8F0',
                    borderRadius: '8px', padding: '10px 14px',
                    fontSize: '13px', color: '#334155', lineHeight: 1.6,
                    marginBottom: '8px', wordBreak: 'break-word',
                  }}>
                    {m.message_body}
                  </div>

                  {/* Date */}
                  <div style={{ fontSize: '12px', color: '#94A3B8' }}>
                    {formatDateTime(m.sent_at)}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ padding: '16px 20px', borderTop: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: "'Plus Jakarta Sans', sans-serif", backgroundColor: '#F8FAFB' }}>
                <span style={{ color: '#64748B', fontSize: '13px' }}>
                  {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total}
                </span>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                    style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid #E2E8F0', background: '#FFFFFF', color: page === 1 ? '#CBD5E1' : '#0891B2', cursor: page === 1 ? 'default' : 'pointer', fontSize: '13px', fontWeight: '600', minHeight: '40px', fontFamily: "'Plus Jakarta Sans', sans-serif", transition: 'all 150ms ease' }}
                    onMouseEnter={e => { if (page !== 1) { e.currentTarget.style.backgroundColor = '#F8FAFB'; e.currentTarget.style.borderColor = '#0891B2' } }}
                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#FFFFFF'; e.currentTarget.style.borderColor = '#E2E8F0' }}>
                    Previous
                  </button>
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                    style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid #E2E8F0', background: '#FFFFFF', color: page === totalPages ? '#CBD5E1' : '#0891B2', cursor: page === totalPages ? 'default' : 'pointer', fontSize: '13px', fontWeight: '600', minHeight: '40px', fontFamily: "'Plus Jakarta Sans', sans-serif", transition: 'all 150ms ease' }}
                    onMouseEnter={e => { if (page !== totalPages) { e.currentTarget.style.backgroundColor = '#F8FAFB'; e.currentTarget.style.borderColor = '#0891B2' } }}
                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#FFFFFF'; e.currentTarget.style.borderColor = '#E2E8F0' }}>
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
