import { HEROES } from '../../data/characterPlans'

export default function CharacterSelector({ selectedId, onSelect }) {
  return (
    <div className="comic-panel halftone p-4 sm:p-5">
      <h2 className="font-display mb-3 text-sm uppercase tracking-wider text-text-dim">
        Choose Your Physique Goal
      </h2>
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
        {HEROES.map((hero) => {
          const active = hero.id === selectedId
          return (
            <button
              key={hero.id}
              type="button"
              onClick={() => onSelect(hero.id)}
              className={`group relative overflow-hidden rounded-lg border-2 px-3 py-3 text-left transition-transform hover:-translate-y-0.5 ${
                active ? 'border-hero-gold bg-panel-raised' : 'border-border bg-panel hover:border-text-dim'
              }`}
              aria-pressed={active}
            >
              <span
                className="absolute inset-x-0 top-0 h-1"
                style={{ backgroundColor: hero.color }}
              />
              <div className="font-display text-sm leading-tight sm:text-base">{hero.name}</div>
              <div className="mt-0.5 text-xs text-text-dim">{hero.archetype}</div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
