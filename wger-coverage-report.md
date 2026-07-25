# wger.de Photo Coverage Report

Status as of the manual quality review (2026-07-25): **15 / 140 confirmed.**

The script's second run found 48 candidate matches, but a full hand review
against wger.de's own images (comparing each candidate's actual photo/name to
our exerciseLibrary.js form cue) found that only 15 were genuinely the same
exercise. The other 33 were false positives from the fuzzy search matching on
a shared generic word (e.g. "Barbell", "Press", "Hold", "Leg") rather than the
exercise actually being the same movement — see examples below. Those 33 were
removed from the manifest rather than shipped, since a real photo of the
wrong exercise is worse than the stick-figure fallback.

The script (scripts/fetch-wger-photos.mjs) has since been rewritten with a
stricter token-overlap validation gate intended to catch this whole class of
false positive automatically, plus a report that will break misses down by
reason (no candidates / rejected by the gate / matched but no photo /
download failed) instead of one flat "unmatched" bucket. That version hasn't
been run against the live API yet — this file reflects the manual review of
the *previous* run's output, not a fresh automated run.

## Confirmed correct (15)

- Deadlift <- "Deadlifts"
- Walking Lunge <- "Dumbbell Lunges Walking"
- Barbell Bench Press <- "Bench Press"
- Cable Fly <- "Cable Cross-over"
- Single-Arm Cable Row <- "Lateral Rows on Cable, One Armed"
- Lat Pulldown <- "Close-grip Lat Pull Down"
- Weighted Pull-Up <- "Pull-ups"
- Ring Dips <- "Dips"
- Handstand Push-Up <- "Handstand Pushup"
- Handstand Hold <- "Handstand Pushup"
- Plank Complex <- "Plank"
- Plank Variations <- "Plank"
- Weighted Plank Hold <- "Plank"
- Hollow Body Hold <- "Hollow Hold"
- Leg Curl <- "Leg Curl"

## Removed as false positives (33) — reverted to the stick-figure diagram

Format: our exercise <- what wger actually returned <- why it's wrong.

- Front Squat <- "Front Raises" — different exercise (leg vs shoulder), matched on "Front"
- Zercher Deadlift <- "Deadlifts" — photo won't show the defining elbow-crook bar position
- Romanian Deadlift <- "Deadlifts" — photo shows a different starting position than the form cue describes
- Trap Bar Deadlift <- "Deadlifts" — photo shows a straight bar, not a trap/hex bar
- Nordic Curl <- "Leg Curl" — bodyweight floor exercise vs a machine, completely different
- Jump Lunge <- "Lunges" — photo won't show the explosive jump that defines this variant
- Close-Grip Bench Press <- "Bench Press" — photo won't show the narrow grip the cue calls out
- Incline Dumbbell Press <- "Benchpress Dumbbells" — likely a flat bench, contradicts "incline"
- Incline Press <- "Bench Press" — flat barbell bench shown for an incline-labeled exercise
- Dumbbell Fly <- "Benchpress Dumbbells" — a press movement, not a fly
- Push Press <- "Bench Press" — standing overhead press vs lying chest press, matched on "Press" only
- Barbell Row <- "Barbell Ab Rollout" — core exercise vs back exercise, matched on "Barbell" only
- Cable Pullover <- "Cable Cross-over" — different movement pattern despite both being cable exercises
- Archer Pull-Up <- "Pull-ups" — photo won't show the defining asymmetric arm position
- L-Sit Hold <- "Axe Hold" — unrelated grip-strength hold, not the gymnastic L-sit
- Hanging Windshield Wiper <- "Sloper hanging" — rock-climbing term, unrelated
- Dips <- "Barbell Triceps Extension" — different equipment and movement entirely
- Weighted Dip <- "Barbell Triceps Extension" — same issue
- Weighted Plank Complex <- "Weighted Crunch" — spinal flexion vs a static hold, different families
- Pallof Press <- "Bench Press" — standing anti-rotation core exercise vs lying chest press
- Barbell Curl <- "Barbell Ab Rollout" — bicep vs core, matched on "Barbell" only
- Skull Crusher <- "Leg Press" — completely unrelated
- Shrugs <- "Barbell Ab Rollout" — traps vs core, matched on "Barbell" only
- Leg Press <- "Bench Press" — leg machine vs chest press, matched on "Press" only
- Calf Raise <- "Leg Curls (standing)" — different exercise
- Standing Calf Raise <- "Leg Curls (standing)" — same issue
- Sled Push <- "Push Press" — different equipment and movement, matched on "Push"
- Medicine Ball Slam <- "Medicine ball booklet crunch" — explosive slam vs a seated ab crunch
- Medicine Ball Throw <- "Medicine ball booklet crunch" — same issue
- Lateral Bounds <- "Lateral Raises" — explosive jumping vs a shoulder isolation exercise
- Rowing Sprints <- "Rowing, T-bar" — cardio machine vs a strength exercise, matched on "Rowing"
- Mobility Flow <- "Banded Ankle Mobility" — one narrow drill standing in for a general concept
- Deep Squat Hold Flow <- "Hollow Hold" — standing squat hold vs a lying ab exercise

## Still unmatched, reason unknown (92)

These were unmatched in the previous run, but that run's report didn't record
*why* (no candidates vs. matched-but-no-photo vs. something else) — only
console output did, which wasn't saved. The rewritten script now tracks this
per-exercise. Re-run scripts/fetch-wger-photos.mjs to get an accurate
breakdown for these; see the tool's own coverage-report output for the
current list.
