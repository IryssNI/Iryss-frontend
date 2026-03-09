import { useEffect, useState } from 'react'
import { api } from '../api/client'
import { useAuth } from '../context/AuthContext'
import Spinner from '../components/Spinner'

function Field({ label, hint, children }) {
  return (
    <div style={{ marginBottom: '22px' }}>
      <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#a0b4cc', marginBottom: '6px' }}>
        {label}
      </label>
      {children}
      {hint && <div style={{ fontSize: '12px', color: '#4a6080', marginTop: '5px' }}>{hint}</div>}
    </div>
  )
}

function Input({ value, onChange, type = 'text', placeholder, disabled }) {
  const [focused, setFocused] = useState(false)
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      style={{
        width: '100%',
        background: disabled ? 'rgba(10,22,40,0.5)' : '#0A1628',
        border: `1px solid ${focused ? '#0891B2' : '#1a3352'}`,
        borderRadius: '8px',
        padding: '10px 14px',
        color: disabled ? '#7c93b4' : '#ffffff',
        fontSize: '14px',
        outline: 'none',
        transition: 'border-color 0.15s',
        cursor: disabled ? 'not-allowed' : 'text',
      }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  )
}

export default function Settings() {
  const { practice, login } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [smsSenderName, setSmsSenderName] = useState('')
  const [digestEmailTime, setDigestEmailTime] = useState('18:00')

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await api('/api/settings')
        const s = res.settings
        setName(s.name || '')
        setEmail(s.email || '')
        setSmsSenderName(s.sms_sender_name || '')
        setDigestEmailTime(s.digest_email_time || '18:00')
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchSettings()
  }, [])

  async function handleSave(e) {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (newPassword && newPassword !== confirmPassword) {
      setError('New passwords do not match')
      return
    }

    setSaving(true)
    try {
      const body = { name, email, sms_sender_name: smsSenderName, digest_email_time: digestEmailTime }
      if (newPassword) {
        body.current_password = currentPassword
        body.new_password = newPassword
      }

      const res = await api('/api/settings', {
        method: 'PUT',
        body: JSON.stringify(body),
      })

      setSuccess('Settings saved successfully')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setTimeout(() => setSuccess(''), 4000)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}>
        <Spinner size={36} />
      </div>
    )
  }

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '4px' }}>Settings</h1>
        <p style={{ color: '#7c93b4', fontSize: '14px' }}>Manage your practice configuration</p>
      </div>

      <div className="settings-wrap">
        {error && (
          <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '10px', padding: '14px 18px', color: '#ef4444', marginBottom: '24px' }}>
            {error}
          </div>
        )}
        {success && (
          <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: '10px', padding: '14px 18px', color: '#22c55e', marginBottom: '24px' }}>
            {success}
          </div>
        )}

        <form onSubmit={handleSave}>
          {/* Practice details */}
          <div style={{ background: '#0D2448', border: '1px solid #1a3352', borderRadius: '14px', padding: '28px', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '20px', paddingBottom: '14px', borderBottom: '1px solid #1a3352' }}>
              Practice Details
            </h2>

            <Field label="Practice name">
              <Input value={name} onChange={e => setName(e.target.value)} placeholder="Bright Eyes Opticians" />
            </Field>

            <Field label="Email address" hint="Used for login and receiving digest emails">
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@practice.co.uk" />
            </Field>

            <Field
              label="SMS sender name"
              hint="Shown as the sender name on outbound texts (max 11 characters)"
            >
              <Input
                value={smsSenderName}
                onChange={e => setSmsSenderName(e.target.value.slice(0, 11))}
                placeholder="BrightEyes"
              />
              <div style={{ fontSize: '11px', color: smsSenderName.length >= 11 ? '#f59e0b' : '#4a6080', marginTop: '4px' }}>
                {smsSenderName.length}/11 characters
              </div>
            </Field>

            <Field label="Daily digest email time" hint="Time to receive your daily patient summary (UK time)">
              <Input
                type="time"
                value={digestEmailTime}
                onChange={e => setDigestEmailTime(e.target.value)}
              />
            </Field>
          </div>

          {/* Password */}
          <div style={{ background: '#0D2448', border: '1px solid #1a3352', borderRadius: '14px', padding: '28px', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '4px' }}>
              Change Password
            </h2>
            <p style={{ color: '#7c93b4', fontSize: '13px', marginBottom: '20px', paddingBottom: '14px', borderBottom: '1px solid #1a3352' }}>
              Leave blank to keep your current password
            </p>

            <Field label="Current password">
              <Input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} placeholder="••••••••" />
            </Field>

            <Field label="New password">
              <Input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="••••••••" />
            </Field>

            <Field label="Confirm new password">
              <Input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="••••••••" />
            </Field>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="settings-save-btn"
            style={{
              background: saving ? 'rgba(8,145,178,0.5)' : '#0891B2',
              color: '#ffffff',
              cursor: saving ? 'not-allowed' : 'pointer',
            }}
            onMouseEnter={e => { if (!saving) e.currentTarget.style.background = '#0779a0' }}
            onMouseLeave={e => { if (!saving) e.currentTarget.style.background = '#0891B2' }}
          >
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </form>
      </div>
    </div>
  )
}
