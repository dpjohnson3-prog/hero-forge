import { Flame } from 'lucide-react'

export default function ConfigError() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="comic-panel w-full max-w-md p-6">
        <div className="mb-4 flex items-center gap-2">
          <Flame className="h-7 w-7 text-hero-red" strokeWidth={2.5} />
          <span className="font-display text-xl uppercase tracking-wide">
            Hero<span className="text-hero-gold">Forge</span>
          </span>
        </div>
        <h1 className="font-display mb-2 text-lg uppercase tracking-wide text-hero-red">
          Supabase Not Configured
        </h1>
        <p className="mb-3 text-sm text-text-dim">
          <code className="rounded bg-panel-raised px-1.5 py-0.5 text-text">VITE_SUPABASE_URL</code> and{' '}
          <code className="rounded bg-panel-raised px-1.5 py-0.5 text-text">VITE_SUPABASE_ANON_KEY</code> are
          missing. To fix this:
        </p>
        <ol className="list-inside list-decimal space-y-1.5 text-sm text-text-dim">
          <li>
            Copy <code className="rounded bg-panel-raised px-1.5 py-0.5 text-text">.env.example</code> to{' '}
            <code className="rounded bg-panel-raised px-1.5 py-0.5 text-text">.env</code> in the project root.
          </li>
          <li>
            Fill in your Project URL and anon public key from Supabase → Project Settings → API.
          </li>
          <li>Restart the dev server.</li>
        </ol>
      </div>
    </div>
  )
}
