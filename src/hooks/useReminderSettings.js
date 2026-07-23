import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthProvider'

const DEFAULTS = {
  workoutReminderEnabled: false,
  workoutReminderTime: '08:00',
  foodReminderEnabled: false,
  foodReminderTime: '12:00',
}

export function useReminderSettings() {
  const { user } = useAuth()
  const [settings, setSettings] = useState(DEFAULTS)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!user) return
    let cancelled = false

    supabase
      .from('profiles')
      .select('workout_reminder_enabled, workout_reminder_time, food_reminder_enabled, food_reminder_time')
      .eq('id', user.id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (cancelled) return
        if (error) {
          console.error('Failed to load reminder settings', error)
          return
        }
        if (data) {
          setSettings({
            workoutReminderEnabled: data.workout_reminder_enabled,
            workoutReminderTime: data.workout_reminder_time,
            foodReminderEnabled: data.food_reminder_enabled,
            foodReminderTime: data.food_reminder_time,
          })
        }
        setLoaded(true)
      })

    return () => {
      cancelled = true
    }
  }, [user])

  const updateSettings = useCallback(
    (patch) => {
      setSettings((prev) => ({ ...prev, ...patch }))
      if (!user) return

      const columnPatch = {}
      if ('workoutReminderEnabled' in patch) columnPatch.workout_reminder_enabled = patch.workoutReminderEnabled
      if ('workoutReminderTime' in patch) columnPatch.workout_reminder_time = patch.workoutReminderTime
      if ('foodReminderEnabled' in patch) columnPatch.food_reminder_enabled = patch.foodReminderEnabled
      if ('foodReminderTime' in patch) columnPatch.food_reminder_time = patch.foodReminderTime

      supabase
        .from('profiles')
        .upsert({ id: user.id, ...columnPatch })
        .then(({ error }) => {
          if (error) console.error('Failed to save reminder settings', error)
        })
    },
    [user],
  )

  return { settings, loaded, updateSettings }
}
