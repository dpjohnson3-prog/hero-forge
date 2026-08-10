import { Swords } from 'lucide-react'
import HeroEmblem from './HeroEmblem'

export default function PlanOverview({ hero }) {
  return (
    <div className="comic-panel relative overflow-hidden p-5 sm:p-6">
      <span
        className="absolute inset-y-0 left-0 w-1.5"
        style={{ backgroundColor: hero.color }}
      />
      <div className="flex items-start gap-4 pl-2">
        <div
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 bg-panel-raised sm:h-16 sm:w-16"
          style={{ borderColor: hero.color }}
        >
          <HeroEmblem heroId={hero.id} className="h-8 w-8 sm:h-9 sm:w-9" style={{ color: hero.color }} />
        </div>
        <div className="min-w-0">
          <div className="text-xs font-semibold uppercase tracking-widest text-text-dim">
            {hero.archetype}
          </div>
          <h1 className="font-display mt-1 text-2xl sm:text-3xl">
            {hero.name} <span className="text-text-dim font-body text-base font-normal">/ {hero.alias}</span>
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-text-dim sm:text-base">{hero.blurb}</p>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {[
            ['Weight', `${hero.target.weight} lb`],
            ['Body Fat', `${hero.target.bodyFat}%`],
            ['Chest', `${hero.target.chest} in`],
            ['Arms', `${hero.target.arms} in`],
            ['Waist', `${hero.target.waist} in`],
          ].map(([label, value]) => (
            <div key={label} className="rounded-md border border-border bg-panel-raised px-3 py-2">
              <div className="text-[11px] uppercase tracking-wide text-text-dim">{label}</div>
              <div className="font-display text-lg">{value}</div>
            </div>
          ))}
        </div>

        {hero.recommendedTraining && (
          <div className="mt-4 flex items-start gap-2.5 rounded-md border border-dashed border-border bg-panel-raised/50 px-3.5 py-3">
            <Swords className="mt-0.5 h-4 w-4 shrink-0 text-text-dim" />
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wide text-text-dim">
                Recommended Training <span className="font-normal normal-case text-text-dim/70">— optional, not part of your gym plan</span>
              </div>
              <p className="mt-1 text-sm text-text-dim">{hero.recommendedTraining}</p>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  )
}
