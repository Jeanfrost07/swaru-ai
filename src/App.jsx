import { useState } from 'react'
import Header from './components/Header.jsx'
import OnboardingForm from './components/OnboardingForm.jsx'
import GeneratingState from './components/GeneratingState.jsx'
import Dashboard from './components/Dashboard.jsx'
import { useAppState } from './hooks/useAppState.js'
import { useDailyReminder } from './hooks/useDailyReminder.js'
import { getSmartPlan } from './gemini.js'

export default function App() {
  const { state, actions } = useAppState()
  const [isEditing, setIsEditing] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  useDailyReminder(state.reminders, actions.markReminderFired)

  const handleGenerate = async (inputs) => {
    setIsGenerating(true)
    
    try {
      const rawData = await getSmartPlan(inputs.syllabus, inputs.days, inputs.hours)
      
      if (rawData) {
        let jsonString = rawData;
        
        // SAFETY: Gemini ke text me se zabardasti sirf Array [...] bahar nikalna
        const startIdx = rawData.indexOf('[');
        const endIdx = rawData.lastIndexOf(']');
        
        if (startIdx !== -1 && endIdx !== -1) {
          jsonString = rawData.substring(startIdx, endIdx + 1);
        }
        
        jsonString = jsonString.replace(/```json/g, '').replace(/```/g, '').trim();
        let parsedData = JSON.parse(jsonString);
        
        // Humesha array ensure karna
        let geminiArray = Array.isArray(parsedData) ? parsedData : (Object.values(parsedData).find(Array.isArray) || [parsedData]);
        
        const formattedPlan = {
          totalDays: Number(inputs.days),
          hoursPerDay: Number(inputs.hours),
          subjects: [...new Set(geminiArray.map(d => d.subject || "Study"))],
          schedule: geminiArray.map((d, index) => {
            const currentDay = d.day || index + 1;
            const validTopics = Array.isArray(d.topics) && d.topics.length > 0 ? d.topics : ["Revision"];
            return {
              day: currentDay,
              focus: [d.subject || "General"],
              tasks: validTopics.map((topic, i) => ({
                id: `day${currentDay}-task${i}`,
                title: String(topic),
                minutes: Math.floor((Number(inputs.hours) * 60) / validTopics.length),
                type: 'theory'
              }))
            };
          })
        }
        
        actions.commitPlan(formattedPlan, inputs)
      } else {
        alert("AI ne response nahi diya. Dobara try karo.")
      }
    } catch (error) {
      console.error("API/Parsing error:", error)
      alert("AI ne data banaya par format match nahi hua, dobara Generate par click kar.")
    } finally {
      setIsGenerating(false)
      setIsEditing(false)
    }
  }

  const showDashboard = Boolean(state.plan) && !isEditing && !isGenerating

  let content
  if (isGenerating) {
    content = <GeneratingState />
  } else if (showDashboard) {
    content = (
      <Dashboard
        plan={state.plan}
        completed={state.completed || []}
        currentDay={state.currentDay || 1}
        reminders={state.reminders || []}
        onToggleTask={actions.toggleTask}
        onSelectDay={actions.selectDay}
        onRemindersChange={actions.updateReminders}
        onEditInputs={() => setIsEditing(true)}
      />
    )
  } else {
    content = (
      <OnboardingForm
        key={isEditing ? 'editing' : 'onboarding'}
        initialValues={state.inputs}
        onGenerate={handleGenerate}
        onCancel={state.plan ? () => setIsEditing(false) : undefined}
      />
    )
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-zinc-950">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 h-96 w-[40rem] -translate-x-1/2 rounded-full bg-primary-500/10 blur-3xl"
      />
      <div className="relative">
        <Header />
        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">{content}</main>
      </div>
    </div>
  )
}