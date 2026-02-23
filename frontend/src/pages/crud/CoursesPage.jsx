import { useEffect, useState } from 'react'

import { api } from '../../api/client'
import CsvUpload from '../../components/CsvUpload'
import DataTable from '../../components/DataTable'

export default function CoursesPage() {
  const demoCsv = `course_code,course_name,faculty_name,classroom_name,weekly_hours
CS101,Data Structures,Dr. Alice,Room 101,4
EE201,Circuits,Prof. Bob,Room 102,3
ME301,Thermodynamics,Ms. Carol,Lab 201,3`
  return (
    <>
      <CsvUpload
        endpoint="/campus/courses/"
        demoCsvContent={demoCsv}
        demoCsvFilename="courses_demo.csv"
      />
      <CoursesPageInner />
    </>
  )
}

function CoursesPageInner() {
  const [items, setItems] = useState([])
  const [faculty, setFaculty] = useState([])
  const [classrooms, setClassrooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({})

  async function load() {
    setLoading(true)
    try {
      const [itemsRes, facRes, roomRes] = await Promise.all([
        api.get('/campus/courses/'),
        api.get('/campus/faculty/'),
        api.get('/campus/classrooms/'),
      ])
      setItems(itemsRes.data.results || itemsRes.data)
      setFaculty(facRes.data.results || facRes.data)
      setClassrooms(roomRes.data.results || roomRes.data)
    } catch {
      setItems([])
      setFaculty([])
      setClassrooms([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  function openEdit(item) {
    setEditing(item)
    setForm({
      course_code: item.course_code,
      course_name: item.course_name,
      faculty: item.faculty?.id || '',
      classroom: item.classroom?.id || '',
      enrolled_students: String(item.enrolled_students),
      weekly_hours: String(item.weekly_hours),
    })
    setShowForm(true)
  }

  function openCreate() {
    setEditing(null)
    setForm({
      course_code: '',
      course_name: '',
      faculty: '',
      classroom: '',
      enrolled_students: '',
      weekly_hours: '',
    })
    setShowForm(true)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const payload = {
      course_code: form.course_code,
      course_name: form.course_name,
      faculty: form.faculty ? Number(form.faculty) : null,
      classroom: form.classroom ? Number(form.classroom) : null,
      enrolled_students: Number(form.enrolled_students),
      weekly_hours: Number(form.weekly_hours),
    }
    try {
      if (editing) {
        await api.patch(`/campus/courses/${editing.id}/`, payload)
      } else {
        await api.post('/campus/courses/', payload)
      }
      setShowForm(false)
      setEditing(null)
      setForm({})
      await load()
    } catch {
      alert('Error saving')
    }
  }

  async function handleDelete(item) {
    if (!confirm(`Delete ${item.course_code}?`)) return
    try {
      await api.delete(`/campus/courses/${item.id}/`)
      await load()
    } catch {
      alert('Failed to delete')
    }
  }

  const columns = [
    { key: 'course_code', label: 'Code' },
    { key: 'course_name', label: 'Course Name' },
    { key: 'faculty_name', label: 'Faculty', render: (r) => r.faculty_name || '-' },
    { key: 'classroom_name', label: 'Classroom', render: (r) => r.classroom_name || '-' },
    { key: 'enrolled_students', label: 'Enrolled' },
    { key: 'weekly_hours', label: 'Hours/Week' },
    { key: 'utilization_percent', label: 'Utilization %', render: (r) => `${Number(r.utilization_percent).toFixed(1)}%` },
  ]

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="text-lg font-semibold">Courses</div>
        </div>
        <button onClick={openCreate} className="rounded-lg bg-indigo-500 px-4 py-2 text-sm hover:bg-indigo-400">
          Add New
        </button>
      </div>

      {loading ? (
        <div className="text-sm text-slate-400">Loading...</div>
      ) : (
        <DataTable columns={columns} rows={items} onEdit={openEdit} onDelete={handleDelete} />
      )}

      {showForm ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur">
          <form onSubmit={handleSubmit} className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <div className="mb-4 text-sm font-semibold text-white">{editing ? 'Edit' : 'Add'} Course</div>

            <div className="mb-3">
              <label className="text-xs text-slate-300">Course Code</label>
              <input
                type="text"
                className="mt-1 w-full rounded-lg border border-white/10 bg-slate-950/40 px-3 py-2 text-sm outline-none focus:border-indigo-400"
                value={form.course_code}
                onChange={(e) => setForm((f) => ({ ...f, course_code: e.target.value }))}
                required
              />
            </div>

            <div className="mb-3">
              <label className="text-xs text-slate-300">Course Name</label>
              <input
                type="text"
                className="mt-1 w-full rounded-lg border border-white/10 bg-slate-950/40 px-3 py-2 text-sm outline-none focus:border-indigo-400"
                value={form.course_name}
                onChange={(e) => setForm((f) => ({ ...f, course_name: e.target.value }))}
                required
              />
            </div>

            <div className="mb-3">
              <label className="text-xs text-slate-300">Faculty</label>
              <select
                className="mt-1 w-full rounded-lg border border-white/10 bg-slate-950/40 px-3 py-2 text-sm outline-none focus:border-indigo-400"
                value={form.faculty}
                onChange={(e) => setForm((f) => ({ ...f, faculty: e.target.value }))}
              >
                <option value="">None</option>
                {faculty.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.faculty_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="text-xs text-slate-300">Classroom</label>
              <select
                className="mt-1 w-full rounded-lg border border-white/10 bg-slate-950/40 px-3 py-2 text-sm outline-none focus:border-indigo-400"
                value={form.classroom}
                onChange={(e) => setForm((f) => ({ ...f, classroom: e.target.value }))}
              >
                <option value="">None</option>
                {classrooms.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.classroom_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="text-xs text-slate-300">Enrolled Students</label>
              <input
                type="number"
                className="mt-1 w-full rounded-lg border border-white/10 bg-slate-950/40 px-3 py-2 text-sm outline-none focus:border-indigo-400"
                value={form.enrolled_students}
                onChange={(e) => setForm((f) => ({ ...f, enrolled_students: e.target.value }))}
                required
              />
            </div>

            <div className="mb-3">
              <label className="text-xs text-slate-300">Weekly Hours</label>
              <input
                type="number"
                className="mt-1 w-full rounded-lg border border-white/10 bg-slate-950/40 px-3 py-2 text-sm outline-none focus:border-indigo-400"
                value={form.weekly_hours}
                onChange={(e) => setForm((f) => ({ ...f, weekly_hours: e.target.value }))}
                required
              />
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10"
              >
                Cancel
              </button>
              <button type="submit" className="rounded-lg bg-indigo-500 px-4 py-2 text-sm text-white hover:bg-indigo-400">
                {editing ? 'Save' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  )
}
