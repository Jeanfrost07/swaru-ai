const STORAGE_KEY = 'swaru-ai-state'

export function loadState(fallback) {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return fallback

    const parsed = JSON.parse(raw)
    const plan = Array.isArray(parsed?.plan?.schedule) ? parsed.plan : null
    return { ...fallback, ...parsed, plan }
  } catch {
    return fallback
  }
}

export function saveState(state) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    return
  }
}
