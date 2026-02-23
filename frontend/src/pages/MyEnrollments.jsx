import { useEffect, useState } from 'react'

import { api } from '../api/client'
import DataTable from '../components/DataTable'

export default function MyEnrollments() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true
    setLoading(true)
    api
      .get('/campus/enrollments/my/')
      .then((res) => mounted && setItems(res.data.results || res.data))
      .catch(() => mounted && setError('Failed to load enrollments'))
      .finally(() => mounted && setLoading(false))

    return () => {
      mounted = false
    }
  }, [])

  const columns = [
    { key: 'id', label: 'ID' },
    {
      key: 'student_registration_number',
      label: 'Student',
      render: (r) => r.student_registration_number || r.student,
    },
    {
      key: 'course_code',
      label: 'Course',
      render: (r) => (r.course_code ? `${r.course_code} - ${r.course_name}` : r.course),
    },
    { key: 'enrolled_at', label: 'Enrolled At' },
  ]

  return (
    <div>
      <div className="mb-4">
        <div className="text-lg font-semibold">My Enrollments</div>
        <div className="text-xs text-slate-400">Enrollment list filtered by your role</div>
      </div>

      {error ? (
        <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-200">{error}</div>
      ) : null}

      {loading ? <div className="text-sm text-slate-400">Loading...</div> : <DataTable columns={columns} rows={items} canEdit={false} />}
    </div>
  )
}
