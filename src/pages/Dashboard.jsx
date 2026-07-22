import { useMemo } from 'react'
import { useSelectedHero } from '../hooks/useSelectedHero'
import { useBodyMetrics } from '../hooks/useBodyMetrics'
import { useWorkoutLog } from '../hooks/useWorkoutLog'
import MetricForm from '../components/forge/MetricForm'
import ProgressSummary from '../components/forge/ProgressSummary'
import StreakBadges from '../components/forge/StreakBadges'
import { WeightChart, MeasurementsChart } from '../components/forge/ProgressCharts'
import { Trash2 } from 'lucide-react'

export default function Dashboard() {
  const { hero } = useSelectedHero()
  const { metrics, latest, addMetric, removeMetric } = useBodyMetrics()
  const { currentStreak, totalSessions } = useWorkoutLog()

  const chartData = useMemo(
    () =>
      metrics.map((m) => ({
        date: m.date.slice(5),
        weight: m.weight,
        chest: m.chest,
        waist: m.waist,
        arms: m.arms,
        thighs: m.thighs,
      })),
    [metrics],
  )

  return (
    <div className="mx-auto max-w-6xl space-y-5 px-4 py-6 sm:px-6">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl">Progress Dashboard</h1>
        <p className="mt-1 text-sm text-text-dim">
          Track your body measurements over time and see how close you are to your {hero.name} goal physique.
        </p>
      </div>

      <StreakBadges currentStreak={currentStreak} totalSessions={totalSessions} />

      <div className="grid gap-5 lg:grid-cols-2">
        <MetricForm onAdd={addMetric} />
        <ProgressSummary hero={hero} latest={latest} />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="comic-panel p-4 sm:p-5">
          <h2 className="font-display mb-3 text-sm uppercase tracking-wider text-text-dim">
            Weight Trend
          </h2>
          <WeightChart data={chartData} />
        </div>
        <div className="comic-panel p-4 sm:p-5">
          <h2 className="font-display mb-3 text-sm uppercase tracking-wider text-text-dim">
            Measurement Trends
          </h2>
          <MeasurementsChart data={chartData} />
        </div>
      </div>

      <div className="comic-panel p-4 sm:p-5">
        <h2 className="font-display mb-3 text-sm uppercase tracking-wider text-text-dim">
          Measurement Log
        </h2>
        {metrics.length === 0 ? (
          <p className="text-sm text-text-dim">No measurements logged yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-xs uppercase tracking-wide text-text-dim">
                  <th className="py-1.5 pr-3">Date</th>
                  <th className="py-1.5 pr-3">Weight</th>
                  <th className="py-1.5 pr-3">Chest</th>
                  <th className="py-1.5 pr-3">Waist</th>
                  <th className="py-1.5 pr-3">Arms</th>
                  <th className="py-1.5 pr-3">Thighs</th>
                  <th className="py-1.5" />
                </tr>
              </thead>
              <tbody>
                {[...metrics].reverse().map((m) => (
                  <tr key={m.id} className="border-t border-border">
                    <td className="py-1.5 pr-3">{m.date}</td>
                    <td className="py-1.5 pr-3">{m.weight ?? '—'}</td>
                    <td className="py-1.5 pr-3">{m.chest ?? '—'}</td>
                    <td className="py-1.5 pr-3">{m.waist ?? '—'}</td>
                    <td className="py-1.5 pr-3">{m.arms ?? '—'}</td>
                    <td className="py-1.5 pr-3">{m.thighs ?? '—'}</td>
                    <td className="py-1.5 text-right">
                      <button
                        type="button"
                        onClick={() => removeMetric(m.id)}
                        className="rounded-md p-1.5 text-text-dim hover:bg-panel-raised hover:text-hero-red"
                        aria-label="Remove measurement"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
