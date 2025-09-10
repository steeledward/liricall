// composables/useApi.js
import axios from 'axios'

export function useApi () {
  const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
    timeout: 10_000,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  // Request interceptor
  api.interceptors.request.use(
    config => {
      const token = localStorage.getItem('authToken')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    error => Promise.reject(error),
  )

  // Response interceptor
  api.interceptors.response.use(
    response => response,
    error => {
      if (error.response?.status === 401) {
        // Handle unauthorized access
        console.error('Unauthorized access')
      }
      return Promise.reject(error)
    },
  )

  return { api }
}
