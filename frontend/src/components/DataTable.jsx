import { Edit3, Trash2 } from 'lucide-react'

export default function DataTable({ columns, rows, onEdit, onDelete, canEdit = true }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-inner-glow">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-white/10 bg-white/5">
            <tr>
              {columns.map((c) => (
                <th key={c.key} className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {c.label}
                </th>
              ))}
              {canEdit ? (
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400 text-right">
                  Actions
                </th>
              ) : null}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {rows.map((r, idx) => (
              <tr 
                key={r.id} 
                className="group transition-colors hover:bg-white/5"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                {columns.map((c) => (
                  <td key={c.key} className="px-5 py-4 text-slate-200">
                    {typeof c.render === 'function' ? c.render(r) : r[c.key]}
                  </td>
                ))}
                {canEdit ? (
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        className="flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-white/15 hover:text-white transition-all"
                        onClick={() => onEdit?.(r)}
                        type="button"
                      >
                        <Edit3 size={14} />
                        Edit
                      </button>
                      <button
                        className="flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-300 hover:bg-red-500/20 hover:text-red-200 transition-all"
                        onClick={() => onDelete?.(r)}
                        type="button"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </td>
                ) : null}
              </tr>
            ))}
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (canEdit ? 1 : 0)} className="px-5 py-12 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="text-slate-500">No data available</div>
                    <div className="text-xs text-slate-600">Add some records to see them here</div>
                  </div>
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
      {rows.length > 0 && (
        <div className="border-t border-white/5 bg-white/5 px-5 py-3">
          <div className="text-xs text-slate-500">
            Showing <span className="text-slate-300 font-medium">{rows.length}</span> record{rows.length !== 1 ? 's' : ''}
          </div>
        </div>
      )}
    </div>
  )
}
