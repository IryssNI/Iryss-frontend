export default function StatCard({ label, value, sub, color = '#0891B2', loading, onClick }) {
  const dimMap = {
    '#ef4444': 'rgba(239,68,68,0.1)',
    '#f59e0b': 'rgba(245,158,11,0.1)',
    '#22c55e': 'rgba(34,197,94,0.1)',
    '#0891B2': 'rgba(8,145,178,0.1)',
  }
  const dim = dimMap[color] || 'rgba(8,145,178,0.1)'

  return (
    <div
      onClick={onClick}
      style={{
        background: '#0D2448',
        border: '1px solid #1a3352',
        borderRadius: '14px',
        padding: '24px 28px',
        flex: 1,
        minWidth: '200px',
        position: 'relative',
        overflow: 'hidden',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'border-color 0.15s',
      }}
      onMouseEnter={e => { if (onClick) e.currentTarget.style.borderColor = color }}
      onMouseLeave={e => { if (onClick) e.currentTarget.style.borderColor = '#1a3352' }}
    >
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        background: color,
        borderRadius: '14px 14px 0 0',
      }} />
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '10px',
        background: dim,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '16px',
      }}>
        <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: color, opacity: 0.85 }} />
      </div>
      <div style={{ fontSize: '11px', color: '#7c93b4', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: '600', marginBottom: '8px' }}>
        {label}
      </div>
      {loading ? (
        <div style={{ height: '36px', background: '#1a3352', borderRadius: '6px', width: '60%' }} />
      ) : (
        <div style={{ fontSize: '32px', fontWeight: '700', color: color, lineHeight: 1 }}>
          {value}
        </div>
      )}
      {sub && !loading && (
        <div style={{ fontSize: '12px', color: '#7c93b4', marginTop: '6px' }}>{sub}</div>
      )}
    </div>
  )
}
