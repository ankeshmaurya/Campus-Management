import axios from 'axios'

import { getAccessToken, clearTokens } from '../auth/tokenStorage'

export const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
})

api.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${token}`
    console.log('API Request:', config.method?.toUpperCase(), config.url, 'Token attached:', !!token)
  } else {
    console.warn('API Request: No token available for', config.method?.toUpperCase(), config.url)
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      clearTokens()
    }
    return Promise.reject(err)
  },
)
