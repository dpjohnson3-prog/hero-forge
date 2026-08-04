import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { Capacitor } from '@capacitor/core'
import { Purchases } from '@revenuecat/purchases-capacitor'

const PRO_ENTITLEMENT_ID = 'pro'

const SubscriptionContext = createContext(null)

export function SubscriptionProvider({ children }) {
  const [isPro, setIsPro] = useState(false)
  const [offering, setOffering] = useState(null)
  const [trialEligibility, setTrialEligibility] = useState({})
  const [managementURL, setManagementURL] = useState(null)
  const [loading, setLoading] = useState(Capacitor.getPlatform() === 'ios')
  const [error, setError] = useState(null)

  const applyCustomerInfo = useCallback((customerInfo) => {
    setIsPro(Boolean(customerInfo?.entitlements?.active?.[PRO_ENTITLEMENT_ID]))
    setManagementURL(customerInfo?.managementURL ?? null)
  }, [])

  const refresh = useCallback(async () => {
    if (Capacitor.getPlatform() !== 'ios') {
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)
    try {
      const [{ customerInfo }, offerings] = await Promise.all([
        Purchases.getCustomerInfo(),
        Purchases.getOfferings(),
      ])
      applyCustomerInfo(customerInfo)
      setOffering(offerings.current)

      const productIds = offerings.current?.availablePackages.map((pkg) => pkg.product.identifier) ?? []
      if (productIds.length > 0) {
        const eligibility = await Purchases.checkTrialOrIntroductoryPriceEligibility({
          productIdentifiers: productIds,
        })
        setTrialEligibility(eligibility)
      }
    } catch (err) {
      console.error('Failed to load subscription status', err)
      setError(err?.message ?? 'Failed to load subscription status')
    } finally {
      setLoading(false)
    }
  }, [applyCustomerInfo])

  useEffect(() => {
    refresh()
  }, [refresh])

  const purchase = useCallback(
    async (pkg) => {
      try {
        const result = await Purchases.purchasePackage({ aPackage: pkg })
        applyCustomerInfo(result.customerInfo)
        return { success: true }
      } catch (err) {
        if (err?.userCancelled) return { success: false, cancelled: true }
        console.error('Purchase failed', err)
        return { success: false, error: err?.message ?? 'Purchase failed' }
      }
    },
    [applyCustomerInfo],
  )

  const restore = useCallback(async () => {
    try {
      const { customerInfo } = await Purchases.restorePurchases()
      applyCustomerInfo(customerInfo)
      return { success: true, isPro: Boolean(customerInfo.entitlements.active[PRO_ENTITLEMENT_ID]) }
    } catch (err) {
      console.error('Restore failed', err)
      return { success: false, error: err?.message ?? 'Restore failed' }
    }
  }, [applyCustomerInfo])

  const value = {
    isPro,
    loading,
    offering,
    trialEligibility,
    managementURL,
    error,
    purchase,
    restore,
    refresh,
  }

  return <SubscriptionContext.Provider value={value}>{children}</SubscriptionContext.Provider>
}

export function useSubscription() {
  const ctx = useContext(SubscriptionContext)
  if (!ctx) throw new Error('useSubscription must be used within a SubscriptionProvider')
  return ctx
}
