import { useNavigate } from 'react-router-dom'
import { Flame } from 'lucide-react'
import { useSelectedHero } from '../hooks/useSelectedHero'
import CharacterSelector from '../components/forge/CharacterSelector'

export default function ChooseHero() {
  const { heroId, setHeroId } = useSelectedHero()
  const navigate = useNavigate()

  const handleSelect = (id) => {
    setHeroId(id)
    navigate('/')
  }

  return (
    <div className="mx-auto max-w-6xl space-y-5 px-4 py-6 sm:px-6">
      <div className="mb-1 flex items-center justify-center gap-2 text-center">
        <Flame className="h-6 w-6 text-hero-red" strokeWidth={2.5} />
        <span className="font-display text-xl uppercase tracking-wide sm:text-2xl">
          Hero<span className="text-hero-gold">Forge</span>
        </span>
      </div>
      <p className="text-center text-sm text-text-dim">
        Pick the physique you want to build toward — your training split, diet targets, and
        progress goals will be built around this hero.
      </p>
      <CharacterSelector selectedId={heroId} onSelect={handleSelect} />
    </div>
  )
}
