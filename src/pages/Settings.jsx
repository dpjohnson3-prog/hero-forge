import { Link } from 'react-router-dom'
import { Bell, BellOff, Dumbbell, Sparkles, Utensils } from 'lucide-react'
import { useReminderSettings } from '../hooks/useReminderSettings'
import { useLocalNotifications } from '../hooks/useLocalNotifications'
import { useSubscription } from '../context/SubscriptionProvider'

function ReminderRow({ icon: Icon, label, description, enabled, time, onToggle, onTimeChange }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-panel-raised px-4 py-3">
      <div className="flex items-center gap-3">
        <Icon className="h-5 w-5 shrink-0 text-hero-gold" />
        <div>
          <div className="font-display text-sm">{label}</div>
          <div className="text-xs text-text-dim">{description}</div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <input
          type="time"
          value={time}
          disabled={!enabled}
          onChange={(e) => onTimeChange(e.target.value)}
          className="rounded-md border border-border bg-panel px-2.5 py-1.5 text-sm outline-none focus:border-hero-gold disabled:opacity-40"
        />
        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          onClick={() => onToggle(!enabled)}
          className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
            enabled ? 'bg-hero-gold' : 'bg-panel'
          }`}
        >
          <span
            className={`absolute top-0.5 h-5 w-5 rounded-full bg-ink transition-transform ${
              enabled ? 'translate-x-5' : 'translate-x-0.5'
            }`}
          />
        </button>
      </div>
    </div>
  )
}

export default function Settings() {
  const { settings, loaded, updateSettings } = useReminderSettings()
  const { isNative, permissionStatus, requestPermission } = useLocalNotifications(settings, loaded)
  const { isPro, managementURL } = useSubscription()

  return (
    <div className="mx-auto max-w-3xl space-y-5 px-4 py-6 sm:px-6">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl">Settings</h1>
        <p className="mt-1 text-sm text-text-dim">Daily reminders to keep your streak alive.</p>
      </div>

      <div className="comic-panel flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5">
        <div className="flex items-center gap-3">
          <Sparkles className="h-5 w-5 shrink-0 text-hero-gold" />
          <div>
            <div className="font-display text-sm">HeroForge Pro</div>
            <div className="text-xs text-text-dim">
              {isPro
                ? 'You have an active Pro subscription.'
                : 'Unlock full training plans, AI food & body scans, and progress tracking.'}
            </div>
          </div>
        </div>
        {isPro ? (
          managementURL ? (
            <a
              href={managementURL}
              target="_blank"
              rel="noreferrer"
              className="font-display shrink-0 rounded-md border border-border bg-panel-raised px-4 py-2 text-sm uppercase tracking-wide text-text-dim transition-colors hover:text-text"
            >
              Manage Subscription
            </a>
          ) : (
            <span className="font-display shrink-0 rounded-md bg-hero-gold px-4 py-2 text-sm uppercase tracking-wide text-ink">
              Active
            </span>
          )
        ) : (
          <Link
            to="/paywall"
            className="font-display shrink-0 rounded-md bg-hero-gold px-4 py-2 text-sm uppercase tracking-wide text-ink transition-opacity hover:opacity-90"
          >
            Upgrade to Pro
          </Link>
        )}
      </div>

      {!isNative && (
        <div className="comic-panel flex items-start gap-3 border-hero-gold p-4">
          <BellOff className="h-5 w-5 shrink-0 text-hero-gold" />
          <p className="text-sm text-text-dim">
            Reminder times save here, but notifications only fire in the HeroForge iOS app — this
            browser can't schedule them.
          </p>
        </div>
      )}

      {isNative && permissionStatus !== 'granted' && (
        <div className="comic-panel flex flex-wrap items-center justify-between gap-3 border-hero-red p-4">
          <div className="flex items-center gap-3">
            <Bell className="h-5 w-5 shrink-0 text-hero-red" />
            <p className="text-sm text-text-dim">
              {permissionStatus === 'denied'
                ? 'Notifications are blocked. Enable them for HeroForge in iOS Settings → Notifications.'
                : 'Allow notifications to receive your reminders.'}
            </p>
          </div>
          {permissionStatus !== 'denied' && (
            <button
              type="button"
              onClick={requestPermission}
              className="font-display shrink-0 rounded-md bg-hero-red px-4 py-2 text-sm uppercase tracking-wide text-white transition-opacity hover:opacity-90"
            >
              Enable
            </button>
          )}
        </div>
      )}

      <div className="comic-panel space-y-3 p-4 sm:p-5">
        <h2 className="font-display mb-1 text-sm uppercase tracking-wider text-text-dim">
          Daily Reminders
        </h2>

        <ReminderRow
          icon={Dumbbell}
          label="Workout Reminder"
          description="A nudge to log today's training."
          enabled={settings.workoutReminderEnabled}
          time={settings.workoutReminderTime}
          onToggle={(enabled) => updateSettings({ workoutReminderEnabled: enabled })}
          onTimeChange={(time) => updateSettings({ workoutReminderTime: time })}
        />

        <ReminderRow
          icon={Utensils}
          label="Food Log Reminder"
          description="A nudge to log today's meals."
          enabled={settings.foodReminderEnabled}
          time={settings.foodReminderTime}
          onToggle={(enabled) => updateSettings({ foodReminderEnabled: enabled })}
          onTimeChange={(time) => updateSettings({ foodReminderTime: time })}
        />
      </div>
    </div>
  )
}
