// src/services/api.js
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

function getToken() {
  return localStorage.getItem('joy_admin_token')
}

async function request(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...options.headers }
  const token = getToken()
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${BASE}${path}`, { ...options, headers })
  const data = await res.json()

  if (!res.ok) throw new Error(data.error || 'Request failed')
  return data
}

// ── Auth ────────────────────────────────────────────────────
export const login = (email, password) =>
  request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) })

// ── Workers (public) ────────────────────────────────────────
export const getWorkers = (filters = {}) => {
  const params = new URLSearchParams(filters).toString()
  return request(`/workers${params ? '?' + params : ''}`)
}

export const getWorker = (id) => request(`/workers/${id}`)

// ── Workers (admin) ─────────────────────────────────────────
// Always coerce empty strings to null so the backend stores/clears correctly.
// photo_url: '' → null means "no photo" — without this COALESCE keeps old value.

export const createWorker = (data) =>
  request('/workers', {
    method: 'POST',
    body: JSON.stringify({
      name:         data.name         || '',
      category:     data.category     || '',
      location:     data.location     || null,
      bio:          data.bio          || null,
      photo_url:    data.photo_url    || null,
      is_available: data.is_available ?? true,
    }),
  })

export const updateWorker = (id, data) =>
  request(`/workers/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      name:         data.name         || '',
      category:     data.category     || '',
      location:     data.location     || null,
      bio:          data.bio          || null,
      photo_url:    data.photo_url    || null,  // null = clear photo in DB
      is_available: data.is_available ?? true,
    }),
  })

export const deleteWorker = (id) =>
  request(`/workers/${id}`, { method: 'DELETE' })

export const toggleAvailability = (id, is_available) =>
  request(`/workers/${id}/availability`, {
    method: 'PATCH',
    body: JSON.stringify({ is_available }),
  })

// ── Bookings ────────────────────────────────────────────────
export const submitBooking = (data) =>
  request('/bookings', { method: 'POST', body: JSON.stringify(data) })

export const getBookings = () => request('/bookings')

export const markBookingRead = (id) =>
  request(`/bookings/${id}/read`, { method: 'PATCH' })

// ── Analytics ───────────────────────────────────────────────
export const getAnalytics = () => request('/analytics')
