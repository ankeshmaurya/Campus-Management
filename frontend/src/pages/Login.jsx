import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, GraduationCap, Lock, User } from 'lucide-react'

import { useAuth } from '../auth/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const from = location.state?.from?.pathname || '/app'

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login({ username, password })
      navigate(from, { replace: true })
    } catch (err) {
      setError(err?.response?.data?.detail || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white flex items-center justify-center px-6">
      {/* Background Orbs */}
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />

      <div className="relative z-10 w-full max-w-md animate-fade-in-up">
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 shadow-glow">
              <GraduationCap size={28} />
            </div>
            <span className="text-2xl font-bold">CampusHub</span>
          </Link>
        </div>

        {/* Login Card */}
        <div className="glass-card p-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Welcome Back</h1>
            <p className="mt-2 text-sm text-slate-400">Sign in to access your dashboard</p>
          </div>

          {error && (
            <div className="mt-6 flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200 animate-fade-in">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-500/20">
                <span className="text-lg">!</span>
              </div>
              <span>{error}</span>
            </div>
          )}

          <form className="mt-8 space-y-5" onSubmit={onSubmit}>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Username</label>
              <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  className="input-modern pl-11"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input-modern pl-11 pr-11"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <div className="spinner" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-400">
            {"Don't have an account? "}
            <Link to="/register" className="font-medium text-indigo-400 hover:text-indigo-300 transition">
              Create one
            </Link>
          </div>
        </div>

        {/* Demo Credentials */}
        <div className="mt-6 glass-card p-4">
          <div className="text-xs font-medium text-slate-400 mb-3">Quick Demo Access</div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            {[
              { role: 'Admin', user: 'admin', pass: 'Demo@123' },
              { role: 'Faculty', user: 'faculty1', pass: 'Demo@123' },
              { role: 'Student', user: 'student1', pass: 'Demo@123' },
            ].map((demo) => (
              <button
                key={demo.role}
                type="button"
                onClick={() => {
                  setUsername(demo.user)
                  setPassword(demo.pass)
                }}
                className="rounded-lg border border-white/10 bg-white/5 p-2 text-center hover:bg-white/10 transition"
              >
                <div className="font-medium text-white">{demo.role}</div>
                <div className="text-slate-500 truncate">{demo.user}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
