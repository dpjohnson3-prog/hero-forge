import { useRef, useState } from 'react'
import { Camera, Loader2 } from 'lucide-react'
import { tapLight } from '../../lib/haptics'

export default function PhotoUpload({ onUpload, uploading }) {
  const inputRef = useRef(null)
  const [error, setError] = useState(null)

  const handleChange = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = '' // allow re-selecting the same file later
    if (!file) return

    tapLight()
    setError(null)
    const { error: uploadError } = await onUpload(file)
    if (uploadError) setError(uploadError)
  }

  return (
    <div className="comic-panel p-4 sm:p-5">
      <h2 className="font-display mb-3 text-sm uppercase tracking-wider text-text-dim">
        Progress Photo
      </h2>
      <p className="mb-3 text-sm text-text-dim">
        Add a photo tagged with today's date to build a visual timeline of your transformation.
      </p>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleChange}
        className="hidden"
      />
      <button
        type="button"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        className="font-display flex items-center gap-1.5 rounded-md bg-hero-red px-4 py-2 text-sm uppercase tracking-wide text-white transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
        {uploading ? 'Uploading…' : 'Add Today’s Photo'}
      </button>

      {error && <p className="mt-2 text-xs text-hero-red">{error}</p>}
    </div>
  )
}
