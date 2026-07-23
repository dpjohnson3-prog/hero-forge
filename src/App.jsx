import { Routes, Route } from 'react-router-dom'
import AppHeader from './components/forge/AppHeader'
import AuthScreen from './components/forge/AuthScreen'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Settings from './pages/Settings'
import { useAuth } from './context/AuthProvider'

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="min-h-screen" />
  }

  if (!user) {
    return <AuthScreen />
  }

  return (
    <div className="min-h-screen">
      <AppHeader />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </div>
  )
}

export default App
