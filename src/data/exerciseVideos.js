import manifest from './exerciseVideoManifest.json'

// Same pattern as exercisePhotos.js: bundles every file under
// src/assets/exercise-videos/ at build time and resolves manifest file names
// to their built URLs. Populated by scripts/verify-wger-candidates.mjs (real,
// self-hosted CC-BY-SA clips via wger.de) — until that's been run for a
// given exercise, getExerciseVideo() returns null and callers fall back to
// the photo (if any) or the stick-figure diagram.
const videoModules = import.meta.glob('../assets/exercise-videos/*', {
  eager: true,
  import: 'default',
})

const videoUrlsByFile = Object.fromEntries(
  Object.entries(videoModules).map(([path, url]) => [path.split('/').pop(), url]),
)

export function getExerciseVideo(exerciseName) {
  const entry = manifest[exerciseName]
  if (!entry) return null
  const url = videoUrlsByFile[entry.file]
  if (!url) return null
  return { url, license: entry.license, licenseAuthor: entry.licenseAuthor, wgerName: entry.wgerName }
}
