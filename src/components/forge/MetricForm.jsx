import { useRef, useState } from 'react'
import { Camera, Loader2, Plus, Sparkles } from 'lucide-react'
import { useBodyEstimate } from '../../hooks/useBodyEstimate'

const EMPTY = {
  date: new Date().toISOString().slice(0, 10),
  weight: '',
  chest: '',
  waist: '',
  arms: '',
  thighs: '',
}

const FIELDS = [
  ['weight', 'Weight', 'lb'],
  ['chest', 'Chest', 'in'],
  ['waist', 'Waist', 'in'],
  ['arms', 'Arms', 'in'],
  ['thighs', 'Thighs', 'in'],
]

export default function MetricForm({ onAdd }) {
  const [form, setForm] = useState(EMPTY)
  const [isAiEstimate, setIsAiEstimate] = useState(false)
  const [estimateNote, setEstimateNote] = useState(null)
  const [estimateError, setEstimateError] = useState(null)
  const [showPoseGuide, setShowPoseGuide] = useState(false)
  const { estimateFromPhoto, estimating } = useBodyEstimate()
  const fileInputRef = useRef(null)

  const update = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }))
    setIsAiEstimate(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const hasValue = FIELDS.some(([key]) => form[key] !== '')
    if (!hasValue) return
    onAdd({
      date: form.date,
      weight: form.weight === '' ? null : Number(form.weight),
      chest: form.chest === '' ? null : Number(form.chest),
      waist: form.waist === '' ? null : Number(form.waist),
      arms: form.arms === '' ? null : Number(form.arms),
      thighs: form.thighs === '' ? null : Number(form.thighs),
    })
    setForm({ ...EMPTY, date: form.date })
    setIsAiEstimate(false)
    setEstimateNote(null)
  }

  const handleEstimate = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return

    setEstimateError(null)
    setEstimateNote(null)
    const { estimate, error } = await estimateFromPhoto(file)
    if (error) {
      setEstimateError(error)
      return
    }
    setForm((f) => ({
      ...f,
      weight: estimate.weight != null ? String(Math.round(estimate.weight)) : '',
      chest: estimate.chest != null ? String(Math.round(estimate.chest)) : '',
      waist: estimate.waist != null ? String(Math.round(estimate.waist)) : '',
      arms: estimate.arms != null ? String(Math.round(estimate.arms)) : '',
      thighs: estimate.thighs != null ? String(Math.round(estimate.thighs)) : '',
    }))
    setIsAiEstimate(true)
    if (estimate.note) setEstimateNote(estimate.note)
  }

  return (
    <form onSubmit={handleSubmit} className="comic-panel p-4 sm:p-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-display text-sm uppercase tracking-wider text-text-dim">
          Log Measurements
        </h2>
        <button
          type="button"
          disabled={estimating}
          onClick={() => setShowPoseGuide((v) => !v)}
          className="font-display flex items-center gap-1.5 rounded-md border border-border bg-panel-raised px-3 py-1.5 text-xs uppercase tracking-wide text-text-dim transition-colors hover:text-text disabled:opacity-50"
        >
          {estimating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Camera className="h-3.5 w-3.5" />}
          {estimating ? 'Estimating…' : 'Estimate From Photo'}
        </button>
      </div>

      {showPoseGuide && !estimating && (
        <div className="mb-3 rounded-md border border-border bg-panel-raised px-3 py-2.5 text-xs text-text-dim">
          <p className="mb-2">
            For the best estimate: stand straight, face the camera, feet shoulder-width apart, arms
            slightly away from your body, in fitted clothing, with good lighting and your full body
            in frame.
          </p>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="font-display flex items-center gap-1.5 rounded-md bg-hero-blue px-3 py-1.5 text-xs uppercase tracking-wide text-white transition-opacity hover:opacity-90"
          >
            <Camera className="h-3.5 w-3.5" />
            Take / Choose Photo
          </button>
        </div>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleEstimate}
        className="hidden"
      />

      {isAiEstimate && (
        <div className="mb-3 flex items-start gap-2 rounded-md border border-hero-gold bg-panel-raised px-3 py-2 text-xs text-hero-gold">
          <Sparkles className="h-3.5 w-3.5 shrink-0" />
          <span>
            Rough AI estimate — please adjust. Photo-based measurement estimates are not precise.
            {estimateNote ? ` ${estimateNote}` : ''}
          </span>
        </div>
      )}
      {estimateError && <p className="mb-3 text-xs text-hero-red">{estimateError}</p>}

      <label className="mb-2.5 block">
        <span className="mb-1 block text-xs text-text-dim">Date</span>
        <input
          type="date"
          value={form.date}
          onChange={update('date')}
          className="w-full rounded-md border border-border bg-panel-raised px-3 py-2 text-sm outline-none focus:border-hero-gold"
        />
      </label>

      <div className="grid grid-cols-2 gap-2.5">
        {FIELDS.map(([key, label, unit]) => (
          <label key={key} className="block">
            <span className="mb-1 block text-xs text-text-dim">
              {label} <span className="text-text-dim/70">({unit})</span>
            </span>
            <input
              type="number"
              min="0"
              step="0.1"
              value={form[key]}
              onChange={update(key)}
              className="w-full rounded-md border border-border bg-panel-raised px-3 py-2 text-sm outline-none focus:border-hero-gold"
            />
          </label>
        ))}
      </div>

      <button
        type="submit"
        className="font-display mt-3 flex items-center gap-1.5 rounded-md bg-hero-blue px-4 py-2 text-sm uppercase tracking-wide text-white transition-opacity hover:opacity-90"
      >
        <Plus className="h-4 w-4" />
        Add Measurement
      </button>
    </form>
  )
}
