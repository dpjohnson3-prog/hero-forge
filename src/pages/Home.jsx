import { useSelectedHero } from '../hooks/useSelectedHero'
import { useFoodLog } from '../hooks/useFoodLog'
import { useWorkoutLog } from '../hooks/useWorkoutLog'
import { useSubscription } from '../context/SubscriptionProvider'
import PlanOverview from '../components/forge/PlanOverview'
import WorkoutTracker from '../components/forge/WorkoutTracker'
import WorkoutPlan from '../components/forge/WorkoutPlan'
import DietPlan from '../components/forge/DietPlan'
import FoodEntryForm from '../components/forge/FoodEntryForm'
import FoodLog from '../components/forge/FoodLog'
import ProLock from '../components/forge/ProLock'

export default function Home() {
  const { hero } = useSelectedHero()
  const { todaysEntries, todaysTotals, addEntry, removeEntry } = useFoodLog()
  const { todayCompleted, toggleToday, currentStreak, totalSessions } = useWorkoutLog()
  const { isPro } = useSubscription()

  return (
    <div className="mx-auto max-w-6xl space-y-5 px-4 py-6 sm:px-6">
      <PlanOverview hero={hero} />

      {isPro ? (
        <WorkoutTracker
          todayCompleted={todayCompleted}
          toggleToday={toggleToday}
          currentStreak={currentStreak}
          totalSessions={totalSessions}
        />
      ) : (
        <ProLock
          compact
          title="Track Your Streak"
          description="Mark workouts complete and build a streak with HeroForge Pro."
        />
      )}

      <div className="grid gap-5 lg:grid-cols-2">
        <WorkoutPlan hero={hero} isPro={isPro} />
        <DietPlan hero={hero} />
      </div>

      {isPro ? (
        <div className="grid gap-5 lg:grid-cols-2">
          <FoodEntryForm onAdd={addEntry} />
          <FoodLog
            entries={todaysEntries}
            totals={todaysTotals}
            targets={hero.diet}
            onRemove={removeEntry}
          />
        </div>
      ) : (
        <ProLock
          title="Log Your Food"
          description="Snap a photo for instant AI macros, or log meals by hand — track everything against your hero's targets with HeroForge Pro."
        />
      )}
    </div>
  )
}
