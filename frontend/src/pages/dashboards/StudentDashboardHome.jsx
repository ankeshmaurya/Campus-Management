import { useEffect, useMemo, useState } from 'react'
import { BookOpen, TrendingUp, Bell, Calendar, AlertTriangle, CheckCircle } from 'lucide-react'

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

export default function StudentDashboardHome() {
  const [courses, setCourses] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true
    setError('')

    api
      .get('/campus/courses/')
      .then((res) => mounted && setCourses(res.data?.results || res.data || []))
      .catch(() => mounted && setError('Failed to load student dashboard'))

    return () => {
      mounted = false
    }
  }, [])

  const summary = useMemo(() => {
    const total = (courses || []).length
    const avgUtil =
      total === 0 ? 0 : (courses || []).reduce((acc, x) => acc + Number(x.utilization_percent || 0), 0) / total
    return { total, avgUtil }
  }, [courses])

  return (
    <div className="animate-fade-in-up">
      <div className="flex items-end justify-between mb-8">
        <div>
          <div className="text-2xl font-bold">Student Dashboard</div>
          <div className="mt-1 text-sm text-slate-400">Your courses, classroom info and schedule</div>
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
          title="Enrolled Courses" 
          value={summary.total} 
          icon={BookOpen}
          gradient="from-indigo-500 to-purple-500"
        />
        <StatCard 
          title="Seat Utilization" 
          value={`${Number(summary.avgUtil).toFixed(1)}%`} 
          subtitle="Average across classrooms"
          icon={TrendingUp}
          gradient="from-emerald-500 to-teal-500"
        />
        <StatCard 
          title="Notifications" 
          value="—" 
          subtitle="Coming soon"
          icon={Bell}
          gradient="from-amber-500 to-orange-500"
        />
        <StatCard 
          title="Schedule" 
          value="—" 
          subtitle="Coming soon"
          icon={Calendar}
          gradient="from-pink-500 to-rose-500"
        />
      </div>

      <div className="mt-8 glass-card-hover p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-8 w-1 rounded-full bg-gradient-to-b from-indigo-500 to-purple-500" />
          <div className="text-base font-semibold">What You Can Do</div>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition">
            <CheckCircle size={18} className="text-emerald-400" />
            <div className="text-sm text-slate-300">View enrolled courses & classrooms</div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition">
            <CheckCircle size={18} className="text-emerald-400" />
            <div className="text-sm text-slate-300">See faculty assigned to your courses</div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition">
            <CheckCircle size={18} className="text-emerald-400" />
            <div className="text-sm text-slate-300">Track seat utilization status</div>
          </div>
        </div>
      </div>
    </div>
  )
}
