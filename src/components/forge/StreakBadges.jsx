import { Award, Flame, Lock } from 'lucide-react'

const MILESTONES = [7, 14, 30, 60, 100]

export default function StreakBadges({ currentStreak, totalSessions }) {
  return (
    <div className="comic-panel p-4 sm:p-5">
      <div className="mb-1 flex items-center gap-2">
        <Flame className="h-5 w-5 text-hero-gold" />
        <h2 className="font-display text-lg uppercase tracking-wide">Consistency</h2>
      </div>
      <p className="mb-4 text-sm text-text-dim">
        {currentStreak} day{currentStreak === 1 ? '' : 's'} current streak · {totalSessions} session
        {totalSessions === 1 ? '' : 's'} logged total
      </p>

      <div className="grid grid-cols-5 gap-2">
        {MILESTONES.map((milestone) => {
          const earned = totalSessions >= milestone
          return (
            <div
              key={milestone}
              className={`flex flex-col items-center gap-1.5 rounded-lg border px-2 py-3 text-center ${
                earned ? 'border-hero-gold bg-panel-raised' : 'border-border bg-panel-raised opacity-50'
              }`}
            >
              {earned ? (
                <Award className="h-6 w-6 text-hero-gold" />
              ) : (
                <Lock className="h-6 w-6 text-text-dim" />
              )}
              <span className="text-xs font-semibold">{milestone}</span>
              <span className="text-[10px] uppercase tracking-wide text-text-dim">days</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
