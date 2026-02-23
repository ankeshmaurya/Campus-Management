import { useEffect, useState } from 'react'

import { api } from '../../api/client'
import DataTable from '../../components/DataTable'

export default function CrudPage({ title, endpoint, columns, formFields, mapFormData, mapRowData }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({})

  async function load() {
    setLoading(true)
    try {
      const res = await api.get(endpoint)
      setItems(res.data.results || res.data)
    } catch {
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [endpoint])

  function openEdit(item) {
    setEditing(item)
    setForm(mapRowData(item))
    setShowForm(true)
  }

  function openCreate() {
    setEditing(null)
    setForm(Object.fromEntries(formFields.map((f) => [f.name, ''])))
    setShowForm(true)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const payload = mapFormData(form)
    try {
      if (editing) {
        await api.patch(`${endpoint}${editing.id}/`, payload)
      } else {
        await api.post(endpoint, payload)
      }
      setShowForm(false)
      setEditing(null)
      setForm({})
      await load()
    } catch (err) {
      alert('Error saving: ' + (err?.response?.data?.detail || 'Unknown'))
    }
  }

  async function handleDelete(item) {
    if (!confirm(`Delete ${item[columns[0].key]}?`)) return
    try {
      await api.delete(`${endpoint}${item.id}/`)
      await load()
    } catch {
      alert('Failed to delete')
    }
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="text-lg font-semibold">{title}</div>
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
            <div className="mb-4 text-sm font-semibold text-white">{editing ? 'Edit' : 'Add'} {title}</div>

            {formFields.map((field) => (
              <div key={field.name} className="mb-3">
                <label className="text-xs text-slate-300">{field.label}</label>
                {field.type === 'select' ? (
                  <select
                    className="mt-1 w-full rounded-lg border border-white/10 bg-slate-950/40 px-3 py-2 text-sm outline-none focus:border-indigo-400"
                    value={form[field.name]}
                    onChange={(e) => setForm((f) => ({ ...f, [field.name]: e.target.value }))}
                    required={field.required}
                  >
                    <option value="">Select...</option>
                    {field.options.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type || 'text'}
                    className="mt-1 w-full rounded-lg border border-white/10 bg-slate-950/40 px-3 py-2 text-sm outline-none focus:border-indigo-400"
                    value={form[field.name]}
                    onChange={(e) => setForm((f) => ({ ...f, [field.name]: e.target.value }))}
                    required={field.required}
                  />
                )}
              </div>
            ))}

            <div className="flex justify-end gap-2">
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
