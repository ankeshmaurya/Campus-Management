import { useEffect, useState } from 'react'

import { api } from '../../api/client'
import CsvUpload from '../../components/CsvUpload'
import DataTable from '../../components/DataTable'

export default function ClassroomsPage() {
  const demoCsv = `classroom_name,block_name,seating_capacity,is_smart_class
Room 101,Block A,60,true
Room 102,Block A,40,false
Lab 201,Block B,30,true`
  return (
    <>
      <CsvUpload
        endpoint="/campus/classrooms/"
        demoCsvContent={demoCsv}
        demoCsvFilename="classrooms_demo.csv"
      />
      <ClassroomsPageInner />
    </>
  )
}

function ClassroomsPageInner() {
  const [items, setItems] = useState([])
  const [blocks, setBlocks] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({})

  async function load() {
    setLoading(true)
    try {
      const [itemsRes, blocksRes] = await Promise.all([api.get('/campus/classrooms/'), api.get('/campus/blocks/')])
      setItems(itemsRes.data.results || itemsRes.data)
      setBlocks(blocksRes.data.results || blocksRes.data)
    } catch {
      setItems([])
      setBlocks([])
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
      classroom_name: item.classroom_name,
      block: item.block?.id || '',
      seating_capacity: String(item.seating_capacity),
      is_smart_class: item.is_smart_class,
    })
    setShowForm(true)
  }

  function openCreate() {
    setEditing(null)
    setForm({
      classroom_name: '',
      block: '',
      seating_capacity: '',
      is_smart_class: false,
    })
    setShowForm(true)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const payload = {
      classroom_name: form.classroom_name,
      block: Number(form.block),
      seating_capacity: Number(form.seating_capacity),
      is_smart_class: form.is_smart_class,
    }
    try {
      if (editing) {
        await api.patch(`/campus/classrooms/${editing.id}/`, payload)
      } else {
        await api.post('/campus/classrooms/', payload)
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
    if (!confirm(`Delete ${item.classroom_name}?`)) return
    try {
      await api.delete(`/campus/classrooms/${item.id}/`)
      await load()
    } catch {
      alert('Failed to delete')
    }
  }

  const columns = [
    { key: 'classroom_name', label: 'Classroom Number' },
    { key: 'block_name', label: 'Block', render: (r) => r.block_name || '-' },
    { key: 'seating_capacity', label: 'Capacity' },
    { key: 'current_strength', label: 'Current Strength' },
    { key: 'utilization_percent', label: 'Utilization %', render: (r) => `${Number(r.utilization_percent).toFixed(1)}%` },
    { key: 'is_smart_class', label: 'Smart', render: (r) => (r.is_smart_class ? 'Yes' : 'No') },
  ]

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="text-lg font-semibold">Classrooms</div>
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
            <div className="mb-4 text-sm font-semibold text-white">{editing ? 'Edit' : 'Add'} Classroom</div>

            <div className="mb-3">
              <label className="text-xs text-slate-300">Classroom Number</label>
              <input
                type="text"
                className="mt-1 w-full rounded-lg border border-white/10 bg-slate-950/40 px-3 py-2 text-sm outline-none focus:border-indigo-400"
                value={form.classroom_name}
                onChange={(e) => setForm((f) => ({ ...f, classroom_name: e.target.value }))}
                required
              />
            </div>

            <div className="mb-3">
              <label className="text-xs text-slate-300">Block</label>
              <select
                className="mt-1 w-full rounded-lg border border-white/10 bg-slate-950/40 px-3 py-2 text-sm outline-none focus:border-indigo-400"
                value={form.block}
                onChange={(e) => setForm((f) => ({ ...f, block: e.target.value }))}
                required
              >
                <option value="">Select...</option>
                {blocks.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.block_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="text-xs text-slate-300">Seating Capacity</label>
              <input
                type="number"
                className="mt-1 w-full rounded-lg border border-white/10 bg-slate-950/40 px-3 py-2 text-sm outline-none focus:border-indigo-400"
                value={form.seating_capacity}
                onChange={(e) => setForm((f) => ({ ...f, seating_capacity: e.target.value }))}
                required
              />
            </div>

            <label className="flex items-center gap-2 text-xs text-slate-300">
              <input
                type="checkbox"
                checked={form.is_smart_class}
                onChange={(e) => setForm((f) => ({ ...f, is_smart_class: e.target.checked }))}
              />
              Smart Class
            </label>

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
