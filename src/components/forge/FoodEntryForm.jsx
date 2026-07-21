import { useState } from 'react'
import { Plus } from 'lucide-react'

const EMPTY = { name: '', calories: '', protein: '', carbs: '', fat: '' }

export default function FoodEntryForm({ onAdd }) {
  const [form, setForm] = useState(EMPTY)

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

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
  }

  return (
    <form onSubmit={handleSubmit} className="comic-panel p-4 sm:p-5">
      <h2 className="font-display mb-3 text-sm uppercase tracking-wider text-text-dim">
        Log Food
      </h2>
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
