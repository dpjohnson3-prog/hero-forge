import { Link } from 'react-router-dom'
import { Lock, Sparkles } from 'lucide-react'

export default function ProLock({ title, description, compact = false }) {
  return (
    <div
      className={`comic-panel flex flex-col items-center gap-3 text-center ${
        compact ? 'p-5' : 'p-8 sm:p-10'
      }`}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-hero-gold/15 text-hero-gold">
        <Lock className="h-6 w-6" />
      </div>
      <div>
        <h3 className="font-display text-lg uppercase tracking-wide">{title}</h3>
        {description && <p className="mt-1 max-w-sm text-sm text-text-dim">{description}</p>}
      </div>
      <Link
        to="/paywall"
        className="font-display flex items-center gap-1.5 rounded-md bg-hero-gold px-4 py-2 text-sm uppercase tracking-wide text-ink transition-opacity hover:opacity-90"
      >
        <Sparkles className="h-4 w-4" />
        Unlock HeroForge Pro
      </Link>
    </div>
  )
}
