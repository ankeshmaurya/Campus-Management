export default function Placeholder({ title }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
      <div className="text-lg font-semibold">{title}</div>
      <div className="mt-2 text-sm text-slate-300">UI will be connected to CRUD APIs in the next step.</div>
    </div>
  )
}
