// Shared exercise library keyed by exact exercise name, as it appears in
// characterPlans.js. Every hero's workout plan reuses these entries instead
// of duplicating a diagram or form cue whenever two heroes share a move
// (e.g. Bench Press) — see ExerciseModal / WorkoutPlan for where this is
// consumed.

export const EXERCISES = {
  // Squat family
  'Back Squat': { pose: 'squat', equipment: 'barbellShoulder', cue: "Bar across your upper back, feet shoulder-width — squat until hips drop below knee height, then drive up through your heels." },
  'Front Squat': { pose: 'squat', equipment: 'barbellShoulder', cue: "Bar racked across the front of your shoulders, elbows high — squat down keeping your torso upright so the bar doesn't roll forward." },
  'Bulgarian Split Squat': { pose: 'lunge', equipment: 'dumbbells', cue: "Rear foot up on a bench, front foot planted — lower straight down until your front thigh is parallel to the floor." },
  'Pistol Squat': { pose: 'squatHold', equipment: null, cue: "Balance on one leg, extend the other straight out in front, and squat down as low as control allows before standing back up." },
  'Zercher Deadlift': { pose: 'hinge', equipment: 'barbellLow', cue: "Cradle the bar in the crooks of your elbows and stand it up by driving your hips forward, keeping your chest tall." },
  'Squat Jump': { pose: 'jump', equipment: null, cue: "Squat down, then explode straight up as high as you can, landing soft with bent knees." },
  'Trap Bar Jump': { pose: 'jump', equipment: 'barbellLow', cue: "Stand inside a loaded trap bar, dip into a quarter squat, then jump straight up and land softly." },

  // Hinge family
  'Deadlift': { pose: 'hinge', equipment: 'barbellLow', cue: "Hinge at the hips with a flat back, grip the bar just outside your shins, and stand up by driving your hips forward." },
  'Romanian Deadlift': { pose: 'hinge', equipment: 'barbellLow', cue: "Keep knees soft and push your hips straight back, lowering the bar along your legs until you feel a hamstring stretch." },
  'Trap Bar Deadlift': { pose: 'hinge', equipment: 'barbellLow', cue: "Stand inside the trap bar, hinge down to grip the handles, and stand tall by driving through your heels." },
  'Single-Leg RDL': { pose: 'hinge', equipment: 'dumbbells', cue: "Balance on one leg and hinge forward, letting the free leg extend back as the dumbbell lowers toward the floor." },
  'Nordic Curl': { pose: 'nordic', equipment: null, cue: "Kneel with ankles anchored and lower your torso forward under control, using your hamstrings to resist the fall." },

  // Lunge / step family
  'Walking Lunge': { pose: 'lunge', equipment: 'dumbbells', cue: "Step forward into a lunge, drop your back knee toward the floor, then push off to bring the back foot through to the next step." },
  'Jump Lunge': { pose: 'jump', equipment: null, cue: "Lunge down, then jump and switch legs in the air, landing softly in a lunge on the opposite side." },
  'Weighted Step-Up': { pose: 'stepUp', equipment: 'dumbbells', cue: "Step fully onto a box with one foot, drive through that heel to stand tall, then step back down with control." },

  // Press / bench family
  'Barbell Bench Press': { pose: 'benchPress', equipment: 'barbellChest', cue: "Lower the bar to your chest with elbows at about 45°, then press it back up to full arm extension." },
  'Close-Grip Bench Press': { pose: 'benchPress', equipment: 'barbellChest', cue: "Grip just inside shoulder width and lower the bar to your lower chest, keeping elbows tucked to target the triceps." },
  'Incline Dumbbell Press': { pose: 'benchPress', equipment: 'dumbbells', cue: "On an inclined bench, press the dumbbells up and slightly together until your arms are extended above your chest." },
  'Incline Press': { pose: 'benchPress', equipment: 'barbellChest', cue: "On an inclined bench, press the bar from your upper chest to full arm extension." },
  'Dumbbell Fly': { pose: 'flyLying', equipment: 'dumbbells', cue: "Lying on a bench with a slight elbow bend, lower the dumbbells out to your sides, then squeeze them back together over your chest." },
  'Cable Fly': { pose: 'flyStanding', equipment: 'cableStack', cue: "Standing between the cable towers, sweep both handles forward and together in front of your chest." },
  'Push Press': { pose: 'overheadPress', equipment: 'barbellHigh', cue: "Dip your knees slightly, then drive the bar overhead using your legs and shoulders together." },
  'Overhead Press': { pose: 'overheadPress', equipment: 'barbellHigh', cue: "Press the bar straight overhead from shoulder height until your arms are fully locked out." },
  'Arnold Press': { pose: 'overheadPress', equipment: 'dumbbells', cue: "Start with palms facing you at shoulder height, then press up while rotating your palms to face forward at the top." },
  'Landmine Press': { pose: 'overheadPress', equipment: 'barbellLow', cue: "Grip the raised end of a landmine bar at your shoulder and press it up and forward at an angle." },
  'Landmine Rotations': { pose: 'throw', equipment: 'barbellLow', cue: "Grip the end of a landmine bar with both hands and rotate your torso to swing it side to side at hip height." },

  // Row / pull family
  'Barbell Row': { pose: 'row', equipment: 'barbellLow', cue: "Hinge forward with a flat back and pull the bar up to your lower ribs, squeezing your shoulder blades together." },
  'T-Bar Row': { pose: 'row', equipment: 'barbellLow', cue: "Straddle the bar, hinge forward, and row the handle up into your torso, keeping your back flat." },
  'Single-Arm Cable Row': { pose: 'row', equipment: 'cableStack', cue: "Row the handle straight back to your ribs one arm at a time, keeping your torso still." },
  'Dip Superset Row': { pose: 'row', equipment: 'dumbbells', cue: "Pair a set of dips with a set of rows back to back with no rest between them." },
  'Lat Pulldown': { pose: 'pulldown', equipment: 'cableStack', cue: "Pull the bar down to your upper chest, driving your elbows down and back, then control it back up." },
  'Straight-Arm Lat Pulldown': { pose: 'pulldown', equipment: 'cableStack', cue: "Keeping your arms straight, pull the bar down from overhead to your thighs using your lats, not your arms." },
  'Face Pull': { pose: 'pulldown', equipment: 'cableStack', cue: "Pull the rope toward your face, flaring your elbows out wide and squeezing your rear shoulders." },
  'Cable Pullover': { pose: 'pulldown', equipment: 'cableStack', cue: "With arms straight, pull the cable from overhead down to your thighs, driven by your lats." },
  'Pull-Up': { pose: 'pullup', equipment: 'pullupBar', cue: "Hang from the bar with hands just outside shoulder width and pull your chin over the bar." },
  'Weighted Pull-Up': { pose: 'pullup', equipment: 'pullupBar', cue: "With extra weight attached, pull yourself up until your chin clears the bar, then lower under control." },
  'Archer Pull-Up': { pose: 'pullup', equipment: 'pullupBar', cue: "Pull up while shifting your weight toward one hand, keeping the other arm nearly straight out to the side." },
  'Muscle-Up': { pose: 'pullup', equipment: 'pullupBar', cue: "Pull up explosively past the bar and transition into a dip to finish with your arms locked out above it." },
  'Front Lever Progression': { pose: 'hang', equipment: 'pullupBar', cue: "Hang from the bar and work toward raising your straight body to horizontal, keeping your core braced." },
  'Weighted Dead Hang': { pose: 'hang', equipment: 'pullupBar', cue: "Hang from the bar with added weight and hold your grip for as long as possible without swinging." },
  'L-Sit Hold': { pose: 'hang', equipment: 'pullupBar', cue: "Hang or support yourself on bars and lift your straight legs to hip height, holding the position." },
  'Hanging Leg Raise': { pose: 'hangLegRaise', equipment: 'pullupBar', cue: "Hang from the bar and raise your legs to at least hip height without swinging, then lower slowly." },
  'Hanging Windshield Wiper': { pose: 'hangLegRaise', equipment: 'pullupBar', cue: "Hang from the bar with legs raised and rotate them side to side like windshield wipers, keeping your core tight." },

  // Dip family
  'Dips': { pose: 'dip', equipment: null, cue: "Lower your body between the bars until your shoulders dip below your elbows, then press back up." },
  'Weighted Dip': { pose: 'dip', equipment: null, cue: "With added weight, lower under control between the bars and press back up to full lockout." },
  'Ring Dips': { pose: 'dip', equipment: null, cue: "On gymnastic rings, lower into a dip while keeping the rings steady, then press back to full extension." },

  // Push-up / plank family
  'Push-Up Finisher': { pose: 'pushupBottom', equipment: null, cue: "Lower your chest to the floor and press back up, repeating to failure to finish the movement." },
  'Push-Up Variations': { pose: 'pushupTop', equipment: null, cue: "Rotate through a few push-up styles — wide, diamond, decline — to hit the chest from different angles." },
  'Plyo Push-Up': { pose: 'pushupBottom', equipment: null, cue: "Push up explosively so your hands leave the floor, then land softly and absorb into the next rep." },
  'Handstand Push-Up': { pose: 'handstand', equipment: null, cue: "Kick up into a handstand against a wall and lower your head toward the floor before pressing back up." },
  'Handstand Hold': { pose: 'handstand', equipment: null, cue: "Kick up into a handstand against a wall and hold a straight, stacked line from wrists to ankles." },
  'Plank Complex': { pose: 'plank', equipment: null, cue: "Hold a straight-line plank and rotate through variations — forearm, side, shoulder taps — without letting your hips sag." },
  'Plank Variations': { pose: 'plank', equipment: null, cue: "Move between plank styles, keeping your core braced and hips level throughout." },
  'Weighted Plank Complex': { pose: 'plank', equipment: 'plateObj', cue: "Hold a plank with a weight plate on your back, rotating through variations while keeping your hips level." },
  'Weighted Plank Hold': { pose: 'plank', equipment: 'plateObj', cue: "Hold a strict plank with a plate on your back, breathing steadily while keeping your hips in line." },
  'Hollow Body Hold': { pose: 'situp', equipment: null, cue: "Lie on your back, press your lower back into the floor, and hold your arms and legs lifted in a shallow curve." },
  'Dragon Flag': { pose: 'situp', equipment: null, cue: "Lying on a bench, brace your core and lower your straight body from vertical down to a hover, keeping only your shoulders in contact." },
  'Prone Stability Holds': { pose: 'plank', equipment: null, cue: "Hold a strict plank position, resisting any rotation or sagging through your hips." },

  // Core / sit-up family
  'Weighted Sit-Up': { pose: 'situp', equipment: 'plateObj', cue: "Holding a plate at your chest, curl up from the floor to a full sit-up, then lower with control." },
  'Core Circuit': { pose: 'situp', equipment: null, cue: "Move through a short circuit of core exercises — planks, sit-ups, leg raises — back to back." },
  'Core Finisher': { pose: 'situp', equipment: null, cue: "Finish your session with a short, high-effort round of core work to failure." },
  'Core Flow Circuit': { pose: 'situp', equipment: null, cue: "Flow between core holds and movements at a controlled pace, focusing on smooth transitions." },
  'Flutter Kicks': { pose: 'situp', equipment: null, cue: "Lying on your back with legs extended, alternate small up-and-down kicks while keeping your lower back pressed to the floor." },
  'Anti-Rotation Press': { pose: 'plank', equipment: 'cableStack', cue: "Press a cable straight out from your chest while resisting the pull that tries to rotate your torso." },
  'Pallof Press': { pose: 'plank', equipment: 'cableStack', cue: "Press the cable straight out from your chest and hold, resisting the urge to rotate toward the machine." },
  'Cable Rotation': { pose: 'plank', equipment: 'cableStack', cue: "Rotate your torso to pull the cable across your body, keeping your hips facing forward." },
  'Stability Ball Circuit': { pose: 'plank', equipment: null, cue: "Move through a short circuit of stability-ball core and balance exercises." },

  // Arm isolation
  'Barbell Curl': { pose: 'armIsolation', equipment: 'barbellLow', cue: "Curl the bar from your thighs up to your shoulders, keeping your elbows pinned to your sides." },
  'Tricep Pushdown': { pose: 'armIsolation', equipment: 'cableStack', cue: "Keeping your elbows tucked at your sides, push the cable bar down until your arms are straight." },
  'Skull Crusher': { pose: 'benchPress', equipment: 'dumbbells', cue: "Lying on a bench, bend only at the elbows to lower the weight toward your forehead, then extend back up." },
  'Lateral Raise': { pose: 'armIsolation', equipment: 'dumbbells', cue: "Raise the dumbbells out to your sides until your arms are roughly parallel to the floor, then lower slowly." },
  'Shrugs': { pose: 'armIsolation', equipment: 'barbellLow', cue: "Holding weight at your sides, shrug your shoulders straight up toward your ears, then lower with control." },

  // Leg machine family
  'Leg Press': { pose: 'legMachine', equipment: 'machineSeat', cue: "Press the platform away by extending your legs, stopping just short of locking out your knees." },
  'Leg Extension': { pose: 'legMachine', equipment: 'machineSeat', cue: "Extend your legs against the pad until they're straight, then lower back down under control." },
  'Leg Curl': { pose: 'legMachine', equipment: 'machineSeat', cue: "Curl the pad toward your glutes by bending your knees, then lower back down slowly." },
  'Calf Raise': { pose: 'stand', equipment: null, cue: "Rise up onto your toes as high as possible, then lower your heels back down under control." },
  'Standing Calf Raise': { pose: 'stand', equipment: 'barbellShoulder', cue: "With a bar on your back, rise up onto your toes and lower back down for a full stretch each rep." },
  'Seated Calf Raise': { pose: 'legMachine', equipment: 'machineSeat', cue: "Seated with the pad on your knees, raise your heels as high as possible, then lower for a deep stretch." },

  // Carry family
  'Farmer Carry': { pose: 'carry', equipment: 'dumbbells', cue: "Grip a heavy weight in each hand and walk with tall posture and controlled steps." },
  'Weighted Carry': { pose: 'carry', equipment: 'dumbbells', cue: "Carry a weight at your side (or overhead) for distance, keeping your core braced against the load." },
  'Single-Arm Carry': { pose: 'carry', equipment: 'dumbbells', cue: "Carry a heavy weight in one hand only, resisting the urge to lean, then switch sides." },
  'Heavy Trap Bar Carry': { pose: 'carry', equipment: 'barbellLow', cue: "Lift a loaded trap bar to standing and walk forward with short, controlled steps." },
  'Sled Drag': { pose: 'carry', equipment: 'sledObj', cue: "Attach a strap to a loaded sled and walk backward or forward, dragging it at a steady pace." },
  'Sled Push': { pose: 'push', equipment: 'sledObj', cue: "Load the sled, get low, and drive it forward in short, powerful steps." },

  // Kettlebell
  'Kettlebell Swing': { pose: 'kettlebell', equipment: 'kettlebellObj', cue: "Hinge at the hips and hike the kettlebell back, then snap your hips forward to swing it to chest height." },
  'Kettlebell Complex': { pose: 'kettlebell', equipment: 'kettlebellObj', cue: "Move through a sequence of kettlebell lifts back to back without setting the bell down." },

  // Throw
  'Medicine Ball Slam': { pose: 'throw', equipment: 'medicineBall', cue: "Raise the ball overhead and slam it straight down into the floor as hard as you can, then reset." },
  'Medicine Ball Throw': { pose: 'throw', equipment: 'medicineBall', cue: "Explosively throw the ball against a wall or to a drill partner, then reset and repeat." },
  'Rotational Throws': { pose: 'throw', equipment: 'medicineBall', cue: "Rotate your hips and torso to throw the ball sideways against a wall, then repeat on the other side." },

  // Jump family
  'Box Jump': { pose: 'jump', equipment: 'plyoBox', cue: "Swing your arms and jump onto the box, landing softly with both feet, then step back down." },
  'Broad Jump': { pose: 'jump', equipment: null, cue: "Swing your arms and jump forward as far as possible, landing softly with bent knees." },
  'Lateral Bounds': { pose: 'jump', equipment: null, cue: "Jump sideways from one foot to the other, sticking each landing before bounding back the other way." },

  // Bag / solo combat
  'Heavy Bag Combos': { pose: 'bagStrike', equipment: 'heavyBag', cue: "Work combinations of punches on the heavy bag, staying light on your feet between combos." },
  'Heavy Bag Rounds': { pose: 'bagStrike', equipment: 'heavyBag', cue: "Work the heavy bag for timed rounds, mixing punches at a steady, sustainable pace." },
  'Heavy Bag Kick Rounds': { pose: 'bagStrike', equipment: 'heavyBag', cue: "Work kicks on the heavy bag for timed rounds, resetting your stance between each one." },
  'Heavy Bag Knee Strikes': { pose: 'bagStrike', equipment: 'heavyBag', cue: "Drive knee strikes into the heavy bag, pulling it into you for extra resistance." },
  'Heavy Bag Slashing Combos': { pose: 'bagStrike', equipment: 'heavyBag', cue: "Work fast, chopping strike combinations on the heavy bag, keeping your guard up between them." },
  'Heavy Bag Work': { pose: 'bagStrike', equipment: 'heavyBag', cue: "Freestyle on the heavy bag — punches, footwork, and movement — for the set duration." },
  'Shadow Boxing': { pose: 'bagStrike', equipment: null, cue: "Throw combinations at an imaginary opponent, focusing on footwork, head movement, and form." },
  'Speed Bag': { pose: 'bagStrike', equipment: 'speedBag', cue: "Keep a steady rhythm striking the speed bag with alternating hands." },

  // Rope / battle ropes
  'Rope Climb': { pose: 'rope', equipment: 'ropeCeiling', cue: "Climb hand over hand up the rope using your arms and a scissor or J-hook leg lock for support." },
  'Battle Ropes': { pose: 'battleRopes', equipment: null, cue: "Whip the ropes in alternating waves as hard as you can for the set duration." },

  // TRX / suspension
  'TRX Suspension Circuit': { pose: 'trx', equipment: 'trxStraps', cue: "Move through a circuit of suspension-trainer rows, presses, and holds, adjusting the strap angle to change difficulty." },
  'TRX Suspension Hold': { pose: 'trx', equipment: 'trxStraps', cue: "Lean back into the straps and hold a strong, straight-body position at a challenging angle." },
  'Web-Swing Simulation (TRX)': { pose: 'trx', equipment: 'trxStraps', cue: "Swing side to side while suspended in the straps, controlling the motion with your core and grip." },

  // Strongman
  'Tire Flip': { pose: 'strongman', equipment: 'tireObj', cue: "Squat down, grip low under the tire, and drive through your legs and hips to flip it over." },
  'Sledgehammer Slams': { pose: 'strongman', equipment: 'sledgehammerObj', cue: "Swing the sledgehammer overhead and down into a tire, alternating hand positions each rep." },

  // Olympic lifts
  'Power Clean': { pose: 'oly', equipment: 'barbellLow', cue: "Pull the bar explosively from the floor and catch it at your shoulders in a quarter-squat." },
  'Clean & Jerk': { pose: 'oly', equipment: 'barbellLow', cue: "Clean the bar to your shoulders, then dip and drive it overhead to lock your arms out." },
  'Snatch': { pose: 'oly', equipment: 'barbellLow', cue: "Pull the bar from the floor to overhead in one continuous motion, catching it in a squat." },

  // Cardio machines
  'Rowing Machine': { pose: 'cardioMachine', equipment: 'rowerSeat', cue: "Drive with your legs first, then lean back and pull the handle to your ribs, reversing the order on the way in." },
  'Rowing Sprints': { pose: 'cardioMachine', equipment: 'rowerSeat', cue: "Row at a hard, sustainable sprint pace for the set distance, then rest and repeat." },
  'Assault Bike Sprints': { pose: 'cardioMachine', equipment: 'bikeObj', cue: "Sprint on the assault bike at maximum effort for the set time, then pedal easy to recover." },
  'Stair Climber Sprints': { pose: 'cardioMachine', equipment: 'stairsObj', cue: "Climb at a fast, controlled pace on the stair machine for the set time or flight count." },
  'Incline Treadmill Walk': { pose: 'cardioMachine', equipment: 'treadmillDeck', cue: "Set the treadmill to a steep incline and walk at a brisk, sustainable pace." },
  'Treadmill Sprint Finisher': { pose: 'cardioMachine', equipment: 'treadmillDeck', cue: "Finish your session with hard treadmill sprints at the set distance or time." },
  'Treadmill Sprint Intervals': { pose: 'cardioMachine', equipment: 'treadmillDeck', cue: "Alternate hard treadmill sprints with easy recovery walks for the set number of rounds." },
  'Treadmill Tempo Run': { pose: 'cardioMachine', equipment: 'treadmillDeck', cue: "Hold a steady, challenging pace on the treadmill for the full distance." },
  'Weighted Vest Treadmill March': { pose: 'cardioMachine', equipment: 'treadmillDeck', cue: "Wearing a weighted vest, march at an incline on the treadmill at a steady pace." },
  'Jump Rope': { pose: 'jump', equipment: 'jumpRopeObj', cue: "Keep a steady bounce and turn the rope with your wrists, not your arms." },

  // Crawl / flow / bodyweight
  'Bear Crawl': { pose: 'crawl', equipment: null, cue: "Crawl forward on hands and feet with your knees hovering just off the floor, keeping your back flat." },
  'Sprawls': { pose: 'crawl', equipment: null, cue: "Drop from standing into a plank, then explosively jump your feet back under you and stand up." },
  'Animal Flow': { pose: 'crawl', equipment: null, cue: "Move fluidly between ground-based bodyweight positions, keeping your core engaged throughout." },
  'Burpees': { pose: 'crawl', equipment: null, cue: "Drop into a plank, add a push-up if able, jump your feet in, then jump up with your arms overhead." },
  'Mobility Flow': { pose: 'stand', equipment: null, cue: "Move slowly through a sequence of joint-mobility drills, holding each position for a few breaths." },
  'Hip Mobility Flow': { pose: 'stand', equipment: null, cue: "Move through a series of hip openers and rotations to loosen up before or after training." },
  'Deep Squat Hold Flow': { pose: 'squatHold', equipment: null, cue: "Settle into the bottom of a deep squat and gently rock or reach through the position to open your hips." },
  'Yoga Cooldown Flow': { pose: 'stand', equipment: null, cue: "Move slowly through a short sequence of stretches to bring your heart rate down and cool off." },

  // Agility / reaction / balance
  'Agility Ladder': { pose: 'stand', equipment: null, cue: "Move quickly through the ladder rungs with light, precise footwork, keeping your eyes up." },
  'Cone Agility Drills': { pose: 'stand', equipment: null, cue: "Sprint, shuffle, and cut between the cones as quickly as you can while staying under control." },
  'Reaction Ball Drills': { pose: 'stand', equipment: null, cue: "Drop or throw the reaction ball and react to its unpredictable bounce as quickly as possible." },
  'Reactive Dodge Drills': { pose: 'stand', equipment: null, cue: "Shift your weight and change direction quickly in response to a cue, staying light on your feet." },
  'Balance Board Hold': { pose: 'balance', equipment: null, cue: "Stand on the balance board and hold a stable position, making small corrections with your ankles and core." },
  'Balance Drills': { pose: 'balance', equipment: null, cue: "Practice holding a single-leg or unstable-surface balance for time, focusing on small, controlled corrections." },
  'Grip Crush Work': { pose: 'grip', equipment: 'gripperObj', cue: "Squeeze a hand gripper through a full range of motion for the set number of reps." },
  'Plate Pinch Hold': { pose: 'grip', equipment: 'plateObj', cue: "Pinch a weight plate between your fingers and thumb and hold for time without letting it slip." },
  'Breathing Drills': { pose: 'stand', equipment: null, cue: "Practice slow, controlled breathing — long inhales and full exhales — to build breath control under tension." },
  'Cable Draw Hold': { pose: 'row', equipment: 'cableStack', cue: "Pull a cable handle back to full draw like an archer and hold the position under tension." },

  // Circuits / misc
  'Randomized Gym Circuit': { pose: 'stand', equipment: null, cue: "Pull 4–5 exercises from your usual split — squats, presses, carries, core — and hit them back-to-back with minimal rest." },
  'Light Circuit': { pose: 'stand', equipment: null, cue: "Move through a light, easy-paced circuit of basic movements to stay active on a recovery day." },
}

export function getExerciseInfo(name) {
  return EXERCISES[name] ?? { pose: 'stand', equipment: null, cue: 'Perform this exercise with strict, controlled form for the prescribed sets and reps.' }
}
