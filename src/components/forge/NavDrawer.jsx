import { useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { Dumbbell, LayoutDashboard, LogOut, Settings as SettingsIcon, Users, X } from 'lucide-react'

const itemClass = ({ isActive }) =>
  `flex items-center gap-3 rounded-md px-4 py-3 text-sm font-semibold transition-colors ${
    isActive ? 'bg-hero-gold text-ink' : 'text-text-dim hover:bg-panel-raised hover:text-text'
  }`

const buttonClass =
  'flex items-center gap-3 rounded-md px-4 py-3 text-left text-sm font-semibold text-text-dim transition-colors hover:bg-panel-raised hover:text-text'

export default function NavDrawer({ open, onClose, onChangeHero, onSignOut }) {
  useEffect(() => {
    if (!open) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  return (
    <>
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-ink/80 transition-opacity duration-300 ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        aria-hidden={!open}
        className={`fixed inset-y-0 right-0 z-50 flex w-72 max-w-[80vw] flex-col border-l-2 border-border bg-panel pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)] shadow-2xl transition-transform duration-300 ease-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <span className="font-display text-sm uppercase tracking-wide text-text-dim">Menu</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="rounded-md p-1.5 text-text-dim transition-colors hover:bg-panel-raised hover:text-text"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
          <NavLink to="/" end className={itemClass} onClick={onClose}>
            <Dumbbell className="h-5 w-5" />
            Train
          </NavLink>
          <NavLink to="/dashboard" className={itemClass} onClick={onClose}>
            <LayoutDashboard className="h-5 w-5" />
            Progress Dashboard
          </NavLink>
          <button
            type="button"
            onClick={() => {
              onClose()
              onChangeHero()
            }}
            className={buttonClass}
          >
            <Users className="h-5 w-5" />
            Change Hero
          </button>
          <NavLink to="/settings" className={itemClass} onClick={onClose}>
            <SettingsIcon className="h-5 w-5" />
            Settings
          </NavLink>
          <button
            type="button"
            onClick={() => {
              onClose()
              onSignOut()
            }}
            className={`${buttonClass} hover:text-hero-red`}
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </nav>
      </div>
    </>
  )
}
