import { useRef, useState } from 'react'
import { Camera, Loader2, Plus, Sparkles } from 'lucide-react'
import { useFoodScan } from '../../hooks/useFoodScan'

const EMPTY = { name: '', calories: '', protein: '', carbs: '', fat: '' }

export default function FoodEntryForm({ onAdd }) {
  const [form, setForm] = useState(EMPTY)
  const [isAiEstimate, setIsAiEstimate] = useState(false)
  const [scanError, setScanError] = useState(null)
  const { scanFood, scanning } = useFoodScan()
  const fileInputRef = useRef(null)

  const update = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }))
    setIsAiEstimate(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim()) return
    onAdd({
      name: form.name.trim(),
      calories: Number(form.calories) || 0,
      protein: Number(form.protein) || 0,
      carbs: Number(form.carbs) || 0,
      fat: Number(form.fat) || 0,
    })
    setForm(EMPTY)
    setIsAiEstimate(false)
  }

  const handleScan = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return

    setScanError(null)
    const { estimate, error } = await scanFood(file)
    if (error) {
      setScanError(error)
      return
    }
    setForm({
      name: estimate.name ?? '',
      calories: estimate.calories != null ? String(Math.round(estimate.calories)) : '',
      protein: estimate.protein != null ? String(Math.round(estimate.protein)) : '',
      carbs: estimate.carbs != null ? String(Math.round(estimate.carbs)) : '',
      fat: estimate.fat != null ? String(Math.round(estimate.fat)) : '',
    })
    setIsAiEstimate(true)
  }

  return (
    <form onSubmit={handleSubmit} className="comic-panel p-4 sm:p-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-display text-sm uppercase tracking-wider text-text-dim">
          Log Food
        </h2>
        <button
          type="button"
          disabled={scanning}
          onClick={() => fileInputRef.current?.click()}
          className="font-display flex items-center gap-1.5 rounded-md border border-border bg-panel-raised px-3 py-1.5 text-xs uppercase tracking-wide text-text-dim transition-colors hover:text-text disabled:opacity-50"
        >
          {scanning ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Camera className="h-3.5 w-3.5" />}
          {scanning ? 'Scanning…' : 'Scan Food'}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleScan}
          className="hidden"
        />
      </div>

      {isAiEstimate && (
        <div className="mb-3 flex items-start gap-2 rounded-md border border-hero-gold bg-panel-raised px-3 py-2 text-xs text-hero-gold">
          <Sparkles className="h-3.5 w-3.5 shrink-0" />
          <span>AI estimate — review before saving. Photo-based calorie estimates are approximate.</span>
        </div>
      )}
      {scanError && <p className="mb-3 text-xs text-hero-red">{scanError}</p>}

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-6">
        <input
          type="text"
          placeholder="Food name"
          value={form.name}
          onChange={update('name')}
          required
          className="col-span-2 rounded-md border border-border bg-panel-raised px-3 py-2 text-sm outline-none focus:border-hero-gold sm:col-span-2"
        />
        <input
          type="number"
          min="0"
          placeholder="Cal"
          value={form.calories}
          onChange={update('calories')}
          className="rounded-md border border-border bg-panel-raised px-3 py-2 text-sm outline-none focus:border-hero-gold"
        />
        <input
          type="number"
          min="0"
          placeholder="Protein g"
          value={form.protein}
          onChange={update('protein')}
          className="rounded-md border border-border bg-panel-raised px-3 py-2 text-sm outline-none focus:border-hero-gold"
        />
        <input
          type="number"
          min="0"
          placeholder="Carbs g"
          value={form.carbs}
          onChange={update('carbs')}
          className="rounded-md border border-border bg-panel-raised px-3 py-2 text-sm outline-none focus:border-hero-gold"
        />
        <input
          type="number"
          min="0"
          placeholder="Fat g"
          value={form.fat}
          onChange={update('fat')}
          className="rounded-md border border-border bg-panel-raised px-3 py-2 text-sm outline-none focus:border-hero-gold"
        />
      </div>
      <button
        type="submit"
        className="font-display mt-3 flex items-center gap-1.5 rounded-md bg-hero-red px-4 py-2 text-sm uppercase tracking-wide text-white transition-opacity hover:opacity-90"
      >
        <Plus className="h-4 w-4" />
        Add Entry
      </button>
    </form>
  )
}
