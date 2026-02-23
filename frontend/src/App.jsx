import { Navigate, Route, Routes } from 'react-router-dom'

import { AuthProvider } from './auth/AuthContext'
import RequireAuth from './auth/RequireAuth'
import RequireRole from './auth/RequireRole'
import DashboardLayout from './layouts/DashboardLayout'
import About from './pages/About'
import AIInsights from './pages/AIInsights'
import Analytics from './pages/Analytics'
import DashboardIndex from './pages/DashboardIndex'
import Landing from './pages/Landing'
import Login from './pages/Login'
import MyCourses from './pages/MyCourses'
import MyEnrollments from './pages/MyEnrollments'
import Register from './pages/Register'

import BlocksPage from './pages/crud/BlocksPage'
import ClassroomsPage from './pages/crud/ClassroomsPage'
import CoursesPage from './pages/crud/CoursesPage'
import FacultyPage from './pages/crud/FacultyPage'
import StudentsPage from './pages/crud/StudentsPage'
import AddFaculty from './pages/AddFaculty'
import AddStudents from './pages/AddStudents'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<RequireAuth />}>
          <Route path="/app" element={<DashboardLayout />}>
            <Route index element={<DashboardIndex />} />

            <Route element={<RequireRole allow={["super_admin"]} />}>
              <Route path="blocks" element={<BlocksPage />} />
              <Route path="classrooms" element={<ClassroomsPage />} />
              <Route path="courses" element={<CoursesPage />} />
              <Route path="faculty" element={<FacultyPage />} />
              <Route path="students" element={<StudentsPage />} />
              <Route path="add-faculty" element={<AddFaculty />} />
              <Route path="add-students" element={<AddStudents />} />
            </Route>

            <Route element={<RequireRole allow={["super_admin", "faculty", "student"]} />}>
              <Route path="my-courses" element={<MyCourses />} />
              <Route path="my-enrollments" element={<MyEnrollments />} />
            </Route>

            <Route element={<RequireRole allow={["super_admin", "faculty"]} />}>
              <Route path="analytics" element={<Analytics />} />
            </Route>

            <Route element={<RequireRole allow={["super_admin", "faculty"]} />}>
              <Route path="ai-insights" element={<AIInsights />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
