const RADIUS = 42
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export default function ProgressRing({ percent }) {
  const offset = CIRCUMFERENCE * (1 - percent / 100)

  return (
    <div className="relative h-28 w-28 shrink-0">
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90" aria-hidden="true">
        <circle cx="50" cy="50" r={RADIUS} fill="none" strokeWidth="8" className="stroke-zinc-800" />
        <circle
          cx="50"
          cy="50"
          r={RADIUS}
          fill="none"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          className="stroke-primary-400 transition-all duration-500 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xl font-semibold text-zinc-50">{percent}%</span>
      </div>
    </div>
  )
}
