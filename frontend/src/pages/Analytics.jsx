import { useEffect, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { api } from '../api/client'

const COLORS = ['#6366f1', '#22c55e', '#f97316', '#ef4444', '#06b6d4', '#a855f7']

export default function Analytics() {
  const [blocks, setBlocks] = useState([])
  const [faculty, setFaculty] = useState([])
  const [trend, setTrend] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true
    setLoading(true)
    setError('')

    Promise.all([
      api.get('/campus/analytics/block-utilization/'),
      api.get('/campus/analytics/faculty-workload/'),
      api.get('/campus/analytics/enrollment-trend/?days=30'),
    ])
      .then(([b, f, t]) => {
        if (!mounted) return
        setBlocks(b.data || [])
        setFaculty(f.data || [])
        setTrend(t.data || [])
      })
      .catch(() => mounted && setError('Failed to load analytics'))
      .finally(() => mounted && setLoading(false))

    return () => {
      mounted = false
    }
  }, [])

  const blockPie = blocks.map((b) => ({
    name: b.block_name,
    value: Number(b.utilization_percent || 0),
  }))

  const facultyBar = faculty.map((f) => ({
    name: f.faculty_name,
    workload: Number(f.workload_percent || 0),
  }))

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6">
      <div className="mb-6">
        <div className="text-xl font-semibold">Analytics</div>
        <div className="text-sm text-slate-400">Real-time insights based on your current data</div>
      </div>

      {error ? (
        <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">{error}</div>
      ) : null}

      {loading ? (
        <div className="text-sm text-slate-400">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <div className="text-base font-semibold">Block Utilization (%)</div>
            <div className="mt-4 h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={blockPie} dataKey="value" nameKey="name" outerRadius={110}>
                    {blockPie.map((_, idx) => (
                      <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 text-sm text-slate-400">Value is utilization percent for each block.</div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <div className="text-base font-semibold">Faculty Workload (%)</div>
            <div className="mt-4 h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={facultyBar} margin={{ left: 10, right: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-25} textAnchor="end" height={70} />
                  <YAxis tick={{ fontSize: 11 }} domain={[0, 120]} />
                  <Tooltip />
                  <Bar dataKey="workload" fill="#6366f1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 text-sm text-slate-400">Above 100% means overloaded.</div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur xl:col-span-2">
            <div className="text-base font-semibold">Enrollment Trend (Last 30 days)</div>
            <div className="mt-4 h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trend} margin={{ left: 10, right: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#22c55e" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
