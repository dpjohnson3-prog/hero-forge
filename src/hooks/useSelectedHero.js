import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthProvider'
import { getHeroById } from '../data/characterPlans'

export function useSelectedHero() {
  const { user } = useAuth()
  const [heroId, setHeroIdState] = useState(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!user) return
    let cancelled = false

    supabase
      .from('profiles')
      .select('selected_hero_id')
      .eq('id', user.id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (cancelled) return
        if (error) {
          console.error('Failed to load selected hero', error)
          setLoaded(true)
          return
        }
        setHeroIdState(data?.selected_hero_id ?? null)
        setLoaded(true)
      })

    return () => {
      cancelled = true
    }
  }, [user])

  const setHeroId = useCallback(
    (id) => {
      setHeroIdState(id)
      if (!user) return
      supabase
        .from('profiles')
        .upsert({ id: user.id, selected_hero_id: id })
        .then(({ error }) => {
          if (error) console.error('Failed to save selected hero', error)
        })
    },
    [user],
  )

  const hero = heroId ? getHeroById(heroId) : null
  return { hero, heroId, setHeroId, loaded }
}
