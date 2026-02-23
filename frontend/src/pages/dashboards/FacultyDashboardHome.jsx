import { useEffect, useMemo, useState } from 'react'
import { BookOpen, Clock, AlertTriangle, Gauge, Bell } from 'lucide-react'

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

export default function FacultyDashboardHome() {
  const [courses, setCourses] = useState([])
  const [workload, setWorkload] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true
    setError('')

    Promise.all([api.get('/campus/courses/'), api.get('/campus/analytics/faculty-workload/')])
      .then(([c, w]) => {
        if (!mounted) return
        setCourses(c.data?.results || c.data || [])
        setWorkload(w.data || [])
      })
      .catch(() => mounted && setError('Failed to load faculty dashboard'))

    return () => {
      mounted = false
    }
  }, [])

  const totals = useMemo(() => {
    const totalHours = (courses || []).reduce((acc, x) => acc + Number(x.weekly_hours || 0), 0)
    const courseCount = (courses || []).length
    return { totalHours, courseCount }
  }, [courses])

  const me = useMemo(() => {
    if (!Array.isArray(workload) || workload.length === 0) return null
    return workload[0]
  }, [workload])

  return (
    <div className="animate-fade-in-up">
      <div className="flex items-end justify-between mb-8">
        <div>
          <div className="text-2xl font-bold">Faculty Dashboard</div>
          <div className="mt-1 text-sm text-slate-400">Track your courses, workload and schedule</div>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          Live data
        </div>
      </div>

      {error ? (
        <div className="glass-card border-red-500/30 bg-red-500/10 p-5 text-sm text-red-200 flex items-center gap-3 mb-6">
          <AlertTriangle size={20} />
          {error}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard 
          title="Assigned Courses" 
          value={totals.courseCount} 
          icon={BookOpen}
          gradient="from-emerald-500 to-teal-500"
        />
        <StatCard 
          title="Weekly Hours" 
          value={totals.totalHours} 
          subtitle="Sum across your courses"
          icon={Clock}
          gradient="from-indigo-500 to-purple-500"
        />
        <StatCard 
          title="Workload %" 
          value={me ? `${Number(me.workload_percent || 0).toFixed(1)}%` : '—'} 
          icon={Gauge}
          gradient="from-amber-500 to-orange-500"
        />
        <StatCard 
          title="Status" 
          value={me?.workload_status || '—'} 
          icon={AlertTriangle}
          gradient="from-pink-500 to-rose-500"
        />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 xl:grid-cols-2">
        <div className="glass-card-hover p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-8 w-1 rounded-full bg-gradient-to-b from-emerald-500 to-teal-500" />
            <div className="text-base font-semibold">Quick Actions</div>
          </div>
          <div className="space-y-3 text-sm text-slate-300">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition cursor-pointer">
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
              View your assigned courses
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition cursor-pointer">
              <div className="h-2 w-2 rounded-full bg-indigo-500" />
              Check enrolled student count
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition cursor-pointer">
              <div className="h-2 w-2 rounded-full bg-amber-500" />
              Monitor overload warnings
            </div>
          </div>
        </div>

        <div className="glass-card-hover p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-8 w-1 rounded-full bg-gradient-to-b from-indigo-500 to-purple-500" />
            <div className="text-base font-semibold">Notifications</div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-xl border border-white/10 bg-white/5">
            <Bell size={20} className="text-slate-400" />
            <div className="text-sm text-slate-400">
              Course reassignment and workload change alerts coming soon.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
