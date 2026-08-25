import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  BadgeCheck,
  Camera,
  Flame,
  Loader2,
  Sparkles,
  Utensils,
  X,
} from 'lucide-react'
import { INTRO_ELIGIBILITY_STATUS } from '@revenuecat/purchases-capacitor'
import { useSubscription } from '../context/SubscriptionProvider'
import { useSelectedHero } from '../hooks/useSelectedHero'
import HeroEmblem from '../components/forge/HeroEmblem'

const FEATURES = [
  { icon: Sparkles, text: 'Full multi-day training plans for your hero' },
  { icon: Camera, text: 'AI photo food logging — snap a meal, get instant macros' },
  { icon: BadgeCheck, text: 'AI body-measurement estimation from a single photo' },
  { icon: Utensils, text: 'Unlimited food logging and progress photo tracking' },
  { icon: Flame, text: 'Streak tracking and badges to keep you accountable' },
]

const PERIOD_UNIT_LABEL = {
  DAY: 'day',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year',
}

function formatDuration(value, unit) {
  const label = PERIOD_UNIT_LABEL[unit] ?? unit?.toLowerCase() ?? 'period'
  return `${value} ${label}${value === 1 ? '' : 's'}`
}

function packageIsTrialEligible(pkg, trialEligibility) {
  if (!pkg?.product?.introPrice || pkg.product.introPrice.price !== 0) return false
  const eligibility = trialEligibility[pkg.product.identifier]
  return eligibility?.status === INTRO_ELIGIBILITY_STATUS.INTRO_ELIGIBILITY_STATUS_ELIGIBLE
}

export default function Paywall() {
  const navigate = useNavigate()
  const { hero } = useSelectedHero()
  const { isPro, loading, offering, trialEligibility, purchase, restore } = useSubscription()
  const [selectedId, setSelectedId] = useState(null)
  const [purchasing, setPurchasing] = useState(false)
  const [restoring, setRestoring] = useState(false)
  const [statusMessage, setStatusMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const packages = useMemo(() => {
    if (!offering) return []
    return [offering.monthly, offering.annual].filter(Boolean)
  }, [offering])

  const selectedPackage =
    packages.find((pkg) => pkg.identifier === selectedId) ?? offering?.annual ?? packages[0] ?? null

  const savingsPct = useMemo(() => {
    if (!offering?.monthly || !offering?.annual) return null
    const yearlyAtMonthlyRate = offering.monthly.product.price * 12
    if (yearlyAtMonthlyRate <= 0) return null
    const pct = (1 - offering.annual.product.price / yearlyAtMonthlyRate) * 100
    return pct > 0 ? Math.round(pct) : null
  }, [offering])

  const trialText =
    selectedPackage && packageIsTrialEligible(selectedPackage, trialEligibility)
      ? formatDuration(
          selectedPackage.product.introPrice.periodNumberOfUnits,
          selectedPackage.product.introPrice.periodUnit,
        )
      : null

  const handleClose = () => navigate(-1)

  const handlePurchase = async () => {
    if (!selectedPackage) return
    setPurchasing(true)
    setErrorMessage(null)
    const result = await purchase(selectedPackage)
    setPurchasing(false)
    if (result.success) {
      navigate(-1)
    } else if (!result.cancelled) {
      setErrorMessage(result.error ?? 'Something went wrong with the purchase. Please try again.')
    }
  }

  const handleRestore = async () => {
    setRestoring(true)
    setErrorMessage(null)
    setStatusMessage(null)
    const result = await restore()
    setRestoring(false)
    if (!result.success) {
      setErrorMessage(result.error ?? 'Could not restore purchases.')
      return
    }
    if (result.isPro) {
      navigate(-1)
    } else {
      setStatusMessage('No active HeroForge Pro subscription found for this account.')
    }
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-6 sm:px-6">
      <div className="comic-panel relative overflow-hidden p-6 sm:p-8">
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close"
          className="absolute right-4 top-4 rounded-md p-1.5 text-text-dim hover:bg-panel-raised hover:text-text"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          {hero && (
            <div
              className="flex h-16 w-16 items-center justify-center rounded-full border-2 bg-panel-raised"
              style={{ borderColor: hero.color }}
            >
              <HeroEmblem heroId={hero.id} className="h-9 w-9" style={{ color: hero.color }} />
            </div>
          )}
          <h1 className="font-display mt-3 text-2xl uppercase tracking-wide sm:text-3xl">
            Unlock HeroForge Pro
          </h1>
          <p className="mt-2 text-sm text-text-dim">
            {hero
              ? `Give ${hero.name} the full training system — tracking, AI coaching, and the tools to actually get there.`
              : 'The full training system — tracking, AI coaching, and the tools to actually get there.'}
          </p>
        </div>

        <ul className="mt-6 space-y-2.5">
          {FEATURES.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-start gap-2.5 text-sm">
              <Icon className="mt-0.5 h-4 w-4 shrink-0 text-hero-gold" />
              <span>{text}</span>
            </li>
          ))}
        </ul>

        {isPro ? (
          <div className="mt-6 rounded-md border border-hero-gold bg-panel-raised px-4 py-3 text-center text-sm">
            <BadgeCheck className="mx-auto mb-1 h-5 w-5 text-hero-gold" />
            You're already a HeroForge Pro member.
          </div>
        ) : loading ? (
          <div className="mt-6 flex items-center justify-center gap-2 py-6 text-sm text-text-dim">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading pricing…
          </div>
        ) : packages.length === 0 ? (
          <div className="mt-6 rounded-md border border-border bg-panel-raised px-4 py-3 text-center text-sm text-text-dim">
            Pricing isn't available right now — please try again from the iOS app.
          </div>
        ) : (
          <>
            {trialText && (
              <div className="mt-6 rounded-md border border-hero-gold bg-panel-raised px-4 py-2.5 text-center text-sm font-semibold text-hero-gold">
                Try free for {trialText}
              </div>
            )}

            <div className="mt-4 grid grid-cols-2 gap-3">
              {packages.map((pkg) => {
                const isAnnual = pkg.packageType === 'ANNUAL'
                const isSelected = selectedPackage?.identifier === pkg.identifier
                return (
                  <button
                    key={pkg.identifier}
                    type="button"
                    onClick={() => setSelectedId(pkg.identifier)}
                    className={`relative rounded-lg border-2 p-3.5 text-left transition-colors ${
                      isSelected ? 'border-hero-gold bg-panel-raised' : 'border-border bg-panel-raised/60'
                    }`}
                  >
                    {isAnnual && savingsPct && (
                      <span className="absolute -top-2.5 right-2 rounded-full bg-hero-gold px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-ink">
                        Save {savingsPct}%
                      </span>
                    )}
                    <div className="text-xs uppercase tracking-wide text-text-dim">
                      {isAnnual ? 'Annual' : 'Monthly'}
                    </div>
                    <div className="font-display mt-1 text-lg">{pkg.product.priceString}</div>
                    <div className="text-xs text-text-dim">
                      / {isAnnual ? 'year' : 'month'}
                    </div>
                  </button>
                )
              })}
            </div>

            <button
              type="button"
              onClick={handlePurchase}
              disabled={purchasing || !selectedPackage}
              className="font-display mt-5 flex w-full items-center justify-center gap-2 rounded-md bg-hero-red px-4 py-3 text-sm uppercase tracking-wide text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {purchasing && <Loader2 className="h-4 w-4 animate-spin" />}
              {trialText ? 'Start Free Trial' : 'Subscribe'}
            </button>
          </>
        )}

        {errorMessage && <p className="mt-3 text-center text-xs text-hero-red">{errorMessage}</p>}
        {statusMessage && <p className="mt-3 text-center text-xs text-text-dim">{statusMessage}</p>}

        {!isPro && (
          <button
            type="button"
            onClick={handleRestore}
            disabled={restoring}
            className="mt-4 flex w-full items-center justify-center gap-1.5 text-center text-xs text-text-dim underline decoration-dotted underline-offset-4 hover:text-text disabled:opacity-50"
          >
            {restoring && <Loader2 className="h-3 w-3 animate-spin" />}
            Restore Purchase
          </button>
        )}

        <button
          type="button"
          onClick={handleClose}
          className="mt-4 block w-full text-center text-xs text-text-dim hover:text-text"
        >
          Not now
        </button>
      </div>
    </div>
  )
}
