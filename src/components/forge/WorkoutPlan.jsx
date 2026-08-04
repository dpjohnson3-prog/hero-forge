import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Dumbbell, Lock } from 'lucide-react'
import ExerciseModal from './ExerciseModal'

export default function WorkoutPlan({ hero, isPro }) {
  const [activeExercise, setActiveExercise] = useState(null)

  return (
    <div className="comic-panel p-5 sm:p-6">
      <div className="mb-1 flex items-center gap-2">
        <Dumbbell className="h-5 w-5 text-hero-blue" />
        <h2 className="font-display text-lg uppercase tracking-wide">Training Split</h2>
      </div>
      <p className="mb-4 text-sm text-text-dim">{hero.workout.split}</p>

      <div className="grid gap-3 sm:grid-cols-2">
        {hero.workout.days.map((day, index) => {
          const locked = !isPro && index > 0
          return (
            <div key={day.name} className="rounded-lg border border-border bg-panel-raised p-3.5">
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-display text-sm">{day.name}</span>
                <span className="text-xs font-semibold text-hero-gold">{day.focus}</span>
              </div>
              {locked ? (
                <Link
                  to="/paywall"
                  className="mt-3 flex items-center justify-center gap-1.5 rounded-md border border-dashed border-border py-4 text-xs text-text-dim transition-colors hover:border-hero-gold hover:text-hero-gold"
                >
                  <Lock className="h-3.5 w-3.5" />
                  Unlock with Pro
                </Link>
              ) : (
                <ul className="mt-2 space-y-1.5">
                  {day.exercises.map((exercise) => (
                    <li key={exercise.name}>
                      <button
                        type="button"
                        onClick={() => setActiveExercise(exercise)}
                        className="flex w-full items-center justify-between rounded px-1 py-0.5 text-left text-sm text-text-dim transition-colors hover:bg-panel hover:text-text"
                      >
                        <span className="text-text underline decoration-dotted underline-offset-4">
                          {exercise.name}
                        </span>
                        <span className="whitespace-nowrap text-xs">
                          {exercise.sets} × {exercise.reps}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )
        })}
      </div>

      <ExerciseModal exercise={activeExercise} onClose={() => setActiveExercise(null)} />
    </div>
  )
}
