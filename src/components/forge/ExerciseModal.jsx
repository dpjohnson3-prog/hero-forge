import { X } from 'lucide-react'
import ExerciseIcon from './ExerciseIcon'
import { getExercisePhoto } from '../../data/exercisePhotos'
import { getExerciseInfo } from '../../data/exerciseLibrary'

export default function ExerciseModal({ exercise, onClose }) {
  if (!exercise) return null
  const info = getExerciseInfo(exercise.name)
  const photo = getExercisePhoto(exercise.name)

  return (
    <div
      className="fixed inset-0 z-30 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        className="comic-panel w-full max-w-sm p-5 sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-2 flex items-start justify-between gap-3">
          <h3 className="font-display text-lg sm:text-xl">{exercise.name}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 rounded-full p-1 text-text-dim hover:bg-panel-raised hover:text-text"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-hero-gold">
          {exercise.sets} sets × {exercise.reps}
        </p>

        {photo ? (
          <div className="mx-auto mb-1 w-full max-w-[240px]">
            <img src={photo.url} alt={exercise.name} className="aspect-square w-full rounded-lg border border-border object-cover" />
            <p className="mt-1.5 text-center text-[10px] text-text-dim">
              Photo: {photo.licenseAuthor} via wger.de, {photo.license}
            </p>
          </div>
        ) : (
          <div className="mx-auto mb-4 flex h-40 w-40 items-center justify-center rounded-lg border border-border bg-panel-raised">
            <ExerciseIcon pose={info.pose} equipment={info.equipment} className="h-32 w-32 text-hero-gold" />
          </div>
        )}

        <p className="text-sm text-text-dim">{info.cue}</p>
      </div>
    </div>
  )
}
