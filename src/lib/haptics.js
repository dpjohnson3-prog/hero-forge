import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics'

async function safe(run) {
  try {
    await run()
  } catch {
    // Haptics are non-essential polish — never let a failure here affect the app.
  }
}

// A light tap for minor, frequent confirmations (logging food, capturing a photo).
export const tapLight = () => safe(() => Haptics.impact({ style: ImpactStyle.Light }))

// A success pulse for a completed workout or other one-off win.
export const celebrate = () => safe(() => Haptics.notification({ type: NotificationType.Success }))

// A bigger moment (e.g. a streak milestone) — a second pulse shortly after the first.
export function celebrateBig() {
  celebrate()
  setTimeout(celebrate, 220)
}
