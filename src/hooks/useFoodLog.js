import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthProvider'

const todayKey = () => new Date().toISOString().slice(0, 10)

function mapRow(row) {
  return {
    id: row.id,
    date: row.date,
    loggedAt: row.logged_at,
    name: row.name,
    calories: Number(row.calories),
    protein: Number(row.protein),
    carbs: Number(row.carbs),
    fat: Number(row.fat),
  }
}

export function useFoodLog() {
  const { user } = useAuth()
  const [todaysEntries, setTodaysEntries] = useState([])

  const refresh = useCallback(async () => {
    if (!user) {
      setTodaysEntries([])
      return
    }
    const { data, error } = await supabase
      .from('food_log')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', todayKey())
      .order('logged_at', { ascending: false })

    if (error) {
      console.error('Failed to load food log', error)
      return
    }
    setTodaysEntries((data ?? []).map(mapRow))
  }, [user])

  useEffect(() => {
    refresh()
  }, [refresh])

  const addEntry = async (entry) => {
    if (!user) return
    const { data, error } = await supabase
      .from('food_log')
      .insert({
        user_id: user.id,
        date: todayKey(),
        name: entry.name,
        calories: entry.calories ?? 0,
        protein: entry.protein ?? 0,
        carbs: entry.carbs ?? 0,
        fat: entry.fat ?? 0,
      })
      .select()
      .single()

    if (error) {
      console.error('Failed to add food entry', error)
      return
    }
    setTodaysEntries((prev) => [mapRow(data), ...prev])
  }

  const removeEntry = async (id) => {
    setTodaysEntries((prev) => prev.filter((e) => e.id !== id))
    const { error } = await supabase.from('food_log').delete().eq('id', id)
    if (error) console.error('Failed to remove food entry', error)
  }

  const todaysTotals = todaysEntries.reduce(
    (totals, e) => ({
      calories: totals.calories + Number(e.calories || 0),
      protein: totals.protein + Number(e.protein || 0),
      carbs: totals.carbs + Number(e.carbs || 0),
      fat: totals.fat + Number(e.fat || 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 },
  )

  return { todaysEntries, todaysTotals, addEntry, removeEntry }
}
