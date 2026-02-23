import { createContext, useContext, useEffect, useMemo, useState } from 'react'

import { api } from '../api/client'
import { clearTokens, getAccessToken, setTokens } from './tokenStorage'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  async function refreshMe() {
    const token = getAccessToken()
    if (!token) {
      setUser(null)
      setLoading(false)
      return
    }

    try {
      const res = await api.get('/users/me/')
      setUser(res.data)
    } catch {
      clearTokens()
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshMe()
  }, [])

  async function login({ username, password }) {
    const res = await api.post('/users/token/', { username, password })
    setTokens(res.data)
    await refreshMe()
  }

  async function register(payload) {
    await api.post('/users/register/', payload)
  }

  function logout() {
    clearTokens()
    setUser(null)
  }

  const value = useMemo(
    () => ({ user, loading, login, logout, register, refreshMe }),
    [user, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
