import { Navigate, Outlet } from 'react-router-dom'

import { useAuth } from './AuthContext'

export default function RequireRole({ allow }) {
  const { user, loading } = useAuth()

  if (loading) return null
  if (!user) return <Navigate to="/login" replace />

  const role = user?.role
  if (Array.isArray(allow) && allow.length > 0 && !allow.includes(role)) {
    return <Navigate to="/app" replace />
  }

  return <Outlet />
}
