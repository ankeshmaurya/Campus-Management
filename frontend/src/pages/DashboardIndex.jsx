import { Navigate } from 'react-router-dom'

import { useAuth } from '../auth/AuthContext'
import AdminDashboardHome from './dashboards/AdminDashboardHome'
import FacultyDashboardHome from './dashboards/FacultyDashboardHome'
import StudentDashboardHome from './dashboards/StudentDashboardHome'

export default function DashboardIndex() {
  const { user } = useAuth()

  if (!user) return <Navigate to="/login" replace />

  if (user.role === 'super_admin') return <AdminDashboardHome />
  if (user.role === 'faculty') return <FacultyDashboardHome />
  if (user.role === 'student') return <StudentDashboardHome />

  return <Navigate to="/login" replace />
}
