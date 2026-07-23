import { useCallback, useEffect, useState } from 'react'
import { Capacitor } from '@capacitor/core'
import { LocalNotifications } from '@capacitor/local-notifications'

const WORKOUT_NOTIFICATION_ID = 1001
const FOOD_NOTIFICATION_ID = 1002

// Drives on-device scheduling from the user's saved reminder settings.
// Local Notifications only function on the native iOS/Android shell —
// this is a no-op (and permissionStatus stays 'unsupported') in a browser.
export function useLocalNotifications(settings, loaded) {
  const isNative = Capacitor.isNativePlatform()
  const [permissionStatus, setPermissionStatus] = useState(isNative ? 'unknown' : 'unsupported')

  const checkPermission = useCallback(async () => {
    if (!isNative) return
    const status = await LocalNotifications.checkPermissions()
    setPermissionStatus(status.display)
  }, [isNative])

  useEffect(() => {
    checkPermission()
  }, [checkPermission])

  const requestPermission = useCallback(async () => {
    if (!isNative) return 'unsupported'
    const status = await LocalNotifications.requestPermissions()
    setPermissionStatus(status.display)
    return status.display
  }, [isNative])

  useEffect(() => {
    if (!isNative || !loaded || permissionStatus !== 'granted') return

    async function sync() {
      await LocalNotifications.cancel({
        notifications: [{ id: WORKOUT_NOTIFICATION_ID }, { id: FOOD_NOTIFICATION_ID }],
      })

      const toSchedule = []

      if (settings.workoutReminderEnabled) {
        const [hour, minute] = settings.workoutReminderTime.split(':').map(Number)
        toSchedule.push({
          id: WORKOUT_NOTIFICATION_ID,
          title: 'HeroForge',
          body: "Time to train — log today's workout.",
          schedule: { on: { hour, minute }, repeats: true, allowWhileIdle: true },
        })
      }

      if (settings.foodReminderEnabled) {
        const [hour, minute] = settings.foodReminderTime.split(':').map(Number)
        toSchedule.push({
          id: FOOD_NOTIFICATION_ID,
          title: 'HeroForge',
          body: "Don't forget to log your food today.",
          schedule: { on: { hour, minute }, repeats: true, allowWhileIdle: true },
        })
      }

      if (toSchedule.length) {
        await LocalNotifications.schedule({ notifications: toSchedule })
      }
    }

    sync().catch((err) => console.error('Failed to sync local notifications', err))
  }, [
    isNative,
    loaded,
    permissionStatus,
    settings.workoutReminderEnabled,
    settings.workoutReminderTime,
    settings.foodReminderEnabled,
    settings.foodReminderTime,
  ])

  return { isNative, permissionStatus, requestPermission }
}
