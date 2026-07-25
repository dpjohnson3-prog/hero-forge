#!/usr/bin/env node
// Fetches real exercise photos from wger.de (CC-BY-SA, per-image license +
// author metadata) for every exercise in our shared library, and writes:
//   - src/assets/exercise-photos/<slug>.jpg   (downloaded image, main photo only)
//   - src/data/exercisePhotoManifest.json     (name -> {file, license, licenseAuthor, sourceUrl, wgerName})
//   - wger-coverage-report.md                 (matched / rejected / no-image / no-candidate breakdown)
//
// Run this from a machine with normal internet access — the sandbox this
// project was built in cannot reach wger.de (network policy blocks it).
//
//   node scripts/fetch-wger-photos.mjs
//
// Safe to re-run: skips exercises that already have a downloaded photo, so
// the 15 manually-verified matches already in the manifest are untouched.
//
// Endpoint verified directly against the wger-project/wger source on GitHub
// (wger/exercises/api/views.py, filtersets.py, serializers.py, wger/urls.py):
// search lives on GET /api/v2/exerciseinfo/?name__search=<term>&language__code=en
// (fuzzy trigram match on Postgres, falls back to name__exact/icontains).
//
// IMPORTANT LESSON FROM THE FIRST REAL RUN (48/140, reviewed by hand):
// wger's fuzzy search matches on shared *substrings*, not on the exercise
// actually being the same movement — "Barbell Row" matched "Barbell Ab
// Rollout" (shares "Barbell"), "Push Press"/"Leg Press"/"Pallof Press" all
// matched generic "Bench Press" (share only "Press"). 33 of the 48 matches
// from that run were wrong and had to be pulled by hand. isPlausibleMatch()
// below is a token-overlap gate meant to catch that whole class of false
// positive automatically. It's a blunt instrument, not a substitute for a
// human glancing at the coverage report before trusting new matches — it
// trades recall for precision on purpose (see its comment).

import { EXERCISES } from '../src/data/exerciseLibrary.js'
import { writeFile, mkdir } from 'node:fs/promises'
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'

const API = 'https://wger.de/api/v2'
const OUT_IMG_DIR = path.resolve('src/assets/exercise-photos')
const OUT_MANIFEST = path.resolve('src/data/exercisePhotoManifest.json')
const OUT_REPORT = path.resolve('wger-coverage-report.md')
const HEADERS = { 'User-Agent': 'HeroForge-photo-fetch/1.0 (one-time dataset build script)' }

// Words that carry no real evidence of exercise identity on their own —
// mostly equipment/modifier words that showed up in the false-positive
// matches from the first run (e.g. "Barbell" alone matched three unrelated
// exercises). A shared word from this list does NOT count toward passing
// isPlausibleMatch().
const STOPWORDS = new Set([
  'barbell', 'dumbbell', 'cable', 'machine', 'kettlebell', 'weighted',
  'standing', 'seated', 'lying', 'wide', 'close', 'single', 'two', 'banded',
  'resistance', 'band', 'handed', 'bodyweight', 'assisted', 'the', 'and',
  'with', 'for', 'grip',
])

// Known naming differences between our library and wger's English exercise
// names, confirmed by hand against the actual wger entries where noted.
const ALIASES = {
  'Barbell Bench Press': ['Bench Press', 'Barbell Bench Press'],
  'Back Squat': ['Squats', 'Barbell Squat', 'Squat'],
  Deadlift: ['Deadlifts', 'Barbell Deadlift', 'Deadlift'], // confirmed good match
  'Overhead Press': ['Shoulder Press', 'Military Press', 'Standing Barbell Press'],
  'Lat Pulldown': ['Close-grip Lat Pull Down', 'Wide-Grip Lat Pulldown'], // confirmed good match
  'Pull-Up': ['Pull-ups', 'Pullup'],
  'Weighted Pull-Up': ['Pull-ups', 'Weighted Pull-ups'], // confirmed good match
  'Leg Extension': ['Leg Extensions'],
  'Leg Curl': ['Leg Curl', 'Lying Leg Curls'], // confirmed good match
  'Seated Calf Raise': ['Seated Calf Raise'],
  Burpees: ['Burpee'],
  'Push-Up Finisher': ['Push-up', 'Pushups'],
  'Push-Up Variations': ['Push-up'],
  'Jump Rope': ['Jump Rope'],
  Snatch: ['Snatch', 'Barbell Snatch'],
  'Power Clean': ['Power Clean'],
  'Clean & Jerk': ['Clean and Jerk'],
  'Single-Arm Cable Row': ['Lateral Rows on Cable, One Armed'], // confirmed good match
  'Ring Dips': ['Dips'], // confirmed good match (apparatus differs, movement is the same)
  'Handstand Push-Up': ['Handstand Pushup'], // confirmed good match
  'Handstand Hold': ['Handstand Pushup'], // confirmed good match
  'Plank Complex': ['Plank'], // confirmed good match
  'Plank Variations': ['Plank'], // confirmed good match
  'Weighted Plank Hold': ['Plank'], // confirmed good match
  'Hollow Body Hold': ['Hollow Hold'], // confirmed good match
  'Walking Lunge': ['Dumbbell Lunges Walking'], // confirmed good match
  'Cable Fly': ['Cable Cross-over', 'Cable Crossover'], // confirmed good match (industry-standard synonym)
}

function tokenize(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, ' ').split(' ').filter(Boolean)
}

function singularize(word) {
  if (word.length > 3 && word.endsWith('s') && !word.endsWith('ss')) return word.slice(0, -1)
  return word
}

function coreTokenSet(name) {
  return new Set(
    tokenize(name)
      .filter((t) => !STOPWORDS.has(t) && t.length > 2)
      .map(singularize),
  )
}

// Requires every "core" (non-generic) word in our exercise name to show up
// in the candidate's name too. Deliberately strict: a shared equipment word
// like "Barbell" or a shared generic suffix like "Press"/"Hold" is NOT
// enough on its own — that's exactly what produced the false positives in
// the first run. This will also reject some legitimate synonyms that don't
// share vocabulary (e.g. "fly" vs "cross-over") — those need to go through
// the ALIASES table above instead, with the match verified by a human once.
function isPlausibleMatch(ourName, candidateName) {
  const ours = coreTokenSet(ourName)
  if (ours.size === 0) return true
  const theirs = [...coreTokenSet(candidateName)]
  for (const tok of ours) {
    const found = theirs.some((t) => t === tok || t.includes(tok) || tok.includes(t))
    if (!found) return false
  }
  return true
}

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[()]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

async function getJson(url) {
  const res = await fetch(url, { headers: HEADERS })
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`)
  return res.json()
}

async function getEnglishLanguageId() {
  const data = await getJson(`${API}/language/?format=json&limit=100`)
  const en = (data.results ?? []).find((l) => l.short_name === 'en')
  if (!en) throw new Error('Could not find English in /api/v2/language/ — check the response shape manually.')
  return en.id
}

async function searchWger(term) {
  const url = `${API}/exerciseinfo/?name__search=${encodeURIComponent(term)}&language__code=en&limit=5&format=json`
  const data = await getJson(url)
  if ((data.results ?? []).length > 0) return data.results

  // Fall back to the non-fuzzy (icontains) filter — matters on non-Postgres
  // wger deployments where name__search silently degrades to exact match.
  const exactUrl = `${API}/exerciseinfo/?name__exact=${encodeURIComponent(term)}&language__code=en&limit=5&format=json`
  const exactData = await getJson(exactUrl)
  return exactData.results ?? []
}

function pickEnglishTranslation(exerciseInfo, englishId) {
  const translations = exerciseInfo.translations ?? []
  return translations.find((t) => t.language === englishId) ?? translations[0] ?? null
}

async function downloadImage(url, destPath) {
  const res = await fetch(url, { headers: HEADERS })
  if (!res.ok) throw new Error(`image download failed: HTTP ${res.status}`)
  const buf = Buffer.from(await res.arrayBuffer())
  await writeFile(destPath, buf)
}

async function main() {
  await mkdir(OUT_IMG_DIR, { recursive: true })

  console.log('Resolving English language id from /api/v2/language/ ...')
  const englishId = await getEnglishLanguageId()
  console.log(`English language id = ${englishId}\n`)

  let manifest = {}
  if (existsSync(OUT_MANIFEST)) {
    manifest = JSON.parse(readFileSync(OUT_MANIFEST, 'utf8'))
  }

  const names = Object.keys(EXERCISES)
  const matched = []
  // reason -> [{name, detail}]
  const misses = { no_candidates: [], rejected_match: [], no_image: [], download_failed: [] }

  for (const name of names) {
    if (manifest[name]) {
      console.log(`[skip] ${name} — already have a photo`)
      matched.push({ name, wgerName: manifest[name].wgerName, cached: true })
      continue
    }

    const candidates = ALIASES[name] ?? [name]
    let exerciseInfo = null
    let matchedTerm = null
    let sawAnyCandidates = false
    let allRejected = false

    for (const term of candidates) {
      try {
        const results = await searchWger(term)
        if (results.length > 0) sawAnyCandidates = true
        const plausible = results.find((r) => {
          const translation = pickEnglishTranslation(r, englishId)
          return translation && isPlausibleMatch(name, translation.name)
        })
        if (plausible) {
          exerciseInfo = plausible
          matchedTerm = term
          break
        } else if (results.length > 0) {
          allRejected = true
        }
      } catch (err) {
        console.warn(`  search error for "${term}": ${err.message}`)
      }
      await new Promise((r) => setTimeout(r, 150))
    }

    if (!exerciseInfo) {
      if (allRejected) {
        console.log(`[MISS] ${name} — found candidates but none passed the plausibility check`)
        misses.rejected_match.push(name)
      } else if (sawAnyCandidates) {
        // shouldn't normally happen (allRejected would be set), but keep a bucket just in case
        misses.rejected_match.push(name)
      } else {
        console.log(`[MISS] ${name} — no candidates found`)
        misses.no_candidates.push(name)
      }
      continue
    }

    const translation = pickEnglishTranslation(exerciseInfo, englishId)
    const wgerName = translation?.name ?? matchedTerm

    const images = exerciseInfo.images ?? []
    const mainImage = images.find((img) => img.is_main) ?? images[0]

    if (!mainImage) {
      console.log(`[MISS] ${name} — matched "${wgerName}" but it has no images`)
      misses.no_image.push(`${name} <- "${wgerName}"`)
      continue
    }

    const slug = slugify(name)
    const ext = path.extname(new URL(mainImage.image).pathname) || '.jpg'
    const fileName = `${slug}${ext}`
    const destPath = path.join(OUT_IMG_DIR, fileName)

    try {
      await downloadImage(mainImage.image, destPath)
    } catch (err) {
      console.log(`[MISS] ${name} — matched "${wgerName}" but download failed: ${err.message}`)
      misses.download_failed.push(`${name} <- "${wgerName}"`)
      continue
    }

    manifest[name] = {
      file: fileName,
      wgerName,
      license: mainImage.license_title || 'CC-BY-SA 4.0',
      licenseAuthor: mainImage.license_author || 'wger.de contributors',
      sourceUrl: mainImage.image,
    }

    console.log(`[ok]   ${name} <- "${wgerName}" (${fileName}) — REVIEW BEFORE TRUSTING`)
    matched.push({ name, wgerName })

    await new Promise((r) => setTimeout(r, 200))
  }

  await writeFile(OUT_MANIFEST, JSON.stringify(manifest, null, 2))

  const totalMisses = Object.values(misses).reduce((n, arr) => n + arr.length, 0)
  const report = [
    '# wger.de Photo Coverage Report',
    '',
    `Matched: ${matched.length} / ${names.length}`,
    `Missed:  ${totalMisses} / ${names.length}`,
    '',
    '**New matches (not already cached in the manifest) still need a human sanity check** —',
    'the isPlausibleMatch() gate blocks the obvious false positives seen in the first run',
    '(shared generic words only) but is not a guarantee of correctness. Compare each new',
    '"X <- Y" line below against the form cue in exerciseLibrary.js before trusting it.',
    '',
    `## No candidates found at all (${misses.no_candidates.length})`,
    ...misses.no_candidates.map((n) => `- ${n}`),
    '',
    `## Candidates found, but rejected by the plausibility check (${misses.rejected_match.length})`,
    ...misses.rejected_match.map((n) => `- ${n}`),
    '',
    `## Matched a plausible exercise, but it has no photo uploaded (${misses.no_image.length})`,
    ...misses.no_image.map((n) => `- ${n}`),
    '',
    `## Matched and had a photo, but the download failed (${misses.download_failed.length})`,
    ...misses.download_failed.map((n) => `- ${n}`),
    '',
    '## Matched exercises',
    ...matched.map((m) => `- ${m.name}${m.wgerName ? ` <- "${m.wgerName}"` : ''}${m.cached ? ' (already verified, cached)' : ' (NEW — please review)'}`),
  ].join('\n')

  await writeFile(OUT_REPORT, report)

  console.log('\n--- DONE ---')
  console.log(`Matched ${matched.length}/${names.length}, missed ${totalMisses}`)
  console.log(`  no candidates:     ${misses.no_candidates.length}`)
  console.log(`  rejected match:    ${misses.rejected_match.length}`)
  console.log(`  no image:          ${misses.no_image.length}`)
  console.log(`  download failed:   ${misses.download_failed.length}`)
  console.log(`Manifest: ${OUT_MANIFEST}`)
  console.log(`Report:   ${OUT_REPORT}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
