#!/usr/bin/env node
// Fetches real exercise photos from wger.de (CC-BY-SA, per-image license +
// author metadata) for every exercise in our shared library, and writes:
//   - src/assets/exercise-photos/<slug>.jpg   (downloaded image, main photo only)
//   - src/data/exercisePhotoManifest.json     (name -> {file, license, licenseAuthor, sourceUrl, wgerName})
//   - wger-coverage-report.md                 (matched / unmatched summary)
//
// Run this from a machine with normal internet access — the sandbox this
// project was built in cannot reach wger.de (network policy blocks it).
//
//   node scripts/fetch-wger-photos.mjs
//
// Safe to re-run: skips exercises that already have a downloaded photo.

import { EXERCISES } from '../src/data/exerciseLibrary.js'
import { writeFile, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'

const API = 'https://wger.de/api/v2'
const OUT_IMG_DIR = path.resolve('src/assets/exercise-photos')
const OUT_MANIFEST = path.resolve('src/data/exercisePhotoManifest.json')
const OUT_REPORT = path.resolve('wger-coverage-report.md')

// Known naming differences between our library and wger's English exercise
// names. Add to this if the console output below shows a near-miss.
const ALIASES = {
  'Barbell Bench Press': ['Bench Press', 'Barbell Bench Press'],
  'Back Squat': ['Squats', 'Barbell Squat', 'Squat'],
  'Front Squat': ['Front Squats', 'Barbell Front Squat'],
  Deadlift: ['Barbell Deadlift', 'Deadlift'],
  'Romanian Deadlift': ['Romanian Deadlift', 'Stiff-Legged Deadlift'],
  'Overhead Press': ['Shoulder Press', 'Military Press', 'Standing Barbell Press'],
  'Barbell Row': ['Bent Over Barbell Row', 'Barbell Row'],
  'Barbell Curl': ['Barbell Curl', 'Standing Barbell Curl'],
  'Lat Pulldown': ['Wide-Grip Lat Pulldown', 'Lat Pulldown'],
  'Pull-Up': ['Pull-ups', 'Pullup', 'Wide-Grip Pull-up'],
  'Weighted Pull-Up': ['Weighted Pull-ups', 'Pull-ups'],
  Dips: ['Dips - Triceps Version', 'Chest Dip'],
  'Weighted Dip': ['Dips - Triceps Version'],
  'Leg Press': ['Leg Press', 'Machine Leg Press'],
  'Leg Extension': ['Leg Extensions', 'Leg Extension'],
  'Leg Curl': ['Lying Leg Curls', 'Leg Curl'],
  'Calf Raise': ['Standing Calf Raises', 'Calf Raise'],
  'Standing Calf Raise': ['Standing Calf Raises'],
  'Seated Calf Raise': ['Seated Calf Raise'],
  'Lateral Raise': ['Side Lateral Raise', 'Dumbbell Lateral Raise'],
  Shrugs: ['Barbell Shrug', 'Dumbbell Shrug'],
  'Tricep Pushdown': ['Triceps Pushdown', 'Cable Pushdown'],
  'Skull Crusher': ['Lying Triceps Press', 'Skull Crusher'],
  'Cable Fly': ['Cable Crossover', 'Cable Fly'],
  'Dumbbell Fly': ['Flat Bench Dumbbell Fly', 'Dumbbell Flyes'],
  'Kettlebell Swing': ['Kettlebell Swing', 'Two Handed Kettlebell Swing'],
  'Farmer Carry': ["Farmer's Walk", 'Farmers Walk'],
  'Medicine Ball Slam': ['Medicine Ball Slam', 'Med Ball Slam'],
  Burpees: ['Burpee'],
  'Push-Up Finisher': ['Push-up', 'Pushups'],
  'Push-Up Variations': ['Push-up'],
  'Plyo Push-Up': ['Clap Push-up', 'Plyometric Push-up'],
  'Box Jump': ['Box Jump'],
  'Jump Rope': ['Jump Rope'],
  Snatch: ['Snatch', 'Barbell Snatch'],
  'Power Clean': ['Power Clean'],
  'Clean & Jerk': ['Clean and Jerk'],
}

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[()]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

async function searchWger(term) {
  const url = `${API}/exercise/search/?term=${encodeURIComponent(term)}&language=en&format=json`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`search failed for "${term}": HTTP ${res.status}`)
  const data = await res.json()
  return data.suggestions ?? data.results ?? []
}

async function getExerciseInfo(baseId) {
  const url = `${API}/exerciseinfo/${baseId}/?format=json`
  const res = await fetch(url)
  if (!res.ok) return null
  return res.json()
}

async function downloadImage(url, destPath) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`image download failed: HTTP ${res.status}`)
  const buf = Buffer.from(await res.arrayBuffer())
  await writeFile(destPath, buf)
}

async function main() {
  await mkdir(OUT_IMG_DIR, { recursive: true })

  let manifest = {}
  if (existsSync(OUT_MANIFEST)) {
    manifest = JSON.parse(await import('node:fs').then((fs) => fs.readFileSync(OUT_MANIFEST, 'utf8')))
  }

  const names = Object.keys(EXERCISES)
  const matched = []
  const unmatched = []

  for (const name of names) {
    if (manifest[name]) {
      console.log(`[skip] ${name} — already have a photo`)
      matched.push({ name, wgerName: manifest[name].wgerName, cached: true })
      continue
    }

    const candidates = ALIASES[name] ?? [name]
    let found = null

    for (const term of candidates) {
      try {
        const results = await searchWger(term)
        if (results.length > 0) {
          found = { term, result: results[0] }
          break
        }
      } catch (err) {
        console.warn(`  search error for "${term}": ${err.message}`)
      }
      await new Promise((r) => setTimeout(r, 150))
    }

    if (!found) {
      console.log(`[MISS] ${name}`)
      unmatched.push(name)
      continue
    }

    const baseId = found.result.base_id ?? found.result.data?.base_id ?? found.result.id
    const wgerName = found.result.name ?? found.result.data?.name ?? found.term

    const info = await getExerciseInfo(baseId)
    const images = info?.images ?? []
    const mainImage = images.find((img) => img.is_main) ?? images[0]

    if (!mainImage) {
      console.log(`[MISS] ${name} — matched "${wgerName}" but it has no images`)
      unmatched.push(name)
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
      unmatched.push(name)
      continue
    }

    manifest[name] = {
      file: fileName,
      wgerName,
      license: mainImage.license_title ?? mainImage.license ?? 'CC-BY-SA 4.0',
      licenseAuthor: mainImage.license_author ?? 'wger.de contributors',
      sourceUrl: mainImage.image,
    }

    console.log(`[ok]   ${name} <- "${wgerName}" (${fileName})`)
    matched.push({ name, wgerName })

    await new Promise((r) => setTimeout(r, 200))
  }

  await writeFile(OUT_MANIFEST, JSON.stringify(manifest, null, 2))

  const report = [
    '# wger.de Photo Coverage Report',
    '',
    `Matched: ${matched.length} / ${names.length}`,
    `Unmatched: ${unmatched.length} / ${names.length}`,
    '',
    '## Unmatched exercises (no confident match found)',
    ...unmatched.map((n) => `- ${n}`),
    '',
    '## Matched exercises',
    ...matched.map((m) => `- ${m.name}${m.wgerName ? ` <- "${m.wgerName}"` : ''}${m.cached ? ' (cached)' : ''}`),
  ].join('\n')

  await writeFile(OUT_REPORT, report)

  console.log('\n--- DONE ---')
  console.log(`Matched ${matched.length}/${names.length}, unmatched ${unmatched.length}`)
  console.log(`Manifest: ${OUT_MANIFEST}`)
  console.log(`Report:   ${OUT_REPORT}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
