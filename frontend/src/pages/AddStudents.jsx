import { useState } from 'react'
import CsvUpload from '../components/CsvUpload'
import { api } from '../api/client'

export default function AddStudents() {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({})
  const [message, setMessage] = useState('')

  const demoCsv = `name,registration_number,course_name,semester,username,password
John Doe,S001,B.Tech CSE,3,johndoe,Pass@123
Jane Smith,S002,B.Tech ECE,2,janesmith,Pass@123
Ali Khan,S003,B.Tech ME,4,alikhan,Pass@123`

  async function handleSubmit(e) {
    e.preventDefault()
    setMessage('')
    try {
      const payload = {
        name: form.name,
        registration_number: form.registration_number,
        course_name: form.course_name,
        semester: Number(form.semester),
        username: form.username,
        password: form.password,
      }
      const formData = new FormData()
      Object.entries(payload).forEach(([key, value]) => formData.append(key, value))
      const res = await api.post('/campus/student-users/csv-upload/', formData)
      setMessage(`Success: Student user created`)
      setShowForm(false)
      setForm({})
    } catch (err) {
      const detail = err?.response?.data?.detail || 'Failed to create student'
      setMessage(`Error: ${detail}`)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <div className="text-xl font-semibold">Add Student Users</div>
        <div className="text-sm text-slate-400">Bulk create or manually add student accounts with login credentials</div>
      </div>

      <div className="mb-4">
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-lg bg-indigo-500 px-4 py-2 text-sm hover:bg-indigo-400"
        >
          {showForm ? 'Hide Manual Form' : 'Add Student Manually'}
        </button>
      </div>

      {showForm && (
        <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="text-xs text-slate-300">Name</label>
                <input
                  type="text"
                  className="mt-1 w-full rounded-lg border border-white/10 bg-slate-950/40 px-3 py-2 text-sm outline-none focus:border-indigo-400"
                  value={form.name || ''}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="text-xs text-slate-300">Registration Number</label>
                <input
                  type="text"
                  className="mt-1 w-full rounded-lg border border-white/10 bg-slate-950/40 px-3 py-2 text-sm outline-none focus:border-indigo-400"
                  value={form.registration_number || ''}
                  onChange={(e) => setForm({ ...form, registration_number: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="text-xs text-slate-300">Course Name</label>
                <input
                  type="text"
                  className="mt-1 w-full rounded-lg border border-white/10 bg-slate-950/40 px-3 py-2 text-sm outline-none focus:border-indigo-400"
                  value={form.course_name || ''}
                  onChange={(e) => setForm({ ...form, course_name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="text-xs text-slate-300">Semester</label>
                <input
                  type="number"
                  className="mt-1 w-full rounded-lg border border-white/10 bg-slate-950/40 px-3 py-2 text-sm outline-none focus:border-indigo-400"
                  value={form.semester || ''}
                  onChange={(e) => setForm({ ...form, semester: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="text-xs text-slate-300">Username</label>
                <input
                  type="text"
                  className="mt-1 w-full rounded-lg border border-white/10 bg-slate-950/40 px-3 py-2 text-sm outline-none focus:border-indigo-400"
                  value={form.username || ''}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="text-xs text-slate-300">Password</label>
                <input
                  type="password"
                  className="mt-1 w-full rounded-lg border border-white/10 bg-slate-950/40 px-3 py-2 text-sm outline-none focus:border-indigo-400"
                  value={form.password || ''}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10"
              >
                Cancel
              </button>
              <button type="submit" className="rounded-lg bg-indigo-500 px-4 py-2 text-sm text-white hover:bg-indigo-400">
                Create Student
              </button>
            </div>
          </form>
          {message && (
            <div className={`mt-4 text-sm ${message.startsWith('Error') ? 'text-red-300' : 'text-green-300'}`}>
              {message}
            </div>
          )}
        </div>
      )}

      <CsvUpload
        endpoint="/campus/student-users/"
        demoCsvContent={demoCsv}
        demoCsvFilename="student_users_demo.csv"
      />

      <div className="mt-6 rounded-lg border border-white/10 bg-white/5 p-4">
        <h3 className="text-base font-semibold mb-2">Instructions</h3>
        <ul className="text-sm text-slate-300 list-disc list-inside space-y-1">
          <li>Use the manual form to add individual students</li>
          <li>Or download the demo CSV to bulk upload multiple students</li>
          <li>Each student entry creates a User account and Student profile</li>
          <li>Username must be unique; passwords will be stored securely</li>
          <li>Student users can log in with these credentials</li>
        </ul>
      </div>
    </div>
  )
}
