import { useMemo } from 'react'
import { useLocalStorage } from './useLocalStorage'

export function useBodyMetrics() {
  const [metrics, setMetrics] = useLocalStorage('heroforge:bodyMetrics', [])

  const addMetric = (metric) => {
    setMetrics((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        date: new Date().toISOString().slice(0, 10),
        weight: null,
        chest: null,
        waist: null,
        arms: null,
        thighs: null,
        ...metric,
      },
    ])
  }

  const removeMetric = (id) => {
    setMetrics((prev) => prev.filter((m) => m.id !== id))
  }

  const sortedMetrics = useMemo(
    () => [...metrics].sort((a, b) => a.date.localeCompare(b.date)),
    [metrics],
  )

  const latest = sortedMetrics.length ? sortedMetrics[sortedMetrics.length - 1] : null

  return { metrics: sortedMetrics, latest, addMetric, removeMetric }
}
