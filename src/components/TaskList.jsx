import { BookOpen, Code2, RefreshCw } from 'lucide-react'
import Card from './Card.jsx'
import { formatDuration } from '../lib/format.js'

const TYPE_STYLES = {
  theory: {
    label: 'Theory',
    icon: BookOpen,
    className: 'bg-secondary-500/10 text-secondary-300 ring-secondary-500/30',
  },
  practical: {
    label: 'Practical',
    icon: Code2,
    className: 'bg-warning-500/10 text-warning-300 ring-warning-500/30',
  },
  revision: {
    label: 'Revision',
    icon: RefreshCw,
    className: 'bg-accent-500/10 text-accent-300 ring-accent-500/30',
  },
}

function TaskItem({ task, checked, onToggle }) {
  const type = TYPE_STYLES[task.type]
  const TypeIcon = type.icon

  return (
    <li>
      <label
        className={`flex cursor-pointer items-start gap-4 rounded-xl border border-zinc-800 bg-zinc-950/60 p-4 transition hover:border-zinc-700 hover:bg-zinc-900 ${
          checked ? 'opacity-60' : ''
        }`}
      >
        <input
          type="checkbox"
          checked={checked}
          onChange={() => onToggle(task.id)}
          className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-emerald-500"
        />
        <div className="min-w-0 flex-1 space-y-2">
          <p
            className={`text-sm font-medium leading-snug text-zinc-100 ${
              checked ? 'text-zinc-400 line-through' : ''
            }`}
          >
            {task.title}
          </p>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium ring-1 ring-inset ${type.className}`}
            >
              <TypeIcon className="h-3 w-3" aria-hidden="true" />
              {type.label}
            </span>
            <span className="text-zinc-400">{task.subject}</span>
            <span className="font-mono text-zinc-500">{formatDuration(task.minutes)}</span>
          </div>
        </div>
      </label>
    </li>
  )
}

export default function TaskList({ tasks, completed, onToggle }) {
  const doneCount = tasks.filter((task) => completed[task.id]).length

  return (
    <Card>
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-zinc-50">Today's tasks</h2>
          <p className="text-sm text-zinc-400">Tick tasks off as you finish them.</p>
        </div>
        <span className="rounded-full border border-zinc-800 px-3 py-1 font-mono text-xs text-zinc-300">
          {doneCount}/{tasks.length}
        </span>
      </div>
      <ul className="space-y-3">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            checked={Boolean(completed[task.id])}
            onToggle={onToggle}
          />
        ))}
      </ul>
    </Card>
  )
}
