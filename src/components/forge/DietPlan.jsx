import { Utensils } from 'lucide-react'

const MACROS = [
  { key: 'protein', label: 'Protein', unit: 'g', color: 'bg-hero-red' },
  { key: 'carbs', label: 'Carbs', unit: 'g', color: 'bg-hero-blue' },
  { key: 'fat', label: 'Fat', unit: 'g', color: 'bg-hero-gold' },
]

export default function DietPlan({ hero }) {
  const { diet } = hero
  const maxGrams = Math.max(diet.protein, diet.carbs, diet.fat)

  return (
    <div className="comic-panel p-5 sm:p-6">
      <div className="mb-1 flex items-center gap-2">
        <Utensils className="h-5 w-5 text-hero-red" />
        <h2 className="font-display text-lg uppercase tracking-wide">Nutrition Target</h2>
      </div>
      <p className="mb-4 text-sm text-text-dim">{diet.philosophy}</p>

      <div className="mb-4 flex flex-wrap items-baseline gap-x-6 gap-y-1">
        <div>
          <span className="font-display text-2xl">{diet.calories.toLocaleString()}</span>
          <span className="ml-1 text-xs text-text-dim">kcal / day</span>
        </div>
        <div className="text-xs text-text-dim">{diet.mealsPerDay} meals / day</div>
      </div>

      <div className="space-y-2.5">
        {MACROS.map((macro) => (
          <div key={macro.key}>
            <div className="mb-1 flex justify-between text-xs">
              <span className="text-text-dim">{macro.label}</span>
              <span className="font-semibold">
                {diet[macro.key]}
                {macro.unit}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-panel-raised">
              <div
                className={`h-full rounded-full ${macro.color}`}
                style={{ width: `${(diet[macro.key] / maxGrams) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <div className="mb-1.5 text-xs uppercase tracking-wide text-text-dim">Key Foods</div>
        <div className="flex flex-wrap gap-1.5">
          {diet.keyFoods.map((food) => (
            <span
              key={food}
              className="rounded-full border border-border bg-panel-raised px-2.5 py-1 text-xs text-text-dim"
            >
              {food}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
