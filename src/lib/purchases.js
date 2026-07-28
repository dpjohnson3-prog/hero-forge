import { Capacitor } from '@capacitor/core'
import { Purchases, LOG_LEVEL } from '@revenuecat/purchases-capacitor'

const IOS_API_KEY = import.meta.env.VITE_REVENUECAT_IOS_API_KEY

export async function configurePurchases() {
  if (Capacitor.getPlatform() !== 'ios') return

  if (!IOS_API_KEY) {
    console.warn('VITE_REVENUECAT_IOS_API_KEY is not set — skipping RevenueCat configuration.')
    return
  }

  await Purchases.setLogLevel({ level: LOG_LEVEL.DEBUG })
  await Purchases.configure({ apiKey: IOS_API_KEY })
}
