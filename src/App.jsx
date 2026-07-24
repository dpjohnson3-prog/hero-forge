import { Routes, Route } from 'react-router-dom'
import AppHeader from './components/forge/AppHeader'
import AuthScreen from './components/forge/AuthScreen'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Settings from './pages/Settings'
import ChooseHero from './pages/ChooseHero'
import { useAuth } from './context/AuthProvider'
import { useSelectedHero } from './hooks/useSelectedHero'

function App() {
  const { user, loading } = useAuth()
  const { heroId, loaded: heroLoaded } = useSelectedHero()

  if (loading) {
    return <div className="min-h-screen" />
  }

  if (!user) {
    return <AuthScreen />
  }

  if (!heroLoaded) {
    return <div className="min-h-screen" />
  }

  if (!heroId) {
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
      </Routes>
    </div>
  )
}

export default App
