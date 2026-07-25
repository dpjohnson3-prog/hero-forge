#!/usr/bin/env node
// STEP 2 of the round-3 photo pipeline. Reads the candidates staged by
// fetch-wger-candidates.mjs and asks Claude's vision model to confirm each
// one actually shows the exercise it's supposed to — the same judgment call
// done by hand in rounds 1-2 (open the image, compare it to the form cue),
// now scripted so it can run against everything at once instead of a
// one-by-one manual review.
//
// Mirrors the model/request pattern already used in
// supabase/functions/estimate-food and estimate-body-metrics (model
// claude-opus-4-8, thinking: adaptive, forced tool_choice for structured
// output) — this script just calls the Messages API directly instead of
// going through a Supabase Edge Function, since it's a one-time local batch
// job, not a live user-facing feature.
//
// Requires ANTHROPIC_API_KEY in the environment. This is the SAME key value
// already set as a Supabase secret for the food/body-scan features, but that
// secret lives server-side in the Edge Function's environment — it is not
// automatically available here. Export it locally before running:
//   export ANTHROPIC_API_KEY=sk-ant-...
//   node scripts/verify-wger-candidates.mjs
//
// This makes one real (billed) API call per staged candidate image. With the
// default cap of 2 candidates per exercise from step 1, that's at most
// ~2x the number of still-unmatched exercises — check the console output
// from fetch-wger-candidates.mjs for the actual count before running this.
//
// Output:
//   src/assets/exercise-photos/<slug>.<ext>   photos that passed, copied in
//   src/data/exercisePhotoManifest.json        updated with new entries
//   wger-verification-results.json             full audit trail (every candidate, pass or fail, with the model's stated reason)
//
// Safe to re-run: skips exercises that already have a manifest entry.

import { EXERCISES } from '../src/data/exerciseLibrary.js'
import { readFile, writeFile, copyFile, mkdir } from 'node:fs/promises'
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'

const STAGING_DIR = path.resolve('scripts/.wger-candidates')
const OUT_IMG_DIR = path.resolve('src/assets/exercise-photos')
const OUT_MANIFEST = path.resolve('src/data/exercisePhotoManifest.json')
const IN_CANDIDATES = path.resolve('wger-candidates.json')
const OUT_RESULTS = path.resolve('wger-verification-results.json')
const MAX_IMAGE_BYTES = 4 * 1024 * 1024

const API_KEY = process.env.ANTHROPIC_API_KEY
if (!API_KEY) {
  console.error('ANTHROPIC_API_KEY is not set in the environment.')
  console.error('Export the same key used for the food/body-scan Supabase secret, e.g.:')
  console.error('  export ANTHROPIC_API_KEY=sk-ant-...')
  process.exit(1)
}

if (!existsSync(IN_CANDIDATES)) {
  console.error(`${IN_CANDIDATES} not found — run scripts/fetch-wger-candidates.mjs first.`)
  process.exit(1)
}

const MEDIA_TYPES = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp' }

function slugify(name) {
  return name.toLowerCase().replace(/[()]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

async function verifyImage(name, cue, imagePath) {
  const ext = path.extname(imagePath).toLowerCase()
  const mediaType = MEDIA_TYPES[ext]
  if (!mediaType) return { matches: false, reason: `Unsupported image format: ${ext}` }

  const buf = await readFile(imagePath)
  if (buf.length > MAX_IMAGE_BYTES) {
    return { matches: false, reason: `Image too large to verify (${(buf.length / 1024 / 1024).toFixed(1)}MB)` }
  }
  const base64 = buf.toString('base64')

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-opus-4-8',
      max_tokens: 1024,
      thinking: { type: 'adaptive' },
      tools: [
        {
          name: 'record_verification',
          description: 'Record whether the photo clearly shows the specified exercise being performed.',
          input_schema: {
            type: 'object',
            properties: {
              matches: {
                type: 'boolean',
                description: 'True only if the photo clearly shows a person performing this specific exercise. False if it shows a different exercise (even a similar-sounding or related one), an unrelated image, or is too ambiguous/generic to confirm.',
              },
              reason: { type: 'string', description: 'One sentence explaining the verdict.' },
            },
            required: ['matches', 'reason'],
            additionalProperties: false,
          },
          strict: true,
        },
      ],
      tool_choice: { type: 'tool', name: 'record_verification' },
      messages: [
        {
          role: 'user',
          content: [
            { type: 'image', source: { type: 'base64', media_type: mediaType, data: base64 } },
            {
              type: 'text',
              text: [
                `This photo is a candidate illustration for the exercise "${name}".`,
                `How it's supposed to be performed: ${cue}`,
                '',
                'Does this photo clearly show a person performing THIS SPECIFIC exercise? Be strict:',
                '- A different exercise that shares equipment or part of the name does NOT count (e.g. a calf-press variant shown for a standard leg press, or a reverse/opposite-direction variant of a similarly-named movement).',
                '- An image that is not an exercise photo at all (a logo, an icon, an unrelated picture) does NOT count.',
                '- If the pose/position contradicts the description above (e.g. leaning the wrong direction, wrong grip width, wrong equipment), it does NOT count.',
                '- If you are not confident it is a match, say it does not match.',
              ].join('\n'),
            },
          ],
        },
      ],
    }),
  })

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`Anthropic API HTTP ${res.status}: ${body.slice(0, 300)}`)
  }

  const data = await res.json()
  const toolUse = data.content?.find((b) => b.type === 'tool_use')
  if (!toolUse) throw new Error('Model did not return a structured verification')
  return toolUse.input
}

async function main() {
  await mkdir(OUT_IMG_DIR, { recursive: true })

  const candidates = JSON.parse(readFileSync(IN_CANDIDATES, 'utf8'))
  let manifest = existsSync(OUT_MANIFEST) ? JSON.parse(readFileSync(OUT_MANIFEST, 'utf8')) : {}

  const results = existsSync(OUT_RESULTS) ? JSON.parse(readFileSync(OUT_RESULTS, 'utf8')) : {}

  let passed = 0
  let failed = 0
  let skipped = 0

  const names = Object.keys(candidates)
  for (const name of names) {
    if (manifest[name]) {
      console.log(`[skip] ${name} — already has a confirmed photo`)
      skipped++
      continue
    }

    const info = EXERCISES[name]
    if (!info) {
      console.warn(`[warn] ${name} not found in exerciseLibrary.js, skipping`)
      continue
    }

    const exerciseResults = []
    let chosenIndex = -1

    for (let i = 0; i < candidates[name].length; i++) {
      const c = candidates[name][i]
      const imagePath = path.join(STAGING_DIR, c.file)
      if (!existsSync(imagePath)) {
        console.warn(`  [missing] ${c.file} not found on disk, skipping candidate`)
        continue
      }

      let verdict
      try {
        verdict = await verifyImage(name, info.cue, imagePath)
      } catch (err) {
        console.warn(`  [error] ${name} candidate ${i} (${c.wgerName}): ${err.message}`)
        exerciseResults.push({ candidate: c.wgerName, verdict: 'error', reason: err.message })
        continue
      }

      exerciseResults.push({
        candidate: c.wgerName,
        verdict: verdict.matches ? 'pass' : 'fail',
        reason: verdict.reason,
      })

      if (verdict.matches) {
        console.log(`[PASS] ${name} <- "${c.wgerName}" — ${verdict.reason}`)
        chosenIndex = i
        passed++
        break
      } else {
        console.log(`[fail] ${name} <- "${c.wgerName}" — ${verdict.reason}`)
        failed++
      }

      await new Promise((r) => setTimeout(r, 300))
    }

    if (chosenIndex >= 0) {
      const c = candidates[name][chosenIndex]
      const ext = path.extname(c.file)
      const fileName = `${slugify(name)}${ext}`
      await copyFile(path.join(STAGING_DIR, c.file), path.join(OUT_IMG_DIR, fileName))
      manifest[name] = {
        file: fileName,
        wgerName: c.wgerName,
        license: c.license,
        licenseAuthor: c.licenseAuthor,
        sourceUrl: c.sourceUrl,
        aiVerifiedReason: exerciseResults[exerciseResults.length - 1].reason,
      }
    }

    results[name] = exerciseResults
    await writeFile(OUT_MANIFEST, JSON.stringify(manifest, null, 2))
    await writeFile(OUT_RESULTS, JSON.stringify(results, null, 2))
  }

  console.log('\n--- DONE ---')
  console.log(`Passed: ${passed}, Failed: ${failed}, Skipped (already had a photo): ${skipped}`)
  console.log(`Manifest: ${OUT_MANIFEST}`)
  console.log(`Full audit trail: ${OUT_RESULTS}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
