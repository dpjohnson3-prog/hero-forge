import { Routes, Route } from 'react-router-dom'
import AppHeader from './components/forge/AppHeader'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'

function App() {
  return (
    <div className="min-h-screen">
      <AppHeader />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  )
}

export default App
