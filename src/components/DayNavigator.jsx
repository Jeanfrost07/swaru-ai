import { CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react'

export default function DayNavigator({ schedule, completed, currentDay, onSelectDay }) {
  const totalDays = schedule.length
  const goTo = (day) => onSelectDay(Math.min(Math.max(day, 1), totalDays))

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => goTo(currentDay - 1)}
        disabled={currentDay <= 1}
        aria-label="Previous day"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-zinc-800 text-zinc-300 transition hover:border-zinc-600 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronLeft className="h-5 w-5" aria-hidden="true" />
      </button>

      <div className="flex min-w-0 flex-1 gap-2 overflow-x-auto pb-1 [scrollbar-width:thin]">
        {schedule.map((day) => {
          const isActive = day.day === currentDay
          const isDone = day.tasks.every((task) => completed[task.id])
          return (
            <button
              key={day.day}
              type="button"
              onClick={() => goTo(day.day)}
              aria-current={isActive ? 'step' : undefined}
              className={`flex h-10 shrink-0 items-center gap-1.5 rounded-lg px-3 text-sm font-medium transition ${
                isActive
                  ? 'bg-primary-500 text-zinc-950'
                  : 'border border-zinc-800 text-zinc-300 hover:border-zinc-600 hover:bg-zinc-800'
              }`}
            >
              {isDone && <CheckCircle2 className="h-4 w-4" aria-label="Completed" />}
              Day {day.day}
            </button>
          )
        })}
      </div>

      <button
        type="button"
        onClick={() => goTo(currentDay + 1)}
        disabled={currentDay >= totalDays}
        aria-label="Next day"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-zinc-800 text-zinc-300 transition hover:border-zinc-600 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronRight className="h-5 w-5" aria-hidden="true" />
      </button>
    </div>
  )
}
