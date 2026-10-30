import { useState } from 'react'
import { Bell, BellRing } from 'lucide-react'
import Card from './Card.jsx'

const isNotificationSupported = typeof window !== 'undefined' && 'Notification' in window

export default function ReminderToggle({ reminders, onChange }) {
  const [message, setMessage] = useState('')

  const handleToggle = async () => {
    if (reminders.enabled) {
      setMessage('')
      onChange({ enabled: false })
      return
    }

    if (!isNotificationSupported) {
      setMessage('This browser does not support notifications.')
      return
    }

    const permission =
      Notification.permission === 'granted' ? 'granted' : await Notification.requestPermission()

    if (permission !== 'granted') {
      setMessage('Notifications are blocked. Allow them in your browser settings to get reminders.')
      onChange({ enabled: false })
      return
    }

    setMessage('')
    onChange({ enabled: true })
  }

  const Icon = reminders.enabled ? BellRing : Bell

  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-500/10 ring-1 ring-primary-500/30">
            <Icon className="h-5 w-5 text-primary-400" aria-hidden="true" />
          </div>
          <div>
            <p id="reminder-label" className="font-medium text-zinc-100">
              Enable Daily Study Reminders
            </p>
            <p className="mt-1 text-sm text-zinc-400">Get a browser notification each day.</p>
          </div>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={reminders.enabled}
          aria-labelledby="reminder-label"
          onClick={handleToggle}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-300 ${
            reminders.enabled ? 'bg-primary-500' : 'bg-zinc-700'
          }`}
        >
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-300 ${
              reminders.enabled ? 'translate-x-5' : 'translate-x-0.5'
            }`}
          />
        </button>
      </div>

      {reminders.enabled && (
        <label className="mt-5 flex items-center justify-between gap-4 text-sm text-zinc-300">
          Reminder time
          <input
            type="time"
            value={reminders.time}
            onChange={(event) => onChange({ time: event.target.value })}
            className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 font-mono text-zinc-100 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30"
          />
        </label>
      )}

      {message && <p className="mt-4 text-sm text-warning-300">{message}</p>}
    </Card>
  )
}
