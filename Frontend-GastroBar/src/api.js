const API_BASE = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '')

export function getToken() {
  return localStorage.getItem('gastrobar-token')
}

export function saveSession(token, user) {
  localStorage.setItem('gastrobar-token', token)
  localStorage.setItem('gastrobar-user', JSON.stringify(user))
}

export function clearSession() {
  localStorage.removeItem('gastrobar-token')
  localStorage.removeItem('gastrobar-user')
}

export async function apiRequest(path, options = {}) {
  const headers = new Headers(options.headers || {})
  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }
  const token = getToken()
  if (token) headers.set('Authorization', `Bearer ${token}`)

  let response
  try {
    response = await fetch(`${API_BASE}${path}`, { ...options, headers })
  } catch {
    throw new Error('No fue posible conectar con el servidor. Verifica que el backend esté iniciado.')
  }

  const contentType = response.headers.get('content-type') || ''
  const data = contentType.includes('application/json')
    ? await response.json()
    : await response.text()

  if (!response.ok) {
    const message = typeof data === 'object'
      ? data.mensaje || data.error
      : data
    const error = new Error(message || `Error del servidor (${response.status})`)
    error.status = response.status
    throw error
  }
  return data
}

export const api = {
  login: credentials => apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  }),
  register: details => apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(details)
  }),
  getServices: () => apiRequest('/servicios'),
  getUser: id => apiRequest(`/usuarios/${id}`),
  getReservations: () => apiRequest('/reservas'),
  createReservation: details => apiRequest('/reservas', {
    method: 'POST',
    body: JSON.stringify(details)
  }),
  updateReservation: (id, details) => apiRequest(`/reservas/${id}`, {
    method: 'PUT',
    body: JSON.stringify(details)
  }),
  getUsers: () => apiRequest('/usuarios'),
  getDashboardStats: () => apiRequest('/Dashboard/stats'),
  createService: details => apiRequest('/servicios', {
    method: 'POST',
    body: JSON.stringify(details)
  }),
  updateService: (id, details) => apiRequest(`/servicios/${id}`, {
    method: 'PUT',
    body: JSON.stringify(details)
  }),
  deleteService: id => apiRequest(`/servicios/${id}`, { method: 'DELETE' })
}
