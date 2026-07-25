import manifest from './exercisePhotoManifest.json'

// Bundles every file under src/assets/exercise-photos/ at build time and
// resolves manifest file names to their built URLs. Populated by running
// scripts/fetch-wger-photos.mjs (real photos, CC-BY-SA via wger.de) — until
// that's been run for a given exercise, getExercisePhoto() returns null and
// callers fall back to the stick-figure diagram.
const photoModules = import.meta.glob('../assets/exercise-photos/*', {
  eager: true,
  import: 'default',
})

const photoUrlsByFile = Object.fromEntries(
  Object.entries(photoModules).map(([path, url]) => [path.split('/').pop(), url]),
)

export function getExercisePhoto(exerciseName) {
  const entry = manifest[exerciseName]
  if (!entry) return null
  const url = photoUrlsByFile[entry.file]
  if (!url) return null
  return { url, license: entry.license, licenseAuthor: entry.licenseAuthor, wgerName: entry.wgerName }
}
