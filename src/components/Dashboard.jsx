import { useState, useEffect } from 'react'
import { Clock, Pencil } from 'lucide-react'
import Card from './Card.jsx'
import DayNavigator from './DayNavigator.jsx'
import ProgressRing from './ProgressRing.jsx'
import ReminderToggle from './ReminderToggle.jsx'
import TaskList from './TaskList.jsx'
import YouTubeRecommendations from './YouTubeRecommendations.jsx'
import { getDayProgress } from '../lib/studyEngine.js'
import { formatDuration } from '../lib/format.js'
import { fetchRelevantVideos } from '../youtube.js'

function percentOf(done, total) {
  return total === 0 ? 0 : Math.round((done / total) * 100)
}

export default function Dashboard({
  plan,
  completed = [],
  currentDay = 1,
  reminders = [],
  onToggleTask,
  onSelectDay,
  onRemindersChange,
  onEditInputs,
}) {
  const safeSchedule = plan?.schedule || [];
  const day = safeSchedule[currentDay - 1] || safeSchedule[0] || {};
  
  const safeTasks = day.tasks || [];
  const safeFocus = day.focus || ["BCA Study"];
  
  const dayProgress = getDayProgress(day, completed);
  const dayMinutes = safeTasks.reduce((sum, task) => sum + (task?.minutes || 0), 0);
  
  const [videos, setVideos] = useState([]);

  // BUGS SOLVED: Ab ye String par depend karega, object par nahi. Infinite loop khatam!
  const focusQuery = safeFocus.join(' ');

  useEffect(() => {
    let isMounted = true;
    
    const loadVideos = async () => {
      try {
        const fetchedVideos = await fetchRelevantVideos(focusQuery);
        if (isMounted) setVideos(fetchedVideos || []);
      } catch (e) {
        if (isMounted) setVideos([]);
      }
    }

    loadVideos();
    return () => { isMounted = false; }
  }, [focusQuery]) 

  const overallDone = safeSchedule.reduce(
    (sum, item) => sum + (getDayProgress(item || {}, completed)?.done || 0),
    0
  );
  const overallTotal = safeSchedule.reduce((sum, item) => sum + (item?.tasks?.length || 0), 0);
  const overallPercent = percentOf(overallDone, overallTotal);

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <p className="font-mono text-xs uppercase tracking-widest text-primary-400">Daily dashboard</p>
          <h1 className="text-2xl font-semibold leading-tight text-zinc-50 sm:text-3xl">
            Day {day?.day || currentDay} of {plan?.totalDays || 1}
          </h1>
          <p className="text-sm text-zinc-400">Focus: {safeFocus.join(' · ')}</p>
        </div>
        <button
          type="button"
          onClick={onEditInputs}
          className="inline-flex items-center justify-center gap-2 self-start rounded-lg border border-zinc-700 px-4 py-2.5 text-sm font-medium text-zinc-200 transition hover:border-zinc-500 hover:bg-zinc-800 sm:self-auto"
        >
          <Pencil className="h-4 w-4" aria-hidden="true" />
          Edit inputs
        </button>
      </div>

      <DayNavigator
        schedule={safeSchedule}
        completed={completed}
        currentDay={currentDay}
        onSelectDay={onSelectDay}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <ProgressRing percent={percentOf(dayProgress?.done || 0, dayProgress?.total || 0)} />
            <div className="grid flex-1 grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-zinc-400">Tasks done</p>
                <p className="text-2xl font-semibold text-zinc-50">
                  {dayProgress?.done || 0}
                  <span className="text-base font-normal text-zinc-500"> / {dayProgress?.total || 0}</span>
                </p>
              </div>
              <div>
                <p className="flex items-center gap-1.5 text-sm text-zinc-400">
                  <Clock className="h-4 w-4" aria-hidden="true" />
                  Study time
                </p>
                <p className="text-2xl font-semibold text-zinc-50">{formatDuration(dayMinutes)}</p>
              </div>
            </div>
          </Card>

          <TaskList tasks={safeTasks} completed={completed} onToggle={onToggleTask} />
        </div>

        <div className="space-y-6">
          <ReminderToggle reminders={reminders} onChange={onRemindersChange} />

          <Card className="space-y-5">
            <div>
              <h2 className="text-lg font-semibold text-zinc-50">Plan overview</h2>
              <p className="text-sm text-zinc-400">
                {plan?.hoursPerDay || 0}h per day across {plan?.totalDays || 0} days
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-300">Overall progress</span>
                <span className="font-mono text-zinc-100">{overallPercent}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
                <div
                  className="h-full rounded-full bg-primary-400 transition-all duration-500"
                  style={{ width: `${overallPercent}%` }}
                />
              </div>
              <p className="font-mono text-xs text-zinc-500">
                {overallDone} of {overallTotal} tasks complete
              </p>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-zinc-300">Subjects covered</p>
              <ul className="flex flex-wrap gap-2">
                {(plan?.subjects || []).map((subject) => (
                  <li
                    key={subject}
                    className="rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-300"
                  >
                    {subject}
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </div>
      </div>

      <YouTubeRecommendations videos={videos} />
    </section>
  )
}