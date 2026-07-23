import { useState } from 'react'
import { Images, Trash2, X } from 'lucide-react'

export default function PhotoGallery({ photos, onDelete }) {
  const [selected, setSelected] = useState(null)

  return (
    <div className="comic-panel p-4 sm:p-5">
      <div className="mb-1 flex items-center gap-2">
        <Images className="h-5 w-5 text-hero-blue" />
        <h2 className="font-display text-lg uppercase tracking-wide">Photo Timeline</h2>
      </div>

      {photos.length === 0 ? (
        <p className="mt-2 text-sm text-text-dim">No progress photos yet.</p>
      ) : (
        <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
          {photos.map((photo) => (
            <button
              key={photo.id}
              type="button"
              onClick={() => setSelected(photo)}
              className="group relative aspect-square overflow-hidden rounded-md border border-border bg-panel-raised"
            >
              {photo.url ? (
                <img
                  src={photo.url}
                  alt={`Progress photo from ${photo.date}`}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs text-text-dim">
                  Loading…
                </div>
              )}
              <span className="absolute inset-x-0 bottom-0 bg-ink/80 px-1.5 py-0.5 text-center text-[10px] text-text-dim">
                {photo.date}
              </span>
            </button>
          ))}
        </div>
      )}

      {selected && (
        <div
          className="fixed inset-0 z-30 flex items-center justify-center bg-ink/90 p-4"
          onClick={() => setSelected(null)}
        >
          <div className="comic-panel max-w-lg p-3" onClick={(e) => e.stopPropagation()}>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-semibold text-text-dim">{selected.date}</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    onDelete(selected)
                    setSelected(null)
                  }}
                  className="rounded-md p-1.5 text-text-dim hover:bg-panel-raised hover:text-hero-red"
                  aria-label="Delete photo"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="rounded-md p-1.5 text-text-dim hover:bg-panel-raised hover:text-text"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
            {selected.url && (
              <img
                src={selected.url}
                alt={`Progress photo from ${selected.date}`}
                className="max-h-[70vh] w-full rounded-md object-contain"
              />
            )}
          </div>
        </div>
      )}
    </div>
  )
}
