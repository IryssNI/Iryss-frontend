const BASE = import.meta.env.VITE_API_URL || 'https://iryss-backend-12fh.onrender.com'

let _token = null

export function setToken(t) { _token = t }
export function clearToken() { _token = null }

export async function api(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(_token ? { Authorization: `Bearer ${_token}` } : {}),
    ...options.headers,
  }

  const res = await fetch(`${BASE}${path}`, { ...options, headers })

  // Handle no-content responses
  if (res.status === 204) return null

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`)
  }

  return data
}
