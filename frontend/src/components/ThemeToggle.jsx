import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => localStorage.getItem('cms_theme') || 'dark')

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') root.classList.add('dark')
    else root.classList.remove('dark')
    localStorage.setItem('cms_theme', theme)
  }, [theme])

  return (
    <button
      type="button"
      className="relative inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-xs text-slate-300 hover:bg-white/10 hover:text-white transition-all overflow-hidden group"
      onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
    >
      <div className="relative">
        {theme === 'dark' ? (
          <Sun size={16} className="text-amber-400" />
        ) : (
          <Moon size={16} className="text-indigo-400" />
        )}
      </div>
      <span className="font-medium">{theme === 'dark' ? 'Light' : 'Dark'}</span>
    </button>
  )
}
