import { Trash2 } from 'lucide-react'

function TotalBar({ label, value, target, unit }) {
  const pct = target > 0 ? Math.min(100, (value / target) * 100) : 0
  const over = value > target
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs">
        <span className="text-text-dim">{label}</span>
        <span className={`font-semibold ${over ? 'text-hero-red' : 'text-text'}`}>
          {Math.round(value)} / {target}
          {unit}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-panel-raised">
        <div
          className={`h-full rounded-full ${over ? 'bg-hero-red' : 'bg-hero-blue'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

export default function FoodLog({ entries, totals, targets, onRemove }) {
  return (
    <div className="comic-panel p-4 sm:p-5">
      <h2 className="font-display mb-3 text-sm uppercase tracking-wider text-text-dim">
        Today's Progress
      </h2>

      <div className="mb-4 space-y-2.5">
        <TotalBar label="Calories" value={totals.calories} target={targets.calories} unit=" kcal" />
        <TotalBar label="Protein" value={totals.protein} target={targets.protein} unit="g" />
        <TotalBar label="Carbs" value={totals.carbs} target={targets.carbs} unit="g" />
        <TotalBar label="Fat" value={totals.fat} target={targets.fat} unit="g" />
      </div>

      {entries.length === 0 ? (
        <p className="text-sm text-text-dim">No food logged yet today.</p>
      ) : (
        <ul className="space-y-1.5">
          {entries.map((entry) => (
            <li
              key={entry.id}
              className="flex items-center justify-between gap-2 rounded-md border border-border bg-panel-raised px-3 py-2 text-sm"
            >
              <div className="min-w-0">
                <div className="truncate font-medium">{entry.name}</div>
                <div className="text-xs text-text-dim">
                  {entry.calories} kcal · P{entry.protein} C{entry.carbs} F{entry.fat}
                </div>
              </div>
              <button
                type="button"
                onClick={() => onRemove(entry.id)}
                className="shrink-0 rounded-md p-1.5 text-text-dim hover:bg-ink hover:text-hero-red"
                aria-label={`Remove ${entry.name}`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
