import { useCallback, useEffect, useState } from 'react'
import { DEFAULT_STATE } from '../data/defaults.js'
import { loadState, saveState } from '../lib/storage.js'

export function useAppState() {
  const [state, setState] = useState(() => loadState(DEFAULT_STATE))

  useEffect(() => {
    saveState(state)
  }, [state])

  const commitPlan = useCallback((plan, inputs) => {
    setState((prev) => ({ ...prev, inputs, plan, completed: {}, currentDay: 1 }))
  }, [])

  const toggleTask = useCallback((taskId) => {
    setState((prev) => {
      const completed = { ...prev.completed }
      if (completed[taskId]) {
        delete completed[taskId]
      } else {
        completed[taskId] = true
      }
      return { ...prev, completed }
    })
  }, [])

  const selectDay = useCallback((day) => {
    setState((prev) => ({ ...prev, currentDay: day }))
  }, [])

  const updateReminders = useCallback((patch) => {
    setState((prev) => ({ ...prev, reminders: { ...prev.reminders, ...patch } }))
  }, [])

  const markReminderFired = useCallback((date) => {
    setState((prev) => ({ ...prev, reminders: { ...prev.reminders, lastNotifiedOn: date } }))
  }, [])

  return {
    state,
    actions: { commitPlan, toggleTask, selectDay, updateReminders, markReminderFired },
  }
}
