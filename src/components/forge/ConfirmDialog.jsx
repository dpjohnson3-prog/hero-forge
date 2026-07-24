export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-ink/90 p-4" onClick={onCancel}>
      <div className="comic-panel w-full max-w-sm p-5" onClick={(e) => e.stopPropagation()}>
        <h2 className="font-display mb-2 text-lg uppercase tracking-wide">{title}</h2>
        <p className="mb-4 text-sm text-text-dim">{message}</p>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-border px-4 py-2 text-sm text-text-dim transition-colors hover:text-text"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="font-display rounded-md bg-hero-red px-4 py-2 text-sm uppercase tracking-wide text-white transition-opacity hover:opacity-90"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
