import { Target } from 'lucide-react'

const METRICS = [
  { key: 'weight', label: 'Weight', unit: 'lb' },
  { key: 'chest', label: 'Chest', unit: 'in' },
  { key: 'waist', label: 'Waist', unit: 'in' },
  { key: 'arms', label: 'Arms', unit: 'in' },
  { key: 'thighs', label: 'Thighs', unit: 'in' },
]

function progressPct(current, target) {
  if (current == null || !target) return null
  const pct = 100 - (Math.abs(target - current) / target) * 100
  return Math.max(0, Math.min(100, Math.round(pct)))
}

function barColor(pct) {
  if (pct >= 90) return '#0ca30c'
  if (pct >= 60) return '#f5b301'
  return '#e8352f'
}

export default function ProgressSummary({ hero, latest }) {
  return (
    <div className="comic-panel p-4 sm:p-5">
      <div className="mb-1 flex items-center gap-2">
        <Target className="h-5 w-5 text-hero-gold" />
        <h2 className="font-display text-lg uppercase tracking-wide">
          Closeness to {hero.name}
        </h2>
      </div>
      <p className="mb-4 text-sm text-text-dim">
        Based on your most recent logged measurements vs. the {hero.name} target physique.
      </p>

      {!latest ? (
        <p className="text-sm text-text-dim">Log a measurement to see how close you are.</p>
      ) : (
        <div className="space-y-3">
          {METRICS.map(({ key, label, unit }) => {
            const current = latest[key]
            const target = hero.target[key]
            const pct = progressPct(current, target)
            return (
              <div key={key}>
                <div className="mb-1 flex justify-between text-xs">
                  <span className="text-text-dim">{label}</span>
                  <span className="font-semibold">
                    {current != null ? `${current}${unit}` : '—'}{' '}
                    <span className="text-text-dim">/ {target}{unit} goal</span>
                  </span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-panel-raised">
                  {pct != null && (
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${pct}%`, backgroundColor: barColor(pct) }}
                    />
                  )}
                </div>
                {pct != null && (
                  <div className="mt-0.5 text-right text-[11px] text-text-dim">{pct}% there</div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
