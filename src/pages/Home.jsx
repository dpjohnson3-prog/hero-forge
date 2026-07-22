import { useSelectedHero } from '../hooks/useSelectedHero'
import { useFoodLog } from '../hooks/useFoodLog'
import { useWorkoutLog } from '../hooks/useWorkoutLog'
import CharacterSelector from '../components/forge/CharacterSelector'
import PlanOverview from '../components/forge/PlanOverview'
import WorkoutTracker from '../components/forge/WorkoutTracker'
import WorkoutPlan from '../components/forge/WorkoutPlan'
import DietPlan from '../components/forge/DietPlan'
import FoodEntryForm from '../components/forge/FoodEntryForm'
import FoodLog from '../components/forge/FoodLog'

export default function Home() {
  const { hero, heroId, setHeroId } = useSelectedHero()
  const { todaysEntries, todaysTotals, addEntry, removeEntry } = useFoodLog()
  const { todayCompleted, toggleToday, currentStreak, totalSessions } = useWorkoutLog()

  return (
    <div className="mx-auto max-w-6xl space-y-5 px-4 py-6 sm:px-6">
      <CharacterSelector selectedId={heroId} onSelect={setHeroId} />
      <PlanOverview hero={hero} />
      <WorkoutTracker
        todayCompleted={todayCompleted}
        toggleToday={toggleToday}
        currentStreak={currentStreak}
        totalSessions={totalSessions}
      />

      <div className="grid gap-5 lg:grid-cols-2">
        <WorkoutPlan hero={hero} />
        <DietPlan hero={hero} />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <FoodEntryForm onAdd={addEntry} />
        <FoodLog
          entries={todaysEntries}
          totals={todaysTotals}
          targets={hero.diet}
          onRemove={removeEntry}
        />
      </div>
    </div>
  )
}
