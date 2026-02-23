import { useEffect, useState } from 'react'

import { api } from '../api/client'

function StatCard({ title, value, subtitle }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
      <div className="text-xs text-slate-300">{title}</div>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
      {subtitle ? <div className="mt-1 text-xs text-slate-400">{subtitle}</div> : null}
    </div>
  )
}

export default function DashboardHome() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true
    api
      .get('/campus/courses/dashboard/')
      .then((res) => mounted && setData(res.data))
      .catch(() => mounted && setError('Failed to load dashboard stats'))

    return () => {
      mounted = false
    }
  }, [])

  return (
    <div>
      <div className="flex items-end justify-between">
        <div>
          <div className="text-lg font-semibold">Overview</div>
          <div className="text-xs text-slate-400">Live utilization + workload snapshot</div>
        </div>
      </div>

      {error ? (
        <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-200">
          {error}
        </div>
      ) : null}

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Students" value={data?.total_students ?? '-'} />
        <StatCard title="Total Faculty" value={data?.total_faculty ?? '-'} />
        <StatCard title="Total Classrooms" value={data?.total_classrooms ?? '-'} />
        <StatCard
          title="Avg Utilization"
          value={data ? `${Number(data.avg_utilization).toFixed(1)}%` : '-'}
          subtitle="Across all classrooms"
        />
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
        <div className="text-sm font-semibold">Alerts</div>
        <div className="mt-2 text-sm text-slate-300">
          Overloaded rooms: <span className="font-semibold text-white">{data?.overloaded_rooms ?? '-'}</span>
        </div>
      </div>
    </div>
  )
}
