import { CheckCircle2, Circle, Flame } from 'lucide-react'

export default function WorkoutTracker({ todayCompleted, toggleToday, currentStreak, totalSessions }) {
  return (
    <div className="comic-panel flex flex-wrap items-center justify-between gap-4 p-4 sm:p-5">
      <div className="flex items-center gap-3">
        <Flame className={`h-6 w-6 ${currentStreak > 0 ? 'text-hero-gold' : 'text-text-dim'}`} />
        <div>
          <div className="font-display text-lg leading-none">
            {currentStreak} day{currentStreak === 1 ? '' : 's'}
          </div>
          <div className="text-xs text-text-dim">
            current streak · {totalSessions} session{totalSessions === 1 ? '' : 's'} logged
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={toggleToday}
        className={`font-display flex items-center gap-2 rounded-md px-4 py-2.5 text-sm uppercase tracking-wide transition-opacity hover:opacity-90 ${
          todayCompleted ? 'bg-hero-gold text-ink' : 'bg-hero-blue text-white'
        }`}
      >
        {todayCompleted ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
        {todayCompleted ? "Today's Workout Done" : 'Mark Workout Complete'}
      </button>
    </div>
  )
}
