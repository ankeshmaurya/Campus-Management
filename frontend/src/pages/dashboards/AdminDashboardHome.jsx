import { useEffect, useState } from 'react'
import { Users, GraduationCap, School, AlertTriangle, TrendingUp } from 'lucide-react'

import { api } from '../../api/client'

function StatCard({ title, value, subtitle, icon: Icon, gradient }) {
  return (
    <div className="glass-card-hover p-6 group">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm font-medium text-slate-400">{title}</div>
          <div className="mt-2 text-3xl font-bold gradient-text">{value}</div>
          {subtitle ? <div className="mt-2 text-xs text-slate-500">{subtitle}</div> : null}
        </div>
        {Icon && (
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} shadow-glow-sm group-hover:scale-110 transition-transform`}>
            <Icon size={22} className="text-white" />
          </div>
        )}
      </div>
    </div>
  )
}

export default function AdminDashboardHome() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true
    api
      .get('/campus/students/dashboard/')
      .then((res) => mounted && setData(res.data))
      .catch(() => mounted && setError('Failed to load dashboard stats'))

    return () => {
      mounted = false
    }
  }, [])

  return (
    <div className="animate-fade-in-up">
      <div className="flex items-end justify-between mb-8">
        <div>
          <div className="text-2xl font-bold">Admin Overview</div>
          <div className="mt-1 text-sm text-slate-400">Monitor campus metrics and utilization at a glance</div>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          Live data
        </div>
      </div>

      {error ? (
        <div className="glass-card border-red-500/30 bg-red-500/10 p-5 text-sm text-red-200 flex items-center gap-3">
          <AlertTriangle size={20} />
          {error}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard 
          title="Total Students" 
          value={data?.total_students ?? '—'} 
          icon={GraduationCap}
          gradient="from-indigo-500 to-purple-500"
        />
        <StatCard 
          title="Total Faculty" 
          value={data?.total_faculty ?? '—'} 
          icon={Users}
          gradient="from-emerald-500 to-teal-500"
        />
        <StatCard 
          title="Total Classrooms" 
          value={data?.total_classrooms ?? '—'} 
          icon={School}
          gradient="from-amber-500 to-orange-500"
        />
        <StatCard
          title="Avg Utilization"
          value={data ? `${Number(data.avg_utilization).toFixed(1)}%` : '—'}
          subtitle="Across all classrooms"
          icon={TrendingUp}
          gradient="from-pink-500 to-rose-500"
        />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 xl:grid-cols-2">
        <div className="glass-card-hover p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-8 w-1 rounded-full bg-gradient-to-b from-indigo-500 to-purple-500" />
            <div className="text-base font-semibold">Quick Actions</div>
          </div>
          <div className="space-y-3 text-sm text-slate-300">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition cursor-pointer">
              <div className="h-2 w-2 rounded-full bg-indigo-500" />
              Manage Blocks, Classrooms & Courses
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition cursor-pointer">
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
              Assign faculty & classrooms to courses
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition cursor-pointer">
              <div className="h-2 w-2 rounded-full bg-amber-500" />
              Enroll students and track distribution
            </div>
          </div>
        </div>

        <div className="glass-card-hover p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-8 w-1 rounded-full bg-gradient-to-b from-red-500 to-pink-500" />
            <div className="text-base font-semibold">Alerts & Notifications</div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl border border-red-500/20 bg-red-500/10">
              <div className="text-sm text-red-200">Overloaded Rooms</div>
              <div className="text-lg font-bold text-red-300">{data?.overloaded_rooms ?? '—'}</div>
            </div>
            <div className="text-sm text-slate-400">
              Use the <span className="text-white font-medium">Analytics</span> section for detailed capacity graphs and enrollment trends.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
