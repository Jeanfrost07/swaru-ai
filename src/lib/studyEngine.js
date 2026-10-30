import { BCA_SUBJECTS } from '../data/bcaSubjects.js'

const PRACTICAL_WEIGHT = 1.5
const MINUTE_STEP = 5
const MIN_TASK_MINUTES = 15

function matchSubjects(syllabus) {
  const matched = BCA_SUBJECTS.filter((subject) =>
    subject.keywords.some((keyword) => new RegExp(`\\b${keyword}\\b`, 'i').test(syllabus))
  )
  return matched.length > 0 ? matched : BCA_SUBJECTS
}

function interleaveTopics(subjects) {
  const longest = Math.max(...subjects.map((subject) => subject.topics.length))
  const units = []

  for (let index = 0; index < longest; index += 1) {
    subjects.forEach((subject) => {
      const topic = subject.topics[index]
      if (!topic) return

      units.push({
        subjectId: subject.id,
        subject: subject.name,
        topic,
        title: `${topic}: theory and concepts`,
        type: 'theory',
      })
      units.push({
        subjectId: subject.id,
        subject: subject.name,
        topic,
        title: `${topic}: hands-on coding lab`,
        type: 'practical',
      })
    })
  }

  return units
}

function padWithRevision(units, days) {
  const padded = [...units]
  for (let index = 0; padded.length < days; index += 1) {
    const source = units[index % units.length]
    padded.push({
      ...source,
      title: `Revision: ${source.topic} practice quiz`,
      type: 'revision',
    })
  }
  return padded
}

function weightFor(type) {
  return type === 'practical' ? PRACTICAL_WEIGHT : 1
}

function roundToStep(minutes) {
  return Math.max(MIN_TASK_MINUTES, Math.round(minutes / MINUTE_STEP) * MINUTE_STEP)
}

function buildDayTasks(dayNumber, units, dayMinutes) {
  const totalWeight = units.reduce((sum, unit) => sum + weightFor(unit.type), 0)

  return units.map((unit, index) => ({
    id: `${dayNumber}-${index}`,
    title: unit.title,
    topic: unit.topic,
    subjectId: unit.subjectId,
    subject: unit.subject,
    type: unit.type,
    minutes: roundToStep((dayMinutes * weightFor(unit.type)) / totalWeight),
  }))
}

export function generateStudyPlan({ syllabus, days, hoursPerDay }) {
  const subjects = matchSubjects(syllabus)
  const units = padWithRevision(interleaveTopics(subjects), days)
  const need = Math.round(hoursPerDay * 60)

  const schedule = Array.from({ length: days }, (_, dayIndex) => {
    const start = Math.floor((dayIndex * units.length) / days)
    const end = Math.floor(((dayIndex + 1) * units.length) / days)
    const tasks = buildDayTasks(dayIndex + 1, units.slice(start, end), need)

    return {
      day: dayIndex + 1,
      focus: [...new Set(tasks.map((task) => task.subject))],
      tasks,
    }
  })

  return {
    generatedAt: new Date().toISOString(),
    totalDays: days,
    hoursPerDay,
    subjects: subjects.map((subject) => subject.name),
    schedule,
  }
}

export function getDayProgress(day, completed) {
  const done = day.tasks.filter((task) => completed[task.id]).length
  return { done, total: day.tasks.length }
}
