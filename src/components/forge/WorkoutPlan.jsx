import { Dumbbell } from 'lucide-react'

export default function WorkoutPlan({ hero }) {
  return (
    <div className="comic-panel p-5 sm:p-6">
      <div className="mb-1 flex items-center gap-2">
        <Dumbbell className="h-5 w-5 text-hero-blue" />
        <h2 className="font-display text-lg uppercase tracking-wide">Training Split</h2>
      </div>
      <p className="mb-4 text-sm text-text-dim">{hero.workout.split}</p>

      <div className="grid gap-3 sm:grid-cols-2">
        {hero.workout.days.map((day) => (
          <div key={day.name} className="rounded-lg border border-border bg-panel-raised p-3.5">
            <div className="flex items-baseline justify-between gap-2">
              <span className="font-display text-sm">{day.name}</span>
              <span className="text-xs font-semibold text-hero-gold">{day.focus}</span>
            </div>
            <ul className="mt-2 space-y-1.5">
              {day.exercises.map((exercise) => (
                <li
                  key={exercise.name}
                  className="flex items-center justify-between text-sm text-text-dim"
                >
                  <span className="text-text">{exercise.name}</span>
                  <span className="whitespace-nowrap text-xs">
                    {exercise.sets} × {exercise.reps}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
