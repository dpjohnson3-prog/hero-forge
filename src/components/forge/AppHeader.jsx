import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Flame, Menu } from 'lucide-react'
import { useAuth } from '../../context/AuthProvider'
import { useSelectedHero } from '../../hooks/useSelectedHero'
import ConfirmDialog from './ConfirmDialog'
import NavDrawer from './NavDrawer'

export default function AppHeader() {
  const { signOut } = useAuth()
  const { hero } = useSelectedHero()
  const navigate = useNavigate()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-20 border-b-2 border-border bg-ink/90 pt-[env(safe-area-inset-top)] backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex shrink-0 items-center gap-2">
            <Flame className="h-7 w-7 text-hero-red" strokeWidth={2.5} />
            <span className="font-display text-xl uppercase tracking-wide sm:text-2xl">
              Hero<span className="text-hero-gold">Forge</span>
            </span>
          </div>
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            className="flex shrink-0 items-center justify-center rounded-md p-2 text-text-dim transition-colors hover:bg-panel-raised hover:text-text"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </header>

      <NavDrawer
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onChangeHero={() => setConfirmOpen(true)}
        onSignOut={() => signOut()}
      />

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
