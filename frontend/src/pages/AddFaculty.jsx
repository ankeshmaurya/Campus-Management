import { useState } from 'react'
import CsvUpload from '../components/CsvUpload'
import { api } from '../api/client'

export default function AddFaculty() {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({})
  const [message, setMessage] = useState('')

  const demoCsv = `faculty_name,registration_number,department,max_weekly_hours,assigned_hours,username,password
Dr. Alice,F001,Computer Science,20,15,alice,Pass@123
Prof. Bob,F002,Electrical,18,14,bob,Pass@123
Ms. Carol,F003,Mechanical,20,16,carol,Pass@123`

  async function handleSubmit(e) {
    e.preventDefault()
    setMessage('')
    try {
      const payload = {
        faculty_name: form.faculty_name,
        registration_number: form.registration_number,
        department: form.department,
        max_weekly_hours: Number(form.max_weekly_hours),
        assigned_hours: Number(form.assigned_hours),
        username: form.username,
        password: form.password,
      }
      await api.post('/campus/faculty-users/csv-upload/', new FormData())
      // For manual creation, we'll use a different approach
      const formData = new FormData()
      Object.entries(payload).forEach(([key, value]) => formData.append(key, value))
      const res = await api.post('/campus/faculty-users/csv-upload/', formData)
      setMessage(`Success: Faculty user created`)
      setShowForm(false)
      setForm({})
    } catch (err) {
      const detail = err?.response?.data?.detail || 'Failed to create faculty'
      setMessage(`Error: ${detail}`)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <div className="text-xl font-semibold">Add Faculty Users</div>
        <div className="text-sm text-slate-400">Bulk create or manually add faculty accounts with login credentials</div>
      </div>

      <div className="mb-4">
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-lg bg-indigo-500 px-4 py-2 text-sm hover:bg-indigo-400"
        >
          {showForm ? 'Hide Manual Form' : 'Add Faculty Manually'}
        </button>
      </div>

      {showForm && (
        <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="text-xs text-slate-300">Faculty Name</label>
                <input
                  type="text"
                  className="mt-1 w-full rounded-lg border border-white/10 bg-slate-950/40 px-3 py-2 text-sm outline-none focus:border-indigo-400"
                  value={form.faculty_name || ''}
                  onChange={(e) => setForm({ ...form, faculty_name: e.target.value })}
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
                <label className="text-xs text-slate-300">Department</label>
                <input
                  type="text"
                  className="mt-1 w-full rounded-lg border border-white/10 bg-slate-950/40 px-3 py-2 text-sm outline-none focus:border-indigo-400"
                  value={form.department || ''}
                  onChange={(e) => setForm({ ...form, department: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="text-xs text-slate-300">Max Weekly Hours</label>
                <input
                  type="number"
                  className="mt-1 w-full rounded-lg border border-white/10 bg-slate-950/40 px-3 py-2 text-sm outline-none focus:border-indigo-400"
                  value={form.max_weekly_hours || ''}
                  onChange={(e) => setForm({ ...form, max_weekly_hours: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="text-xs text-slate-300">Assigned Hours</label>
                <input
                  type="number"
                  className="mt-1 w-full rounded-lg border border-white/10 bg-slate-950/40 px-3 py-2 text-sm outline-none focus:border-indigo-400"
                  value={form.assigned_hours || ''}
                  onChange={(e) => setForm({ ...form, assigned_hours: e.target.value })}
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
              <div className="md:col-span-2">
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
                Create Faculty
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
        endpoint="/campus/faculty-users/"
        demoCsvContent={demoCsv}
        demoCsvFilename="faculty_users_demo.csv"
      />

      <div className="mt-6 rounded-lg border border-white/10 bg-white/5 p-4">
        <h3 className="text-base font-semibold mb-2">Instructions</h3>
        <ul className="text-sm text-slate-300 list-disc list-inside space-y-1">
          <li>Use the manual form to add individual faculty members</li>
          <li>Or download the demo CSV to bulk upload multiple faculty</li>
          <li>Each faculty entry creates a User account and Faculty profile</li>
          <li>Username must be unique; passwords will be stored securely</li>
          <li>Faculty users can log in with these credentials</li>
        </ul>
      </div>
    </div>
  )
}
