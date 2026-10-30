import { BrainCircuit } from 'lucide-react'

export default function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-zinc-800/80 bg-zinc-950/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-500/15 ring-1 ring-primary-500/40">
            <BrainCircuit className="h-5 w-5 text-primary-400" aria-hidden="true" />
          </div>
          <div>
            <p className="text-base font-semibold leading-tight text-zinc-50">Swaru AI</p>
            <p className="font-mono text-[11px] leading-tight text-zinc-400">BCA study planner</p>
          </div>
        </div>
      </div>
    </header>
  )
}
