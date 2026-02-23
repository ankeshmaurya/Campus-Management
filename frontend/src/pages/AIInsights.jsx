import { useState } from 'react'

import { api } from '../api/client'
import { useAuth } from '../auth/AuthContext'

export default function AIInsights() {
  const { user } = useAuth()

  const [enrolled, setEnrolled] = useState(60)
  const [preferSmart, setPreferSmart] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const role = user?.role
  const canRunAI = role === 'super_admin'

  async function onSuggest() {
    if (!canRunAI) return
    setError('')
    setResult(null)
    try {
      const res = await api.post('/campus/courses/suggest-classroom/', {
        enrolled_students: enrolled,
        prefer_smart: preferSmart,
      })
      setResult(res.data)
    } catch (err) {
      setError(err?.response?.data?.detail || 'No suggestion available')
    }
  }

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
        <div className="text-sm font-semibold">Smart Classroom Allocation</div>
        <div className="mt-2 text-sm text-slate-300">
          Enter enrolled students and the system suggests the best classroom to avoid overload.
        </div>

        {!canRunAI ? (
          <div className="mt-4 rounded-lg border border-white/10 bg-slate-950/40 p-3 text-sm text-slate-300">
            {role === 'faculty'
              ? 'View-only for Faculty: you can see AI suggestions approved by Admin (execution restricted).'
              : 'AI insights are only available to Admin.'}
          </div>
        ) : null}

        <div className="mt-5 space-y-3">
          <div>
            <label className="text-xs text-slate-300">Enrolled Students</label>
            <input
              type="number"
              className="mt-1 w-full rounded-lg border border-white/10 bg-slate-950/40 px-3 py-2 text-sm outline-none focus:border-indigo-400"
              value={enrolled}
              onChange={(e) => setEnrolled(Number(e.target.value))}
            />
          </div>

          <label className="flex items-center gap-2 text-xs text-slate-300">
            <input type="checkbox" checked={preferSmart} onChange={(e) => setPreferSmart(e.target.checked)} />
            Prefer smart class
          </label>

          <button
            type="button"
            onClick={onSuggest}
            className={[
              'rounded-lg px-4 py-2 text-sm font-medium',
              canRunAI ? 'bg-indigo-500 hover:bg-indigo-400' : 'cursor-not-allowed bg-white/10 text-slate-300',
            ].join(' ')}
            disabled={!canRunAI}
          >
            Suggest Classroom
          </button>

          {error ? (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-200">
              {error}
            </div>
          ) : null}

          {result ? (
            <div className="rounded-lg border border-white/10 bg-slate-950/40 p-4 text-sm">
              <div className="text-xs text-slate-400">Suggested</div>
              <div className="mt-1 font-semibold">
                {result.block_name} - {result.classroom_name}
              </div>
              <div className="mt-2 text-xs text-slate-300">
                Expected utilization: {Number(result.expected_utilization_percent).toFixed(1)}%
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
        <div className="text-sm font-semibold">AI Chat Assistant (Next)</div>
        <div className="mt-2 text-sm text-slate-300">
          Next step: add an AI assistant endpoint (OpenAI optional) that can answer questions like “Which block is most
          underutilized?”.
        </div>
      </div>
    </div>
  )
}
