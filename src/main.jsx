import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthProvider.jsx'
import { SelectedHeroProvider } from './hooks/useSelectedHero.jsx'
import ConfigError from './components/forge/ConfigError.jsx'
import { isSupabaseConfigured } from './lib/supabaseClient.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {isSupabaseConfigured ? (
      <BrowserRouter>
        <AuthProvider>
          <SelectedHeroProvider>
            <App />
          </SelectedHeroProvider>
        </AuthProvider>
      </BrowserRouter>
    ) : (
      <ConfigError />
    )}
  </StrictMode>,
)
