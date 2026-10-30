export default function Card({ children, className = '' }) {
  return (
    <div
      className={`rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 shadow-xl shadow-black/20 sm:p-6 ${className}`}
    >
      {children}
    </div>
  )
}
