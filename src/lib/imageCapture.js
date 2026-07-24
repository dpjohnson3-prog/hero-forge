// Downscales a captured photo before it's base64-encoded and sent to an edge
// function — keeps request payloads small and analysis fast.
export async function fileToResizedBase64(file, maxDim = 1024) {
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height))
  const width = Math.round(bitmap.width * scale)
  const height = Math.round(bitmap.height * scale)

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  ctx.drawImage(bitmap, 0, 0, width, height)

  const mediaType = 'image/jpeg'
  const dataUrl = canvas.toDataURL(mediaType, 0.85)
  const base64 = dataUrl.split(',')[1]
  return { base64, mediaType }
}
