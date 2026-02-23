import { NavLink } from 'react-router-dom'
import {
  BarChart3,
  Blocks,
  BookOpen,
  BrainCircuit,
  ClipboardList,
  GraduationCap,
  Home,
  School,
  Users,
} from 'lucide-react'

import { useAuth } from '../auth/AuthContext'

export default function Sidebar() {
  const { user } = useAuth()
  const role = user?.role

  const items = [
    { to: '/app', label: 'Dashboard', icon: Home },
    ...(role === 'super_admin'
      ? [
          { to: '/app/blocks', label: 'Blocks', icon: Blocks },
          { to: '/app/classrooms', label: 'Classrooms', icon: School },
          { to: '/app/courses', label: 'Courses', icon: BookOpen },
          { to: '/app/faculty', label: 'Faculty', icon: Users },
          { to: '/app/students', label: 'Students', icon: GraduationCap },
          { to: '/app/add-faculty', label: 'Add Faculty', icon: Users },
          { to: '/app/add-students', label: 'Add Students', icon: GraduationCap },
          { to: '/app/analytics', label: 'Analytics', icon: BarChart3 },
          { to: '/app/ai-insights', label: 'AI Insights', icon: BrainCircuit },
        ]
      : role === 'faculty'
        ? [
            { to: '/app/my-courses', label: 'My Courses', icon: BookOpen },
            { to: '/app/my-enrollments', label: 'My Enrollments', icon: ClipboardList },
            { to: '/app/analytics', label: 'Analytics (Limited)', icon: BarChart3 },
            { to: '/app/ai-insights', label: 'AI Insights (View)', icon: BrainCircuit },
          ]
        : [
            { to: '/app/my-courses', label: 'My Courses', icon: BookOpen },
            { to: '/app/my-enrollments', label: 'My Enrollments', icon: ClipboardList },
          ]),
  ]

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 shrink-0 border-r border-white/10 bg-slate-950/80 backdrop-blur-xl">
      {/* Logo Section */}
      <div className="px-5 py-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 shadow-glow-sm">
            <GraduationCap size={20} />
          </div>
          <div>
            <div className="text-sm font-semibold text-white">CampusHub</div>
            <div className="text-xs text-slate-500">Management System</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="px-3 py-4 space-y-1">
        {items.map((it) => (
          <NavLink
            key={it.to}
            to={it.to}
            end={it.to === '/app'}
            className={({ isActive }) =>
              [
                'nav-link group',
                isActive
                  ? 'nav-link-active'
                  : 'nav-link-inactive',
              ].join(' ')
            }
          >
            <it.icon size={18} className="opacity-80 group-hover:opacity-100 transition-opacity" />
            <span>{it.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/5">
        <div className="glass-card p-3 text-center">
          <div className="text-xs text-slate-400">Logged in as</div>
          <div className="text-sm font-medium text-white mt-1 truncate">{user?.username}</div>
          <div className="text-xs text-indigo-400 capitalize mt-0.5">{role?.replace('_', ' ')}</div>
        </div>
      </div>
    </aside>
  )
}
