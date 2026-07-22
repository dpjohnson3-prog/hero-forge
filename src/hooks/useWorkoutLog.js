import { useCallback, useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthProvider'

const todayKey = () => new Date().toISOString().slice(0, 10)

function shiftDate(dateStr, deltaDays) {
  const d = new Date(`${dateStr}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + deltaDays)
  return d.toISOString().slice(0, 10)
}

export function useWorkoutLog() {
  const { user } = useAuth()
  const [dates, setDates] = useState([]) // completed=true dates, 'YYYY-MM-DD'

  const refresh = useCallback(async () => {
    if (!user) {
      setDates([])
      return
    }
    const { data, error } = await supabase
      .from('workout_log')
      .select('date')
      .eq('user_id', user.id)
      .eq('completed', true)
      .order('date', { ascending: true })

    if (error) {
      console.error('Failed to load workout log', error)
      return
    }
    setDates((data ?? []).map((row) => row.date))
  }, [user])

  useEffect(() => {
    refresh()
  }, [refresh])

  const dateSet = useMemo(() => new Set(dates), [dates])
  const todayCompleted = dateSet.has(todayKey())

  const toggleToday = async () => {
    if (!user) return
    const today = todayKey()

    if (todayCompleted) {
      setDates((prev) => prev.filter((d) => d !== today))
      const { error } = await supabase
        .from('workout_log')
        .delete()
        .eq('user_id', user.id)
        .eq('date', today)
      if (error) console.error('Failed to unmark workout', error)
    } else {
      setDates((prev) => [...prev, today].sort())
      const { error } = await supabase
        .from('workout_log')
        .upsert({ user_id: user.id, date: today, completed: true }, { onConflict: 'user_id,date' })
      if (error) console.error('Failed to mark workout complete', error)
    }
  }

  const totalSessions = dates.length

  const currentStreak = useMemo(() => {
    let streak = 0
    let cursor = dateSet.has(todayKey()) ? todayKey() : shiftDate(todayKey(), -1)
    while (dateSet.has(cursor)) {
      streak += 1
      cursor = shiftDate(cursor, -1)
    }
    return streak
  }, [dateSet])

  return { todayCompleted, toggleToday, totalSessions, currentStreak }
}
