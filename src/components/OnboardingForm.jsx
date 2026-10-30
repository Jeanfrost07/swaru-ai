import { useState } from 'react'
import { BookOpenText, CalendarDays, Clock, Sparkles } from 'lucide-react'
import Card from './Card.jsx'

const MIN_DAYS = 1
const MAX_DAYS = 365
const MIN_HOURS = 0.5
const MAX_HOURS = 16

function validate({ syllabus, days, hours }) {
  const errors = {}
  const dayCount = Number(days)
  const hourCount = Number(hours)

  if (!syllabus.trim()) {
    errors.syllabus = 'Paste your syllabus so Swaru AI knows what to plan.'
  }
  if (!Number.isInteger(dayCount) || dayCount < MIN_DAYS || dayCount > MAX_DAYS) {
    errors.days = `Enter a whole number of days between ${MIN_DAYS} and ${MAX_DAYS}.`
  }
  if (!(hourCount >= MIN_HOURS && hourCount <= MAX_HOURS)) {
    errors.hours = `Enter between ${MIN_HOURS} and ${MAX_HOURS} hours.`
  }
  return errors
}

function inputClass(hasError) {
  return `w-full rounded-lg border bg-zinc-950 px-3 py-2.5 text-zinc-100 placeholder:text-zinc-500 outline-none transition focus:ring-2 ${
    hasError
      ? 'border-error-500 focus:ring-error-500/30'
      : 'border-zinc-800 focus:border-primary-500 focus:ring-primary-500/30'
  }`
}

function Field({ label, icon: Icon, error, hint, children }) {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-medium text-zinc-200">
        <Icon className="h-4 w-4 text-primary-400" aria-hidden="true" />
        {label}
      </label>
      {children}
      {error ? (
        <p className="text-sm text-error-400">{error}</p>
      ) : (
        <p className="text-xs text-zinc-500">{hint}</p>
      )}
    </div>
  )
}

export default function OnboardingForm({ initialValues, onGenerate, onCancel }) {
  const [values, setValues] = useState({
    syllabus: initialValues.syllabus,
    days: String(initialValues.days),
    hours: String(initialValues.hours),
  })
  const [errors, setErrors] = useState({})

  const handleChange = (field) => (event) => {
    setValues((prev) => ({ ...prev, [field]: event.target.value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const nextErrors = validate(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    onGenerate({
      syllabus: values.syllabus.trim(),
      days: Number(values.days),
      hours: Number(values.hours),
    })
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div className="space-y-3 text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-primary-400">Onboarding</p>
        <h1 className="text-3xl font-semibold leading-tight text-zinc-50 sm:text-4xl">
          Plan your BCA exam prep in seconds
        </h1>
        <p className="mx-auto max-w-xl text-base leading-relaxed text-zinc-400">
          Paste your syllabus, tell us how much time you have, and Swaru AI will split it into a
          daily plan of theory and coding labs.
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          <Field
            label="Syllabus"
            icon={BookOpenText}
            error={errors.syllabus}
            hint="List your subjects and topics. Mention Data Structures, Java, OS, DBMS or Web Development."
          >
            <textarea
              rows={6}
              value={values.syllabus}
              onChange={handleChange('syllabus')}
              placeholder="e.g. Data Structures: arrays, linked lists, trees..."
              className={`${inputClass(Boolean(errors.syllabus))} resize-y font-mono text-sm leading-relaxed`}
            />
          </Field>

          <div className="grid gap-6 sm:grid-cols-2">
            <Field
              label="Days until exam"
              icon={CalendarDays}
              error={errors.days}
              hint={`Between ${MIN_DAYS} and ${MAX_DAYS} days.`}
            >
              <input
                type="number"
                min={MIN_DAYS}
                max={MAX_DAYS}
                step={1}
                value={values.days}
                onChange={handleChange('days')}
                className={inputClass(Boolean(errors.days))}
              />
            </Field>

            <Field
              label="Study hours per day"
              icon={Clock}
              error={errors.hours}
              hint={`Between ${MIN_HOURS} and ${MAX_HOURS} hours.`}
            >
              <input
                type="number"
                min={MIN_HOURS}
                max={MAX_HOURS}
                step={0.5}
                value={values.hours}
                onChange={handleChange('hours')}
                className={inputClass(Boolean(errors.hours))}
              />
            </Field>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row-reverse">
            <button
              type="submit"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary-500 px-5 py-3 font-semibold text-zinc-950 shadow-lg shadow-primary-500/20 transition hover:bg-primary-400 active:scale-[0.98]"
            >
              <Sparkles className="h-5 w-5" aria-hidden="true" />
              Generate Smart Plan
            </button>
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="inline-flex items-center justify-center rounded-lg border border-zinc-700 px-5 py-3 font-medium text-zinc-200 transition hover:border-zinc-500 hover:bg-zinc-800"
              >
                Back to dashboard
              </button>
            )}
          </div>
        </form>
      </Card>
    </div>
  )
}
