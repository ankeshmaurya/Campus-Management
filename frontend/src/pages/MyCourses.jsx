import { useEffect, useState } from 'react'

import { api } from '../api/client'
import DataTable from '../components/DataTable'

export default function MyCourses() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true
    setLoading(true)
    api
      .get('/campus/courses/my/')
      .then((res) => mounted && setItems(res.data.results || res.data))
      .catch(() => mounted && setError('Failed to load courses'))
      .finally(() => mounted && setLoading(false))

    return () => {
      mounted = false
    }
  }, [])

  const columns = [
    { key: 'course_code', label: 'Code' },
    { key: 'course_name', label: 'Course' },
    { key: 'classroom_name', label: 'Classroom', render: (r) => r.classroom_name || '-' },
    { key: 'enrolled_students', label: 'Enrolled' },
    { key: 'weekly_hours', label: 'Hours/Week' },
    { key: 'utilization_percent', label: 'Utilization %', render: (r) => `${Number(r.utilization_percent).toFixed(1)}%` },
  ]

  return (
    <div>
      <div className="mb-4">
        <div className="text-lg font-semibold">My Courses</div>
        <div className="text-xs text-slate-400">Courses assigned to you (faculty) or enrolled (student)</div>
      </div>

      {error ? (
        <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-200">{error}</div>
      ) : null}

      {loading ? <div className="text-sm text-slate-400">Loading...</div> : <DataTable columns={columns} rows={items} canEdit={false} />}
    </div>
  )
}
