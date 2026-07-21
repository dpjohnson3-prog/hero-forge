import { useState } from 'react'
import { Plus } from 'lucide-react'

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

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

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
  }

  return (
    <form onSubmit={handleSubmit} className="comic-panel p-4 sm:p-5">
      <h2 className="font-display mb-3 text-sm uppercase tracking-wider text-text-dim">
        Log Measurements
      </h2>

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
