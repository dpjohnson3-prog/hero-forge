# wger.de Photo Coverage Report

Status as of the second hand review (2026-07-25): **23 / 140 confirmed.**

## How we got here

1. First script run: bad endpoint assumption, 0/140 (fixed — see git history).
2. Second run (naive fuzzy search, no validation): 48/140 matched by the API,
   but a full hand review found only 15 were genuinely correct — 33 were
   false positives from matching on a single shared generic word.
3. Script rewritten with an `isPlausibleMatch()` token-overlap gate. Re-run:
   28/140 matched (13 new candidates on top of the 15 cached).
4. Hand review of the 13 new candidates — this time checking the actual
   downloaded image, not just the name — found 8 correct and 5 more false
   positives, including one the *name* looked perfect for (Shrugs <-
   "Shoulder Shrug") but whose uploaded image turned out to be an unrelated
   app/logo icon, not a photo of the exercise at all. That one wouldn't have
   been caught by any text-based check — only by opening the image.

**Confirmed total: 15 + 8 = 23 / 140.**

## Confirmed correct (23)

- Barbell Bench Press <- "Bench Press"
- Bulgarian Split Squat <- "Bulgarian split squats left"
- Cable Fly <- "Cable Cross-over"
- Deadlift <- "Deadlifts"
- Dips <- "Dips"
- Front Squat <- "Front Squats"
- Handstand Hold <- "Handstand Pushup"
- Handstand Push-Up <- "Handstand Pushup"
- Hollow Body Hold <- "Hollow Hold"
- Lat Pulldown <- "Close-grip Lat Pull Down"
- Leg Curl <- "Leg Curl"
- Pistol Squat <- "Pistol Squat"
- Plank Complex <- "Plank"
- Plank Variations <- "Plank"
- Push Press <- "Push Press"
- Ring Dips <- "Dips"
- Single-Arm Cable Row <- "Lateral Rows on Cable, One Armed"
- T-Bar Row <- "Rowing, T-bar"
- Tricep Pushdown <- "Tricep Pushdown on Cable"
- Walking Lunge <- "Dumbbell Lunges Walking"
- Weighted Dip <- "Dips"
- Weighted Plank Hold <- "Plank"
- Weighted Pull-Up <- "Pull-ups"

## Round 2 false positives, removed (5)

- Nordic Curl <- "Reverse Nordic Curl" — opposite movement (leans backward,
  quad-focused) from what "Nordic Curl" means (leans forward, hamstring-
  focused). The validation gate passed this because both names share
  "nordic" and "curl" — it has no way to know "reverse" flips the exercise.
- Leg Press <- "Calf Press Using Leg Press Machine" — same machine, different
  exercise; the photo's insets specifically show toes-only foot placement
  for calf isolation, not the full-foot position our cue describes.
- Cable Pullover <- "Cable Cross-over" — same false positive as round 1,
  slipped past the gate because "over" is a substring of "pullover" (a
  short-suffix collision the token check doesn't guard against).
- Close-Grip Bench Press <- "Bench Press" — same false positive as round 1;
  our gate strips "close" and "grip" as generic/stopword tokens, so it can't
  tell this apart from a plain bench press. The photo shows a wide grip.
- Shrugs <- "Shoulder Shrug" — name match was perfect, but the actual
  uploaded image is an unrelated logo/icon, not an exercise photo at all.
  No text-based check would catch this; only opening the image did.

## Lesson for next time

Every one of these 5 passed the token-overlap gate (or would have passed
any reasonable name-based check) — the gate catches "shares one generic
word" false positives, not "shares real words but means something
different" or "the image itself is wrong." Any future match, cached or
new, should still get a quick visual check before being trusted, not just
a name comparison.

## Round 1 false positives, removed (33)

See git history (commit "Curate wger photo matches: keep 15 verified, drop
33 false positives") for the full list and reasoning — kept out of this
file to stay focused on current state.

## Remaining gap (117 / 140)

The rest of exerciseLibrary.js's 140 exercises still render the stick-figure
diagram. Breakdown from the round-2 run (before this review's removals):
32 had no wger candidates at all, 41 had candidates but none passed the
plausibility gate, 39 matched a plausible exercise with no photo uploaded.
Re-run scripts/fetch-wger-photos.mjs for a fresh breakdown against the
current (smaller) manifest if pursuing more coverage — each new match still
needs the same by-hand review (name AND image) before being trusted.
