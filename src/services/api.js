import { mockRequest } from './mockBackend'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API !== 'false'

function buildUrl(endpoint, query = {}) {
  const url = new URL(`${API_BASE_URL}${endpoint}`)

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, value)
    }
  })

  return url.toString()
}

function getAuthToken() {
  return localStorage.getItem('authToken')
}

function normalizeError(error, fallback = 'Request failed. Please try again.') {
  const normalized = new Error(error?.message || fallback)
  normalized.status = error?.status
  normalized.details = error?.details || error?.errors || {}
  return normalized
}

export async function apiRequest(endpoint, options = {}) {
  if (USE_MOCK_API) {
    try {
      return await mockRequest(endpoint, options)
    } catch (error) {
      throw normalizeError(error)
    }
  }

  const headers = {
    Accept: 'application/json',
    ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
    ...options.headers,
  }
  const token = getAuthToken()

  if (token) headers.Authorization = `Bearer ${token}`

  const response = await fetch(buildUrl(endpoint, options.query), {
    method: options.method || 'GET',
    headers,
    body: options.body
      ? options.body instanceof FormData
        ? options.body
        : JSON.stringify(options.body)
      : undefined,
  })

  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    throw normalizeError({
      message: payload?.message,
      status: response.status,
      errors: payload?.errors || payload?.details,
    })
  }

  return payload
}

export const api = {
  get: (endpoint, query) => apiRequest(endpoint, { query }),
  post: (endpoint, body) => apiRequest(endpoint, { method: 'POST', body }),
  put: (endpoint, body) => apiRequest(endpoint, { method: 'PUT', body }),
  patch: (endpoint, body) => apiRequest(endpoint, { method: 'PATCH', body }),
  delete: (endpoint) => apiRequest(endpoint, { method: 'DELETE' }),
}
