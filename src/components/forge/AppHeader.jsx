import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Flame, LayoutDashboard, Dumbbell, LogOut, Settings as SettingsIcon, Users } from 'lucide-react'
import { useAuth } from '../../context/AuthProvider'
import { useSelectedHero } from '../../hooks/useSelectedHero'
import ConfirmDialog from './ConfirmDialog'

const navLinkClass = ({ isActive }) =>
  `flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
    isActive ? 'bg-hero-gold text-ink' : 'text-text-dim hover:text-text hover:bg-panel-raised'
  }`

export default function AppHeader() {
  const { signOut } = useAuth()
  const { hero } = useSelectedHero()
  const navigate = useNavigate()
  const [confirmOpen, setConfirmOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-20 border-b-2 border-border bg-ink/90 pt-[env(safe-area-inset-top)] backdrop-blur">
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
            <button
              type="button"
              onClick={() => setConfirmOpen(true)}
              className="flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-text-dim transition-colors hover:bg-panel-raised hover:text-text"
            >
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Change Hero</span>
            </button>
            <NavLink to="/settings" className={navLinkClass}>
              <SettingsIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
            </NavLink>
            <button
              type="button"
              onClick={() => signOut()}
              className="flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-text-dim transition-colors hover:bg-panel-raised hover:text-hero-red"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </nav>
        </div>
      </header>

      <ConfirmDialog
        open={confirmOpen}
        title="Change Your Hero?"
        message={`Switching from ${hero?.name ?? 'your current hero'} updates your training split, diet targets, and target physique to the new hero's. Your logged food, workouts, streaks, and progress photos stay exactly as they are.`}
        confirmLabel="Change Hero"
        onConfirm={() => {
          setConfirmOpen(false)
          navigate('/choose-hero')
        }}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  )
}
