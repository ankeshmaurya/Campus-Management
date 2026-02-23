import { Link } from 'react-router-dom'
import { ArrowRight, BarChart3, BookOpen, GraduationCap, Shield, Sparkles, Users } from 'lucide-react'

const features = [
  { icon: Users, title: 'Role-Based Access', desc: 'Admin, Faculty & Student dashboards tailored to each role' },
  { icon: BarChart3, title: 'Real-time Analytics', desc: 'Interactive charts for utilization and workload insights' },
  { icon: BookOpen, title: 'Course Management', desc: 'Manage courses, enrollments and faculty assignments' },
  { icon: Shield, title: 'Secure & Reliable', desc: 'JWT authentication with encrypted data storage' },
  { icon: GraduationCap, title: 'Student Portal', desc: 'Easy access to enrollments, schedules and courses' },
  { icon: Sparkles, title: 'AI Insights', desc: 'Smart recommendations for resource optimization' },
]

export default function Landing() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white">
      {/* Background Orbs */}
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />

      {/* Navigation */}
      <nav className="relative z-10 border-b border-white/5 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500">
              <GraduationCap size={22} />
            </div>
            <span className="text-lg font-semibold">CampusHub</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/about" className="px-4 py-2 text-sm text-slate-300 transition hover:text-white">
              About
            </Link>
            <Link to="/login" className="btn-secondary">
              Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-20">
        <div className="animate-fade-in-up">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs text-indigo-300">
            <Sparkles size={14} />
            <span>Smart AI-Enabled Campus Management</span>
          </div>

          <h1 className="mt-6 max-w-4xl text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl">
            <span className="gradient-text">Streamline</span> Your Entire
            <br />Campus Operations
          </h1>

          <p className="mt-6 max-w-2xl text-lg text-slate-300 leading-relaxed">
            Centralized management for blocks, classrooms, faculty, courses & students.
            Get real-time analytics, smart allocation suggestions, and seamless coordination.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link to="/login" className="btn-primary group inline-flex items-center gap-2">
              Get Started
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link to="/register" className="btn-secondary">
              Create Account
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 gap-6 md:grid-cols-4">
            {[
              { value: '99.9%', label: 'Uptime' },
              { value: '50+', label: 'Institutions' },
              { value: '10K+', label: 'Users' },
              { value: '24/7', label: 'Support' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold gradient-text">{stat.value}</div>
                <div className="mt-1 text-sm text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 border-t border-white/5 bg-black/20 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="text-center">
            <h2 className="text-3xl font-bold">Everything You Need</h2>
            <p className="mt-3 text-slate-400">Powerful features to manage your campus efficiently</p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <div
                key={f.title}
                className="glass-card-hover p-6"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20">
                  <f.icon size={24} className="text-indigo-400" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 border-t border-white/5">
        <div className="mx-auto max-w-7xl px-6 py-16 text-center">
          <h2 className="text-2xl font-bold">Ready to Transform Your Campus?</h2>
          <p className="mt-3 text-slate-400">Join thousands of institutions already using CampusHub</p>
          <div className="mt-8 flex justify-center gap-4">
            <Link to="/login" className="btn-primary">
              Start Free Trial
            </Link>
            <Link to="/about" className="btn-secondary">
              Learn More
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-8 text-center text-sm text-slate-500">
        © 2026 CampusHub. Built for better campus management.
      </footer>
    </div>
  )
}
