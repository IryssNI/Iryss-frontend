import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const S = {
  shell: {
    display: 'flex',
    height: '100vh',
    overflow: 'hidden',
  },
  sidebar: {
    width: '232px',
    flexShrink: 0,
    background: '#060f1e',
    borderRight: '1px solid #1a3352',
    display: 'flex',
    flexDirection: 'column',
    padding: '0 0 24px 0',
  },
  logoWrap: {
    padding: '28px 24px 32px',
    borderBottom: '1px solid #1a3352',
    marginBottom: '12px',
  },
  logo: {
    fontSize: '26px',
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: '-0.5px',
  },
  logoDot: {
    color: '#0891B2',
  },
  tagline: {
    fontSize: '11px',
    color: '#7c93b4',
    marginTop: '3px',
    letterSpacing: '0.3px',
  },
  nav: {
    flex: 1,
    padding: '0 12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 12px',
    borderRadius: '8px',
    color: '#7c93b4',
    textDecoration: 'none',
    fontSize: '14.5px',
    fontWeight: '500',
    transition: 'all 0.15s',
  },
  navItemActive: {
    background: 'rgba(8, 145, 178, 0.12)',
    color: '#0891B2',
  },
  bottom: {
    padding: '0 12px',
    borderTop: '1px solid #1a3352',
    paddingTop: '16px',
  },
  practiceLabel: {
    padding: '0 12px',
    fontSize: '11px',
    color: '#4a6080',
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
    fontWeight: '600',
    marginBottom: '6px',
  },
  practiceName: {
    padding: '0 12px',
    fontSize: '13px',
    color: '#7c93b4',
    marginBottom: '16px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    width: '100%',
    padding: '10px 12px',
    borderRadius: '8px',
    background: 'none',
    border: 'none',
    color: '#7c93b4',
    fontSize: '14.5px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
  main: {
    flex: 1,
    overflow: 'auto',
    background: '#0A1628',
  },
}

function IconDashboard() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  )
}

function IconPatients() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

function IconAlerts() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  )
}

function IconSettings() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  )
}

function IconLogout() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  )
}

function IconInbox() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
      <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
    </svg>
  )
}

const navItems = [
  { to: '/', label: 'Dashboard', icon: <IconDashboard />, end: true },
  { to: '/patients', label: 'Patients', icon: <IconPatients /> },
  { to: '/inbox', label: 'Inbox', icon: <IconInbox /> },
  { to: '/alerts', label: 'Alerts', icon: <IconAlerts /> },
  { to: '/settings', label: 'Settings', icon: <IconSettings /> },
]

export default function Layout() {
  const { practice, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div style={S.shell}>

      {/* Desktop sidebar — hidden on mobile via CSS */}
      <aside style={S.sidebar} className="desktop-only">
        <div style={S.logoWrap}>
          <div style={S.logo}>
            iry<span style={S.logoDot}>ss</span>
          </div>
          <div style={S.tagline}>Patient Retention Platform</div>
        </div>

        <nav style={S.nav}>
          {navItems.map(({ to, label, icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              style={({ isActive }) => ({
                ...S.navItem,
                ...(isActive ? S.navItemActive : {}),
              })}
            >
              {icon}
              {label}
            </NavLink>
          ))}
        </nav>

        <div style={S.bottom}>
          {practice && (
            <>
              <div style={S.practiceLabel}>Practice</div>
              <div style={S.practiceName}>{practice.name}</div>
            </>
          )}
          <button
            style={S.logoutBtn}
            onClick={handleLogout}
            onMouseEnter={e => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.background = 'rgba(239,68,68,0.08)' }}
            onMouseLeave={e => { e.currentTarget.style.color = '#7c93b4'; e.currentTarget.style.background = 'none' }}
          >
            <IconLogout />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={S.main}>
        <div className="page-content">
          <Outlet />
        </div>
      </main>

      {/* Mobile bottom nav */}
      <nav className="bottom-nav">
        {navItems.map(({ to, label, icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => `bottom-nav-item${isActive ? ' active' : ''}`}
          >
            {icon}
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

    </div>
  )
}
