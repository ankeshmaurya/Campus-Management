import { Link } from 'react-router-dom'
import { ArrowLeft, Code, Database, Layout, Lock, Sparkles, Zap } from 'lucide-react'

const techStack = [
  { icon: Layout, name: 'React 19', desc: 'Modern UI framework with hooks' },
  { icon: Zap, name: 'Vite', desc: 'Lightning-fast build tool' },
  { icon: Code, name: 'Tailwind CSS', desc: 'Utility-first styling' },
  { icon: Database, name: 'Django REST', desc: 'Robust backend API' },
  { icon: Lock, name: 'JWT Auth', desc: 'Secure authentication' },
  { icon: Sparkles, name: 'AI Insights', desc: 'Smart recommendations' },
]

export default function About() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white">
      {/* Background Orbs */}
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />

      <div className="relative z-10 mx-auto max-w-4xl px-6 py-16">
        {/* Back Link */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition mb-8"
        >
          <ArrowLeft size={16} />
          Back to Home
        </Link>

        {/* Header */}
        <div className="animate-fade-in-up">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs text-indigo-300 mb-6">
            <Sparkles size={14} />
            <span>About CampusHub</span>
          </div>

          <h1 className="text-4xl font-bold">
            Modern Campus <span className="gradient-text">Management</span>
          </h1>
          
          <p className="mt-6 text-lg text-slate-300 leading-relaxed max-w-2xl">
            A comprehensive platform demonstrating role-based access control, real-time analytics dashboards,
            and intelligent suggestions for classroom allocation and workload balancing.
          </p>
        </div>

        {/* Features */}
        <div className="mt-12 glass-card p-8 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <h2 className="text-xl font-semibold mb-6">Key Capabilities</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5">
              <div className="h-2 w-2 rounded-full bg-indigo-500 mt-2" />
              <div>
                <div className="font-medium">Role-Based Dashboards</div>
                <div className="text-sm text-slate-400">Tailored experiences for Admin, Faculty & Students</div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5">
              <div className="h-2 w-2 rounded-full bg-emerald-500 mt-2" />
              <div>
                <div className="font-medium">Real-time Analytics</div>
                <div className="text-sm text-slate-400">Interactive charts for utilization & workload</div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5">
              <div className="h-2 w-2 rounded-full bg-amber-500 mt-2" />
              <div>
                <div className="font-medium">Bulk Operations</div>
                <div className="text-sm text-slate-400">CSV import for mass data entry</div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5">
              <div className="h-2 w-2 rounded-full bg-pink-500 mt-2" />
              <div>
                <div className="font-medium">AI-Powered Insights</div>
                <div className="text-sm text-slate-400">Smart recommendations for optimization</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mt-8 glass-card p-8 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <h2 className="text-xl font-semibold mb-6">Technology Stack</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {techStack.map((tech) => (
              <div key={tech.name} className="flex items-center gap-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20">
                  <tech.icon size={20} className="text-indigo-400" />
                </div>
                <div>
                  <div className="font-medium text-sm">{tech.name}</div>
                  <div className="text-xs text-slate-500">{tech.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          <Link to="/login" className="btn-primary inline-flex items-center gap-2">
            Get Started
          </Link>
        </div>
      </div>
    </div>
  )
}
