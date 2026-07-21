import { useLocalStorage } from './useLocalStorage'
import { HEROES, getHeroById } from '../data/characterPlans'

export function useSelectedHero() {
  const [heroId, setHeroId] = useLocalStorage('heroforge:selectedHero', HEROES[0].id)
  const hero = getHeroById(heroId) ?? HEROES[0]
  return { hero, heroId, setHeroId }
}
