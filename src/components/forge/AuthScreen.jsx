import { useState } from 'react'
import { Flame } from 'lucide-react'
import { useAuth } from '../../context/AuthProvider'

export default function AuthScreen() {
  const { signUp, signIn, signInWithApple } = useAuth()
  const [mode, setMode] = useState('sign-in')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState(null) // { type: 'error' | 'info', message }
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus(null)
    setSubmitting(true)

    const { error, data } =
      mode === 'sign-up' ? await signUp(email, password) : await signIn(email, password)

    setSubmitting(false)

    if (error) {
      setStatus({ type: 'error', message: error.message })
      return
    }

    if (mode === 'sign-up' && !data.session) {
      setStatus({
        type: 'info',
        message: 'Check your email to confirm your account, then sign in.',
      })
      setMode('sign-in')
    }
  }

  const handleApple = async () => {
    setStatus(null)
    const { error } = await signInWithApple()
    if (error) setStatus({ type: 'error', message: error.message })
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="comic-panel w-full max-w-sm p-6">
        <div className="mb-6 flex items-center justify-center gap-2">
          <Flame className="h-7 w-7 text-hero-red" strokeWidth={2.5} />
          <span className="font-display text-xl uppercase tracking-wide">
            Hero<span className="text-hero-gold">Forge</span>
          </span>
        </div>

        <h1 className="font-display mb-1 text-center text-lg uppercase tracking-wide">
          {mode === 'sign-up' ? 'Create Your Account' : 'Welcome Back'}
        </h1>
        <p className="mb-5 text-center text-sm text-text-dim">
          {mode === 'sign-up'
            ? 'Start training toward your hero physique.'
            : 'Sign in to pick up your plan.'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <label className="block">
            <span className="mb-1 block text-xs text-text-dim">Email</span>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-border bg-panel-raised px-3 py-2 text-sm outline-none focus:border-hero-gold"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs text-text-dim">Password</span>
            <input
              type="password"
              required
              minLength={6}
              autoComplete={mode === 'sign-up' ? 'new-password' : 'current-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-border bg-panel-raised px-3 py-2 text-sm outline-none focus:border-hero-gold"
            />
          </label>

          {status && (
            <p className={`text-xs ${status.type === 'error' ? 'text-hero-red' : 'text-hero-gold'}`}>
              {status.message}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="font-display w-full rounded-md bg-hero-red px-4 py-2.5 text-sm uppercase tracking-wide text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {mode === 'sign-up' ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <div className="my-4 flex items-center gap-3 text-xs text-text-dim">
          <div className="h-px flex-1 bg-border" />
          or
          <div className="h-px flex-1 bg-border" />
        </div>

        <button
          type="button"
          onClick={handleApple}
          className="flex w-full items-center justify-center gap-2 rounded-md border border-border bg-panel-raised px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-ink"
        >
          <AppleLogo className="h-4 w-4" />
          Sign in with Apple
        </button>

        <button
          type="button"
          onClick={() => {
            setStatus(null)
            setMode((m) => (m === 'sign-up' ? 'sign-in' : 'sign-up'))
          }}
          className="mt-5 w-full text-center text-xs text-text-dim hover:text-text"
        >
          {mode === 'sign-up' ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
        </button>
      </div>
    </div>
  )
}

function AppleLogo(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.57-.12 0-.23-.02-.3-.03-.01-.06-.04-.22-.04-.39 0-1.15.572-2.27 1.206-2.98.804-.94 2.142-1.64 3.248-1.68.03.13.05.28.05.43zm4.565 15.71c-.03.07-.463 1.58-1.518 3.12-.945 1.34-1.94 2.71-3.43 2.71-1.517 0-1.9-.88-3.63-.88-1.698 0-2.302.91-3.696.91-1.395 0-2.367-1.34-3.35-2.68-1.202-1.65-2.144-4.14-2.144-6.51 0-3.83 2.502-5.86 4.96-5.86 1.331 0 2.436.9 3.267.9.79 0 2.032-.95 3.532-.95.567 0 2.617.05 3.97 1.99-.103.06-2.37 1.38-2.37 4.17 0 3.34 2.938 4.52 2.99 4.53z" />
    </svg>
  )
}
