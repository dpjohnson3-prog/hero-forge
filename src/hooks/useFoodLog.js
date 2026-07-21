import { useMemo } from 'react'
import { useLocalStorage } from './useLocalStorage'

const todayKey = () => new Date().toISOString().slice(0, 10)

export function useFoodLog() {
  const [entries, setEntries] = useLocalStorage('heroforge:foodLog', [])

  const addEntry = (entry) => {
    setEntries((prev) => [
      {
        id: crypto.randomUUID(),
        date: todayKey(),
        loggedAt: new Date().toISOString(),
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        ...entry,
      },
      ...prev,
    ])
  }

  const removeEntry = (id) => {
    setEntries((prev) => prev.filter((e) => e.id !== id))
  }

  const todaysEntries = useMemo(
    () => entries.filter((e) => e.date === todayKey()).sort((a, b) => b.loggedAt.localeCompare(a.loggedAt)),
    [entries],
  )

  const todaysTotals = useMemo(
    () =>
      todaysEntries.reduce(
        (totals, e) => ({
          calories: totals.calories + Number(e.calories || 0),
          protein: totals.protein + Number(e.protein || 0),
          carbs: totals.carbs + Number(e.carbs || 0),
          fat: totals.fat + Number(e.fat || 0),
        }),
        { calories: 0, protein: 0, carbs: 0, fat: 0 },
      ),
    [todaysEntries],
  )

  return { entries, todaysEntries, todaysTotals, addEntry, removeEntry }
}
