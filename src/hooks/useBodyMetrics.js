import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthProvider'

function mapRow(row) {
  return {
    id: row.id,
    date: row.date,
    weight: row.weight,
    chest: row.chest,
    waist: row.waist,
    arms: row.arms,
    thighs: row.thighs,
  }
}

export function useBodyMetrics() {
  const { user } = useAuth()
  const [metrics, setMetrics] = useState([])

  const refresh = useCallback(async () => {
    if (!user) {
      setMetrics([])
      return
    }
    const { data, error } = await supabase
      .from('body_metrics')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: true })

    if (error) {
      console.error('Failed to load body metrics', error)
      return
    }
    setMetrics((data ?? []).map(mapRow))
  }, [user])

  useEffect(() => {
    refresh()
  }, [refresh])

  const addMetric = async (metric) => {
    if (!user) return
    const { data, error } = await supabase
      .from('body_metrics')
      .insert({
        user_id: user.id,
        date: metric.date,
        weight: metric.weight,
        chest: metric.chest,
        waist: metric.waist,
        arms: metric.arms,
        thighs: metric.thighs,
      })
      .select()
      .single()

    if (error) {
      console.error('Failed to add body metric', error)
      return
    }
    setMetrics((prev) => [...prev, mapRow(data)].sort((a, b) => a.date.localeCompare(b.date)))
  }

  const removeMetric = async (id) => {
    setMetrics((prev) => prev.filter((m) => m.id !== id))
    const { error } = await supabase.from('body_metrics').delete().eq('id', id)
    if (error) console.error('Failed to remove body metric', error)
  }

  const latest = metrics.length ? metrics[metrics.length - 1] : null

  return { metrics, latest, addMetric, removeMetric }
}
