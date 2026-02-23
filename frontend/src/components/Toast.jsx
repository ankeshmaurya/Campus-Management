import { createContext, useContext, useMemo, useState } from 'react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null)

  function show(message, variant = 'info') {
    setToast({ message, variant })
    window.setTimeout(() => setToast(null), 2500)
  }

  const value = useMemo(() => ({ show }), [])

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast ? (
        <div className="fixed bottom-5 right-5 z-50">
          <div
            className={[
              'rounded-xl border px-4 py-3 text-sm shadow-lg backdrop-blur',
              toast.variant === 'error'
                ? 'border-red-500/30 bg-red-500/10 text-red-200'
                : 'border-white/10 bg-slate-950/70 text-white',
            ].join(' ')}
          >
            {toast.message}
          </div>
        </div>
      ) : null}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
