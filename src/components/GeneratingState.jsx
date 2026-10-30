import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import Card from './Card.jsx'

const STEP_INTERVAL_MS = 550
const STEPS = [
  'Reading your syllabus',
  'Mapping BCA subjects and topics',
  'Balancing theory with coding labs',
  'Building your daily dashboard',
]

export default function GeneratingState() {
  const [stepIndex, setStepIndex] = useState(0)

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setStepIndex((index) => Math.min(index + 1, STEPS.length - 1))
    }, STEP_INTERVAL_MS)
    return () => window.clearInterval(intervalId)
  }, [])

  return (
    <Card className="mx-auto flex max-w-md flex-col items-center gap-6 py-10 text-center">
      <Loader2 className="h-10 w-10 animate-spin text-primary-400" aria-hidden="true" />
      <div>
        <p className="text-lg font-semibold text-zinc-50">Generating your smart plan</p>
        <p className="mt-1 text-sm text-zinc-400" role="status" aria-live="polite">
          {STEPS[stepIndex]}...
        </p>
      </div>
      <ul className="w-full space-y-2 text-left">
        {STEPS.map((step, index) => (
          <li
            key={step}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors duration-300 ${
              index <= stepIndex ? 'text-zinc-100' : 'text-zinc-600'
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full transition-colors duration-300 ${
                index <= stepIndex ? 'bg-primary-400' : 'bg-zinc-700'
              }`}
            />
            {step}
          </li>
        ))}
      </ul>
    </Card>
  )
}
