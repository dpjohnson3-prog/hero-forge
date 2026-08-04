import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import AppHeader from './components/forge/AppHeader'
import AuthScreen from './components/forge/AuthScreen'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Settings from './pages/Settings'
import ChooseHero from './pages/ChooseHero'
import Paywall from './pages/Paywall'
import { useAuth } from './context/AuthProvider'
import { useSelectedHero } from './hooks/useSelectedHero'
import { configurePurchases } from './lib/purchases'

function App() {
  const { user, loading } = useAuth()
  const { hero, heroId, loaded: heroLoaded } = useSelectedHero()

  useEffect(() => {
    configurePurchases()
  }, [])

  if (loading) {
    return <div className="min-h-screen" />
  }

  if (!user) {
    return <AuthScreen />
  }

  if (!heroLoaded) {
    return <div className="min-h-screen" />
  }

  if (!heroId || !hero) {
    return <ChooseHero />
  }

  return (
    <div className="min-h-screen">
      <AppHeader />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/choose-hero" element={<ChooseHero />} />
        <Route path="/paywall" element={<Paywall />} />
      </Routes>
    </div>
  )
}

export default App
