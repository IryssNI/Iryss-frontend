export default function StatCard({ label, value, sub, color = '#0891B2', loading, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '16px',
        padding: '24px 26px 22px',
        flex: 1,
        minWidth: '200px',
        position: 'relative',
        overflow: 'hidden',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.25s ease',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}
      onMouseEnter={e => {
        if (onClick) {
          e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)'
          e.currentTarget.style.transform = 'translateY(-2px)'
          e.currentTarget.style.borderColor = '#F1F5F9'
        }
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)'
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.borderColor = '#E2E8F0'
      }}
    >
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, height: '3px',
        background: color,
        borderRadius: '16px 16px 0 0',
      }} />
      <div style={{
        fontSize: '12px', color: '#94A3B8', textTransform: 'uppercase',
        letterSpacing: '0.8px', fontWeight: '600', marginBottom: '12px', marginTop: '6px',
      }}>
        {label}
      </div>
      {loading ? (
        <div style={{ height: '36px', background: '#F1F5F9', borderRadius: '8px', width: '60%' }} />
      ) : (
        <div style={{ fontSize: '36px', fontWeight: '800', color: color, lineHeight: 1, letterSpacing: '-1px' }}>
          {value}
        </div>
      )}
      {sub && !loading && (
        <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '8px' }}>{sub}</div>
      )}
    </div>
  )
}
