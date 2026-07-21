import { NavLink } from 'react-router-dom'
import { Flame, LayoutDashboard, Dumbbell } from 'lucide-react'

const navLinkClass = ({ isActive }) =>
  `flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
    isActive ? 'bg-hero-gold text-ink' : 'text-text-dim hover:text-text hover:bg-panel-raised'
  }`

export default function AppHeader() {
  return (
    <header className="sticky top-0 z-20 border-b-2 border-border bg-ink/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          <Flame className="h-7 w-7 text-hero-red" strokeWidth={2.5} />
          <span className="font-display text-xl uppercase tracking-wide sm:text-2xl">
            Hero<span className="text-hero-gold">Forge</span>
          </span>
        </div>
        <nav className="flex items-center gap-2">
          <NavLink to="/" end className={navLinkClass}>
            <Dumbbell className="h-4 w-4" />
            <span className="hidden sm:inline">Train</span>
          </NavLink>
          <NavLink to="/dashboard" className={navLinkClass}>
            <LayoutDashboard className="h-4 w-4" />
            <span className="hidden sm:inline">Progress</span>
          </NavLink>
        </nav>
      </div>
    </header>
  )
}
