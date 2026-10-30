import { useEffect } from 'react'

const CHECK_INTERVAL_MS = 60_000

function isReminderDue(time) {
  const [hours, minutes] = time.split(':').map(Number)
  const now = new Date()
  return now.getHours() > hours || (now.getHours() === hours && now.getMinutes() >= minutes)
}

export function useDailyReminder(reminders, onFired) {
  const { enabled, time, lastNotifiedOn } = reminders

  useEffect(() => {
    if (!enabled) return undefined

    const check = () => {
      if (!('Notification' in window) || Notification.permission !== 'granted') return

      const today = new Date().toLocaleDateString('en-CA')
      if (lastNotifiedOn === today || !isReminderDue(time)) return

      new Notification('Swaru AI: time to study', {
        body: "Today's BCA plan is ready. Tick off your tasks to stay on track.",
      })
      onFired(today)
    }

    check()
    const intervalId = window.setInterval(check, CHECK_INTERVAL_MS)
    return () => window.clearInterval(intervalId)
  }, [enabled, time, lastNotifiedOn, onFired])
}
