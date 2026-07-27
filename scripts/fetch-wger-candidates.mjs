#!/usr/bin/env node
// STEP 1 of the round-3 photo/video pipeline. Broadens the search for the
// exercises still missing a photo, and stages CANDIDATE media for AI
// verification (scripts/verify-wger-candidates.mjs) instead of
// accepting/rejecting it itself.
//
// Why the old hard gate is gone: round 2 showed two false positives
// (Cable Pullover <- Cable Cross-over, Close-Grip Bench Press <- Bench
// Press) that a text-only heuristic can't safely fix — the same substring
// mechanism that makes "pulldown" contain "down" (needed for the *correct*
// Lat Pulldown match) is what let "pullover" contain "over". There's no
// string rule that tells those two apart; it takes actually looking at the
// image. So this script now casts a wide net (multiple query variants per
// exercise, top-3 raw results per query, no hard rejection) and leaves
// correctness entirely to the AI vision check in step 2.
//
// Also stages wger's self-hosted exercise VIDEOS where available — the same
// exerciseinfo response already includes a `videos` array (same CC-BY-SA
// license/author fields as images), so this is free extra candidate data,
// not an extra source to vet. These were added after a separate attempt to
// use a hand-supplied list of YouTube links turned out to be mostly
// non-existent/fabricated video IDs — wger's self-hosted clips carry the
// same verified license as the photos, unlike an arbitrary YouTube URL.
//
// Run from a machine with normal internet access (wger.de is blocked from
// the sandbox this project is built in):
//   node scripts/fetch-wger-candidates.mjs
//
// Output:
//   scripts/.wger-candidates/<slug>__<type><n>.<ext>   staged candidate images/videos
//   wger-candidates.json                                candidate metadata, consumed by verify-wger-candidates.mjs
//
// Safe to re-run: skips exercises that already have a manifest entry, and
// skips exercises that already have staged candidates from a previous run.

import { EXERCISES } from '../src/data/exerciseLibrary.js'
import { writeFile, mkdir } from 'node:fs/promises'
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'

const API = 'https://wger.de/api/v2'
const STAGING_DIR = path.resolve('scripts/.wger-candidates')
const OUT_MANIFEST = path.resolve('src/data/exercisePhotoManifest.json')
const OUT_CANDIDATES = path.resolve('wger-candidates.json')
const HEADERS = { 'User-Agent': 'HeroForge-photo-fetch/1.0 (one-time dataset build script)' }
const MAX_CANDIDATES_PER_EXERCISE = 2

// Words stripped when generating a "bare" search variant, so e.g.
// "Standing Calf Raise" also tries plain "Calf Raise" (which might hit a
// different wger entry than whatever "Standing Calf Raise" itself matches).
const STRIP_WORDS = new Set([
  'barbell', 'dumbbell', 'cable', 'machine', 'kettlebell', 'weighted',
  'standing', 'seated', 'lying', 'wide', 'close', 'single', 'two', 'banded',
  'resistance', 'band', 'handed', 'bodyweight', 'assisted', 'grip', 'arm',
  'leg', 'heavy',
])

function bareVariant(name) {
  const words = name.replace(/[()]/g, '').split(/[\s-]+/)
  const kept = words.filter((w) => !STRIP_WORDS.has(w.toLowerCase()))
  return kept.length > 0 ? kept.join(' ') : name
}

// Hand-picked alternate search terms for exercises that stayed unmatched in
// round 2 — either to find a candidate at all, or to land on a *different*
// wger entry than the one that turned out to have no photo (wger has
// several near-duplicate entries for many common lifts).
const SYNONYMS = {
  'Back Squat': ['Squats', 'Barbell Squat'],
  'Zercher Deadlift': ['Deadlift'],
  'Squat Jump': ['Jump Squat'],
  'Trap Bar Jump': ['Trap Bar Deadlift'],
  'Romanian Deadlift': ['Stiff-Legged Deadlift', 'RDL'],
  'Trap Bar Deadlift': ['Hex Bar Deadlift'],
  'Single-Leg RDL': ['Single Leg Deadlift', 'Single Leg RDL'],
  'Jump Lunge': ['Jumping Lunge', 'Split Jump'],
  'Weighted Step-Up': ['Step Up', 'Box Step Up'],
  'Close-Grip Bench Press': ['Close Grip Barbell Bench Press'],
  'Incline Dumbbell Press': ['Incline Dumbbell Bench Press'],
  'Incline Press': ['Incline Barbell Bench Press'],
  'Dumbbell Fly': ['Dumbbell Flyes'],
  'Arnold Press': ['Arnold Shoulder Press'],
  'Landmine Press': ['Landmine Shoulder Press'],
  'Landmine Rotations': ['Landmine Rotation', 'Landmine Twist'],
  'Barbell Row': ['Bent Over Row', 'Pendlay Row'],
  'Straight-Arm Lat Pulldown': ['Straight Arm Pulldown'],
  'Face Pull': ['Cable Face Pull'],
  'Cable Pullover': ['Pullover', 'Straight Arm Pulldown'],
  'Pull-Up': ['Chin Up', 'Pullup'],
  'Archer Pull-Up': ['Archer Pull Up'],
  'Muscle-Up': ['Muscle Up'],
  'Front Lever Progression': ['Front Lever'],
  'Weighted Dead Hang': ['Dead Hang', 'Deadhang'],
  'L-Sit Hold': ['L-Sit'],
  'Hanging Leg Raise': ['Leg Raise'],
  'Hanging Windshield Wiper': ['Windshield Wiper'],
  'Push-Up Finisher': ['Push Up', 'Pushup'],
  'Push-Up Variations': ['Push Up'],
  'Plyo Push-Up': ['Plyometric Push Up', 'Clapping Push Up'],
  'Weighted Plank Complex': ['Weighted Plank'],
  'Dragon Flag': ['Dragon Flag'],
  'Prone Stability Holds': ['Plank'],
  'Weighted Sit-Up': ['Sit Up', 'Situp'],
  'Flutter Kicks': ['Flutter Kick'],
  'Anti-Rotation Press': ['Pallof Press'],
  'Pallof Press': ['Standing Pallof Press'],
  'Cable Rotation': ['Cable Woodchop', 'Cable Rotation'],
  'Stability Ball Circuit': ['Swiss Ball', 'Stability Ball'],
  'Barbell Curl': ['Standing Barbell Curl'],
  'Skull Crusher': ['Skullcrusher', 'Lying Triceps Extension'],
  'Lateral Raise': ['Side Lateral Raise', 'Dumbbell Lateral Raise'],
  Shrugs: ['Barbell Shrug', 'Dumbbell Shrug'],
  'Leg Press': ['Horizontal Leg Press'],
  'Leg Extension': ['Leg Extensions'],
  'Calf Raise': ['Standing Calf Raise'],
  'Standing Calf Raise': ['Donkey Calf Raise'],
  'Seated Calf Raise': ['Seated Calf Raise'],
  'Farmer Carry': ["Farmers Walk", "Farmer's Walk"],
  'Weighted Carry': ['Loaded Carry', 'Suitcase Carry'],
  'Single-Arm Carry': ['Suitcase Carry'],
  'Heavy Trap Bar Carry': ['Trap Bar Carry'],
  'Sled Drag': ['Sled Pull'],
  'Sled Push': ['Prowler Push'],
  'Kettlebell Swing': ['Russian Kettlebell Swing'],
  'Kettlebell Complex': ['Kettlebell Clean'],
  'Medicine Ball Slam': ['Med Ball Slam'],
  'Medicine Ball Throw': ['Wall Ball', 'Med Ball Throw'],
  'Rotational Throws': ['Rotational Throw', 'Med Ball Rotational Throw'],
  'Box Jump': ['Box Jumps'],
  'Broad Jump': ['Standing Long Jump'],
  'Lateral Bounds': ['Lateral Bound', 'Skater Jump'],
  'Shadow Boxing': ['Shadowboxing'],
  'Speed Bag': ['Speed Bag Punching'],
  'Rope Climb': ['Climbing Rope'],
  'Battle Ropes': ['Battling Ropes', 'Rope Waves'],
  'TRX Suspension Circuit': ['TRX Row', 'Suspension Trainer'],
  'TRX Suspension Hold': ['TRX Plank'],
  'Web-Swing Simulation (TRX)': ['TRX Row'],
  'Tire Flip': ['Tyre Flip'],
  'Sledgehammer Slams': ['Sledgehammer', 'Hammer Slam'],
  'Power Clean': ['Clean'],
  'Clean & Jerk': ['Clean and Jerk'],
  Snatch: ['Barbell Snatch'],
  'Rowing Machine': ['Rowing', 'Rower'],
  'Rowing Sprints': ['Rowing'],
  'Assault Bike Sprints': ['Assault Bike', 'Air Bike'],
  'Stair Climber Sprints': ['Stair Climber', 'Stairmaster'],
  'Incline Treadmill Walk': ['Treadmill'],
  'Treadmill Sprint Finisher': ['Treadmill Sprint'],
  'Treadmill Sprint Intervals': ['Treadmill Sprint'],
  'Treadmill Tempo Run': ['Treadmill Run'],
  'Weighted Vest Treadmill March': ['Treadmill', 'Weighted Vest'],
  'Jump Rope': ['Skipping Rope', 'Jumping Rope'],
  'Bear Crawl': ['Bear Crawl'],
  Sprawls: ['Sprawl', 'Burpee'],
  'Animal Flow': ['Bear Crawl'],
  Burpees: ['Burpee'],
  'Agility Ladder': ['Ladder Drill'],
  'Cone Agility Drills': ['Cone Drill'],
  'Reaction Ball Drills': ['Reaction Ball'],
  'Balance Board Hold': ['Balance Board'],
  'Balance Drills': ['Single Leg Balance'],
  'Grip Crush Work': ['Hand Gripper', 'Grip Trainer'],
  'Plate Pinch Hold': ['Plate Pinch'],
  'Cable Draw Hold': ['Isometric Row', 'Cable Row Hold'],
}

function tokenize(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, ' ').split(' ').filter(Boolean)
}

function singularize(word) {
  if (word.length > 3 && word.endsWith('s') && !word.endsWith('ss')) return word.slice(0, -1)
  return word
}

// Same STOPWORDS list as fetch-wger-photos.mjs, used only as an informational
// "plausible" flag now, not a hard filter.
const STOPWORDS = new Set([
  'barbell', 'dumbbell', 'cable', 'machine', 'kettlebell', 'weighted',
  'standing', 'seated', 'lying', 'wide', 'close', 'single', 'two', 'banded',
  'resistance', 'band', 'handed', 'bodyweight', 'assisted', 'the', 'and',
  'with', 'for', 'grip',
])

function coreTokenSet(name) {
  return new Set(
    tokenize(name).filter((t) => !STOPWORDS.has(t) && t.length > 2).map(singularize),
  )
}

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
  return name.toLowerCase().replace(/[()]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

async function getJson(url) {
  const res = await fetch(url, { headers: HEADERS })
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`)
  return res.json()
}

async function getEnglishLanguageId() {
  const data = await getJson(`${API}/language/?format=json&limit=100`)
  const en = (data.results ?? []).find((l) => l.short_name === 'en')
  if (!en) throw new Error('Could not find English in /api/v2/language/.')
  return en.id
}

async function searchWger(term) {
  const url = `${API}/exerciseinfo/?name__search=${encodeURIComponent(term)}&language__code=en&limit=3&format=json`
  const data = await getJson(url)
  if ((data.results ?? []).length > 0) return data.results
  const exactUrl = `${API}/exerciseinfo/?name__exact=${encodeURIComponent(term)}&language__code=en&limit=3&format=json`
  const exactData = await getJson(exactUrl)
  return exactData.results ?? []
}

function pickEnglishTranslation(exerciseInfo, englishId) {
  const translations = exerciseInfo.translations ?? []
  return translations.find((t) => t.language === englishId) ?? translations[0] ?? null
}

const MAX_VIDEO_BYTES = 15 * 1024 * 1024

async function downloadFile(url, destPath, maxBytes) {
  const res = await fetch(url, { headers: HEADERS })
  if (!res.ok) throw new Error(`download failed: HTTP ${res.status}`)
  const buf = Buffer.from(await res.arrayBuffer())
  if (maxBytes && buf.length > maxBytes) {
    throw new Error(`file too large (${(buf.length / 1024 / 1024).toFixed(1)}MB)`)
  }
  await writeFile(destPath, buf)
}

async function main() {
  await mkdir(STAGING_DIR, { recursive: true })

  console.log('Resolving English language id...')
  const englishId = await getEnglishLanguageId()

  const manifest = existsSync(OUT_MANIFEST) ? JSON.parse(readFileSync(OUT_MANIFEST, 'utf8')) : {}
  const existingCandidates = existsSync(OUT_CANDIDATES) ? JSON.parse(readFileSync(OUT_CANDIDATES, 'utf8')) : {}

  const unmatched = Object.keys(EXERCISES).filter((n) => !manifest[n])
  console.log(`${unmatched.length} exercises still without a photo\n`)

  const candidates = { ...existingCandidates }
  let exercisesWithCandidates = 0
  let totalImages = 0
  let totalVideos = 0

  for (const name of unmatched) {
    if (candidates[name]?.length > 0) {
      console.log(`[skip] ${name} — already has ${candidates[name].length} staged candidate(s)`)
      exercisesWithCandidates++
      totalImages += candidates[name].filter((c) => c.type !== 'video').length
      totalVideos += candidates[name].filter((c) => c.type === 'video').length
      continue
    }

    const terms = [name, ...(SYNONYMS[name] ?? []), bareVariant(name)].filter(
      (t, i, arr) => arr.indexOf(t) === i,
    )

    const seenImageIds = new Set()
    const seenVideoIds = new Set()
    const foundImages = []
    const foundVideos = []

    for (const term of terms) {
      try {
        const results = await searchWger(term)
        for (const r of results) {
          const translation = pickEnglishTranslation(r, englishId)
          const wgerName = translation?.name ?? term
          const plausible = translation ? isPlausibleMatch(name, translation.name) : false

          if (!seenImageIds.has(r.id)) {
            const images = r.images ?? []
            const mainImage = images.find((img) => img.is_main) ?? images[0]
            if (mainImage) {
              seenImageIds.add(r.id)
              foundImages.push({ type: 'image', wgerName, plausible, media: mainImage })
            }
          }

          // wger also hosts short self-hosted video clips (same CC-BY-SA
          // license/author fields as images) for a subset of exercises —
          // free to check since it's the same exerciseinfo response we
          // already fetched for images, no extra API calls.
          if (!seenVideoIds.has(r.id)) {
            const videos = r.videos ?? []
            const mainVideo = videos.find((v) => v.is_main) ?? videos[0]
            if (mainVideo) {
              seenVideoIds.add(r.id)
              foundVideos.push({ type: 'video', wgerName, plausible, media: mainVideo })
            }
          }
        }
      } catch (err) {
        console.warn(`  search error for "${term}": ${err.message}`)
      }
      await new Promise((r) => setTimeout(r, 150))
      if (foundImages.length >= MAX_CANDIDATES_PER_EXERCISE * 2 && foundVideos.length >= 1) break
    }

    foundImages.sort((a, b) => Number(b.plausible) - Number(a.plausible))
    foundVideos.sort((a, b) => Number(b.plausible) - Number(a.plausible))
    const chosen = [...foundVideos.slice(0, 1), ...foundImages.slice(0, MAX_CANDIDATES_PER_EXERCISE)]

    if (chosen.length === 0) {
      console.log(`[none] ${name}`)
      continue
    }

    const staged = []
    for (let i = 0; i < chosen.length; i++) {
      const c = chosen[i]
      const mediaUrl = c.type === 'video' ? c.media.video : c.media.image
      const slug = slugify(name)
      const ext = path.extname(new URL(mediaUrl).pathname) || (c.type === 'video' ? '.mp4' : '.jpg')
      const fileName = `${slug}__${c.type}${i}${ext}`
      const destPath = path.join(STAGING_DIR, fileName)
      try {
        await downloadFile(mediaUrl, destPath, c.type === 'video' ? MAX_VIDEO_BYTES : undefined)
      } catch (err) {
        console.warn(`  download failed for ${name} ${c.type} candidate ${i}: ${err.message}`)
        continue
      }
      staged.push({
        type: c.type,
        file: fileName,
        wgerName: c.wgerName,
        plausible: c.plausible,
        license: c.media.license_title || 'CC-BY-SA 4.0',
        licenseAuthor: c.media.license_author || 'wger.de contributors',
        sourceUrl: mediaUrl,
      })
      await new Promise((r) => setTimeout(r, 150))
    }

    if (staged.length > 0) {
      candidates[name] = staged
      exercisesWithCandidates++
      totalImages += staged.filter((s) => s.type === 'image').length
      totalVideos += staged.filter((s) => s.type === 'video').length
      console.log(`[ok] ${name} — ${staged.map((s) => `${s.type}:${s.wgerName}`).join(', ')}`)
    }
  }

  await writeFile(OUT_CANDIDATES, JSON.stringify(candidates, null, 2))

  console.log('\n--- DONE ---')
  console.log(`Exercises with at least one candidate: ${exercisesWithCandidates} / ${unmatched.length}`)
  console.log(`Total candidate images staged: ${totalImages}`)
  console.log(`Total candidate videos staged: ${totalVideos}`)
  console.log(`Candidates file: ${OUT_CANDIDATES}`)
  console.log(`Staged files:    ${STAGING_DIR}`)
  console.log('\nNext: node scripts/verify-wger-candidates.mjs (needs ANTHROPIC_API_KEY; video verification also needs ffmpeg installed)')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
