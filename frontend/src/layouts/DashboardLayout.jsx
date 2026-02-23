import { useState, useRef, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { LogOut, Bell, X, CheckCircle, AlertCircle, Info } from 'lucide-react'

import { useAuth } from '../auth/AuthContext'
import Sidebar from '../components/Sidebar'
import ThemeToggle from '../components/ThemeToggle'

export default function DashboardLayout() {
  const { user, logout } = useAuth()
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'info', title: 'Welcome!', message: 'Welcome to CampusHub. Explore the dashboard.', time: 'Just now', read: false },
    { id: 2, type: 'success', title: 'Profile Updated', message: 'Your profile has been updated successfully.', time: '5 min ago', read: false },
    { id: 3, type: 'alert', title: 'New Course Available', message: 'Check out the new courses added this semester.', time: '1 hour ago', read: false },
  ])
  const notifRef = useRef(null)

  const unreadCount = notifications.filter(n => !n.read).length

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const dismissNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const getIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle size={16} className="text-emerald-400" />
      case 'alert': return <AlertCircle size={16} className="text-amber-400" />
      default: return <Info size={16} className="text-blue-400" />
    }
  }

  const roleLabel =
    user?.role === 'super_admin'
      ? 'Admin Dashboard'
      : user?.role === 'faculty'
        ? 'Faculty Dashboard'
        : user?.role === 'student'
          ? 'Student Dashboard'
          : 'Dashboard'

  const roleColor =
    user?.role === 'super_admin'
      ? 'from-indigo-500 to-purple-500'
      : user?.role === 'faculty'
        ? 'from-emerald-500 to-teal-500'
        : 'from-amber-500 to-orange-500'

  return (
    <div className="h-full min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white">
      <div className="flex min-h-screen">
        <Sidebar />

        <div className="flex min-h-screen flex-1 flex-col ml-64">
          {/* Header */}
          <header className="sticky top-0 z-10 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-4">
                <div className={`h-2.5 w-2.5 rounded-full bg-gradient-to-r ${roleColor} animate-pulse-slow`} />
                <div>
                  <div className="text-base font-semibold">{roleLabel}</div>
                  <div className="text-sm text-slate-400">
                    Welcome back, <span className="text-white">{user?.username}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Notification Button with Dropdown */}
                <div className="relative" ref={notifRef}>
                  <button
                    type="button"
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative rounded-xl border border-white/10 bg-white/5 p-2.5 text-slate-400 hover:bg-white/10 hover:text-white transition-all"
                  >
                    <Bell size={18} />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-[10px] flex items-center justify-center font-medium animate-pulse">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notification Dropdown */}
                  {showNotifications && (
                    <div className="absolute right-0 top-full mt-2 w-80 rounded-xl border border-white/10 bg-slate-900/95 backdrop-blur-xl shadow-2xl animate-fade-in overflow-hidden z-50">
                      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                        <h3 className="font-semibold text-sm">Notifications</h3>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                          >
                            Mark all as read
                          </button>
                        )}
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="px-4 py-8 text-center text-slate-500 text-sm">
                            No notifications
                          </div>
                        ) : (
                          notifications.map(notif => (
                            <div
                              key={notif.id}
                              onClick={() => markAsRead(notif.id)}
                              className={`px-4 py-3 border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors ${!notif.read ? 'bg-indigo-500/5' : ''}`}
                            >
                              <div className="flex items-start gap-3">
                                <div className="mt-0.5">{getIcon(notif.type)}</div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between gap-2">
                                    <span className={`text-sm font-medium ${!notif.read ? 'text-white' : 'text-slate-300'}`}>
                                      {notif.title}
                                    </span>
                                    <button
                                      onClick={(e) => { e.stopPropagation(); dismissNotification(notif.id); }}
                                      className="text-slate-500 hover:text-slate-300 transition-colors"
                                    >
                                      <X size={14} />
                                    </button>
                                  </div>
                                  <p className="text-xs text-slate-400 mt-0.5 truncate">{notif.message}</p>
                                  <span className="text-[10px] text-slate-500 mt-1 block">{notif.time}</span>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <ThemeToggle />
                <button
                  className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-300 hover:bg-white/10 hover:text-white transition-all"
                  onClick={logout}
                  type="button"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6 animate-fade-in">
            <Outlet />
          </main>

          {/* Footer */}
          <footer className="border-t border-white/5 px-6 py-4 text-center text-xs text-slate-500">
            CampusHub © 2026 • Built for efficient campus management
          </footer>
        </div>
      </div>
    </div>
  )
}
